import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini API Client
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
    console.log('Gemini API client initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Gemini API client:', error);
  }
} else {
  console.warn('GEMINI_API_KEY environment variable is not configured.');
}

// REST API for Chat Assistant
app.post('/api/chat', async (req, res) => {
  const { messages, userProfile, currentMode, currentPersonality, languagePreference } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'messages array is required' });
  }

  const userFactList = userProfile?.memories && Array.isArray(userProfile.memories)
    ? userProfile.memories.map((m: string) => `- ${m}`).join('\n')
    : '- No remembered facts yet.';

  const languageInstruction = {
    Mix: 'Use primarily Taglish (a friendly blend of Tagalog and English) which is natural for daily Filipino chats.',
    English: 'Use English only, but maintain a warm, friendly Filipino hospitality tone.',
    Tagalog: 'Use formal and deep Tagalog with a touch of modern companion warmth.',
    Bisaya: 'Use natural Bisaya/Cebuano, incorporating polite words and friendly local expressions.'
  }[languagePreference as 'Mix' | 'English' | 'Tagalog' | 'Bisaya'] || 'Use natural Taglish.';

  const systemInstruction = `
You are Artchie AI, a warm, caring, respectful, intelligent, and funny Filipino AI companion.
You serve as a trusted friend, mentor, listener, and hugot partner.

Core Identity:
- Name: Artchie AI
- Tagline: "Your AI Friend, Mentor, and Hugot Companion."
- Accentuate modern Filipino warmth, understanding, and sense of humor. Show active listening.

User Profile context:
- User Name: ${userProfile?.userName || 'Kaibigan'}
- Interests: ${userProfile?.interests || 'None specified yet'}
- Hobbies: ${userProfile?.hobbies || 'None specified yet'}
- Career Goals: ${userProfile?.goals || 'None specified yet'}
- Favorite Topics: ${userProfile?.favoriteTopics || 'None specified yet'}
- Your Saved Memories about them:
${userFactList}

Current Mode context:
You are acting in **${(currentMode || 'friend').toUpperCase()} Mode**:
- Friend Mode (🤝): Warm daily chat, light topics, check-ins, or interesting banter.
- Hugotero Mode (💔): Drama, emotional hugot lines, deep love advise, moving on, relation/LDR woes, comforting quotes, emotional venting.
- Creative Mode (🎵): Generating lyrics, song parts, spoken word, deep modern poems, catchy social titles.
- Mentor Mode (🚀): Inspiring work pathways, goal-checks, professional tips, learning focus, and motivational pushes.

Current Personality:
You are embodying a **${(currentPersonality || 'best_friend').toUpperCase()}** archetype:
- BEST_FRIEND: Casual, funny, loyal, uses light expressions, playful but supportive.
- HUGOTERO: Deeply poetic, dramatic, specializes in heartbroken lines, uses beautiful deep connections to stars, ocean, or commuting to explain love.
- MOTIVATOR: Powerful enthusiast, cheerleader, pushes user past limits, gives dynamic prompts.
- STORYTELLER: Calm narrator, speaks in captivating parabolas or modern narratives.
- SONGWRITER: Rhythmic, splits portions into [Verse], [Chorus] or rhyming stanzas.
- LIFE_COACH: Highly focused, structured advice, finishes with deep coaching questions to prompt user self-reflection.

Languages Instruction:
${languageInstruction}

IMPORTANT RESPONSE FORMATTING RULES:
1. Speak directly, keep it highly conversational, warm, and natural. Do NOT use dry robotic greetings. Mention their name gently once in a while.
2. At the very end of your response, on a completely NEW LINE, write exactly the following prefix:
METADATA:
followed by a raw JSON string (all on that same line) containing:
{"emotion": "Detected Emotion", "newMemory": "An interesting new user fact to remember, or null if nothing new was revealed in their prompt"}
Valid values for emotion are: 'Happy' | 'Excited' | 'Lonely' | 'Sad' | 'Stressed' | 'Motivated' (choose the closest based on current message).
Example:
Salamat sa pagbabahagi nito, kaibigan. Kakayanin mo yan! Focus lang sa goals!
METADATA:{"emotion": "Lonely", "newMemory": "Mentioned missing their family back in Cebu"}
3. DO NOT include code backticks around the METADATA JSON string. Keep it raw and clean on its own line.
`;

  // Format messages into contents for Gemini
  // The first few items can be modeled as system instructions in the config
  const contents = messages.map(msg => ({
    role: msg.sender === 'user' ? 'user' as const : 'model' as const,
    parts: [{ text: msg.text }]
  }));

  if (!ai) {
    // Return a beautiful mock response when API key is missing
    const mockResponses = [
      "Kumusta! Artchie here. Napansin ko na wala pang connected na GEMINI_API_KEY sa active secrets mo sa Settings. Pero huwag mag-alala, nandito pa rin ako para makinig sa iyo! 🌟 Sa ngayon ay gumagana muna ako sa basic offline mode.",
      "Uy kaibigan! offline mode muna tayo habang hinihintay nating mai-setup ang Gemini API key. Maluwag pa rin ang aking balikat para sandalan mo! Sabihin mo lang, ano ang nasa puso mo ngayon?",
      "Hello! Artchie here. I detected that my Gemini API Key is missing, but as your hugot companion, handa pa rin kitang bigyan ng comfort! 'Minsan, kailangan lang nating maghintay para sa tamang koneksyon.' 😉"
    ];
    const randomIndex = Math.floor(Math.random() * mockResponses.length);
    const mockRep = mockResponses[randomIndex];
    
    // Auto detect emotion based on input keywords
    let detectedEmotion = 'Sad';
    const textLower = (messages[messages.length - 1]?.text || '').toLowerCase();
    if (textLower.includes('happy') || textLower.includes('masaya') || textLower.includes('saya')) {
      detectedEmotion = 'Happy';
    } else if (textLower.includes('stress') || textLower.includes('pagod') || textLower.includes('gale')) {
      detectedEmotion = 'Stressed';
    } else if (textLower.includes('lungkot') || textLower.includes('sad') || textLower.includes('iyak')) {
      detectedEmotion = 'Sad';
    } else if (textLower.includes('alone') || textLower.includes('wala') || textLower.includes('lonely')) {
      detectedEmotion = 'Lonely';
    } else if (textLower.includes('kayat') || textLower.includes('laban') || textLower.includes('motivated')) {
      detectedEmotion = 'Motivated';
    }

    return res.json({
      reply: mockRep,
      emotion: detectedEmotion,
      newMemory: textLower.length > 5 && !textLower.includes('test') ? `Sinabi na gusto niyang pag-usapan ang: "${messages[messages.length - 1]?.text.slice(0, 40)}..."` : null
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.9,
      }
    });

    const outputText = response.text || '';
    
    // Parse the output to separate reply from METADATA
    let reply = outputText;
    let emotion = 'Happy';
    let newMemory = null;

    const metadataIndex = outputText.lastIndexOf('METADATA:');
    if (metadataIndex !== -1) {
      reply = outputText.substring(0, metadataIndex).trim();
      const metadataStr = outputText.substring(metadataIndex + 9).trim();
      try {
        const metadata = JSON.parse(metadataStr);
        emotion = metadata.emotion || 'Happy';
        newMemory = metadata.newMemory || null;
      } catch (parseError) {
        console.error('Error parsing metadata JSON from Gemini response:', parseError);
        // Fallback checks
        reply = outputText.replace(/METADATA:.*$/s, '').trim();
      }
    }

    return res.json({ reply, emotion, newMemory });
  } catch (error: any) {
    console.error('Error communicating with Gemini API:', error);
    return res.status(500).json({ error: error?.message || 'Failed to generate response' });
  }
});

// Daily features endpoint to yield greeting summaries
app.post('/api/daily', async (req, res) => {
  const { type, userProfile, languagePreference } = req.body;
  
  if (!ai) {
    const mockDaily = {
      morning: "Magandang umaga, kaibigan! ☀️ Simulan natin ang araw na may ngiti. Tandaan, bawat gising mo ay pagkakataon para magbago at bumangon.",
      motivation: "Huwag kang matakot magmula sa simula. Ang pinakamataas na puno ay nagmula muna sa maliit na binhi. Laban lang! 💪",
      quote: "“Ang sikreto ng tagumpay ay ang hindi pagsuko kahit gaano kabagal ang iyong takbo.” - Artchie AI 💔",
      reflection: "Naitanong mo na ba sa sarili mo ngayon: 'Masaya ba ako sa ginagawa ko ngayon, o dumedepende lang ako sa kung anong madaling lagpasan?'",
      evening: "Magandang gabi! 🌱 Oras na para magpahinga. Iwanan muna ang mga isipin ng araw na ito. Mahusay ka ngayon."
    }[type as 'morning' | 'motivation' | 'quote' | 'reflection' | 'evening'] || "Nandito lang ako palagi.";
    
    return res.json({ text: mockDaily });
  }

  const systemPrompt = `
You are Artchie AI, Filipino Companion. Generate a customized card response for the category: "${type}".
The user is ${userProfile?.userName || 'Kaibigan'}.
Their interests: ${userProfile?.interests || 'not documented'}.
Their goals: ${userProfile?.goals || 'not documented'}.

Categories guide:
- morning: An absolute refreshing Good Morning greeting tailored with custom Filipino hospitality, reminding them of self-worth and wishing success for their goals.
- motivation: A powerhouse motivational hugot/inspiration to keep pushing with career or coding or freelancing.
- quote: A beautiful, deep unique Hugot Quote or Inspirational Quote about life and persistence in Taglish.
- reflection: An emotional or introspective deep daily reflection question to help them ponder their career, love, or personal happiness.
- evening: A calming, heart-warming, relaxing evening check-in, congratulating them on completing the day and inviting peaceful rest.

Language preference: ${languagePreference || 'Mix'}.
Keep it concise, deeply warm, friendly, using Filipino figures of speech, and visually engaging (with spacing & emojis). Max 3-4 sentences. Do not add any metadata labels. Just return the generated text.
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: 'Generate the message.',
      config: {
        systemInstruction: systemPrompt,
        temperature: 0.9,
      }
    });

    return res.json({ text: response.text || '' });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// Serve frontend assets
if (process.env.NODE_ENV !== 'production') {
  const { createServer: createViteServer } = await import('vite');
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  });
  app.use(vite.middlewares);
} else {
  const distPath = path.join(process.cwd(), 'dist');
  app.use(express.static(distPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

if (!process.env.VERCEL) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

export default app;
