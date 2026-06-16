import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Heart,
  MessageSquare,
  Compass,
  User,
  Settings,
  Brain,
  Send,
  Loader2,
  Trash2,
  Plus,
  Moon,
  ChevronRight,
  Bookmark,
  Share2,
  Menu,
  Volume2,
  X,
  Info
} from 'lucide-react';

import { Message, CompanionMode, AIPersonality, UserProfile, ChatSession } from './types';
import WelcomeScreen from './components/WelcomeScreen';
import PersonalitySelection from './components/PersonalitySelection';
import MemoryPage from './components/MemoryPage';
import SettingsPage from './components/SettingsPage';

const LOCAL_STORAGE_PROFILE_KEY = 'ARTCHIE_USER_PROFILE';
const LOCAL_STORAGE_SESSIONS_KEY = 'ARTCHIE_CHAT_SESSIONS';

const DEFAULT_PROFILE: UserProfile = {
  userName: '',
  interests: '',
  hobbies: '',
  goals: '',
  favoriteTopics: '',
  memories: [],
  currentMode: 'friend',
  currentPersonality: 'best_friend',
  languagePreference: 'Mix',
  theme: 'midnight',
};

export default function App() {
  // Profiles & Settings state
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'chat' | 'personality' | 'memory' | 'settings'>('chat');
  const [showWelcome, setShowWelcome] = useState<boolean>(true);

  // Layout UI helper states
  const [leftSidebarOpen, setLeftSidebarOpen] = useState<boolean>(true);
  const [rightSidebarOpen, setRightSidebarOpen] = useState<boolean>(true);
  
  // Daily inspiration card status
  const [dailyInspirationText, setDailyInspirationText] = useState<string>(
    "\"Minsan hindi tayo nasasaktan dahil iniwan tayo. Nasasaktan tayo dahil umaasa pa rin tayo sa mga salitang hindi naman talaga tinutupad.\""
  );
  const [dailyInspirationLabel, setDailyInspirationLabel] = useState<string>("Inspirational Hugot Quote");
  const [isGeneratingDaily, setIsGeneratingDaily] = useState<boolean>(false);

  // Chat inputs
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoadingChat, setIsLoadingChat] = useState<boolean>(false);
  const [recentEmotion, setRecentEmotion] = useState<string>('Warm');
  const [activeNotification, setActiveNotification] = useState<string | null>(null);

  // Scroll anchor reference
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Dynamic viewport height tracking for virtual keyboards on touch devices
  const [viewportHeight, setViewportHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 800);

  useEffect(() => {
    const handleResize = () => {
      const height = window.visualViewport ? window.visualViewport.height : window.innerHeight;
      setViewportHeight(height);
      // Auto scroll chat list to bottom when keyboard appears
      setTimeout(() => {
        if (chatBottomRef.current) {
          chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    };

    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleResize);
    } else {
      window.addEventListener('resize', handleResize);
    }

    handleResize();

    return () => {
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', handleResize);
        window.visualViewport.removeEventListener('scroll', handleResize);
      } else {
        window.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(LOCAL_STORAGE_PROFILE_KEY);
    const savedSessions = localStorage.getItem(LOCAL_STORAGE_SESSIONS_KEY);

    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        setUserProfile(parsed);
        if (parsed.userName && parsed.userName.trim() !== '') {
          setShowWelcome(false);
        }
      } catch (err) {
        console.error('Error parsing saved profile:', err);
      }
    }

    if (savedSessions) {
      try {
        const parsed = JSON.parse(savedSessions);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setCurrentSessionId(parsed[0].id);
        }
      } catch (err) {
        console.error('Error parsing sessions:', err);
      }
    } else {
      // Create first empty session
      const initialId = 'session_' + Date.now();
      const firstSession: ChatSession = {
        id: initialId,
        title: 'Kwentuhan kay Artchie ✨',
        lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        messages: [
          {
            id: 'welcome_msg',
            sender: 'bot',
            text: "Hi! Ako si Artchie AI. Kaibigan mo ako anumang oras. Kung gusto mong makipagkwentuhan, humingi ng payo, gumawa ng kanta, o maglabas ng sama ng loob, nandito lang ako para makinig at tumulong sa iyo. 😊 Anong balita sa araw mo ngayon?",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ],
        currentMode: 'friend',
        currentPersonality: 'best_friend',
      };
      setSessions([firstSession]);
      setCurrentSessionId(initialId);
    }
  }, []);

  // Save profile state helper
  const handleUpdateProfile = (newProfile: UserProfile) => {
    setUserProfile(newProfile);
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(newProfile));
  };

  // Onboarding action
  const handleStartOnboarding = (name: string) => {
    const updated = {
      ...userProfile,
      userName: name,
    };
    handleUpdateProfile(updated);
    setShowWelcome(false);
    
    // Customize introduction for current user
    if (sessions.length > 0) {
      const activeIdx = sessions.findIndex(s => s.id === currentSessionId);
      if (activeIdx !== -1) {
        const updatedSessions = [...sessions];
        updatedSessions[activeIdx].messages = [
          {
            id: 'welcome_init',
            sender: 'bot',
            text: `Hi ${name}! Ako nga pala si Artchie AI. Sobrang natutuwa ako na nakilala kita ngayon. Bilang iyong companion, handa akong makinig sa kahit anong kwento mo tungkol sa career, pangarap, o kahit mga hugot sa pag-ibig. Anong balita sa araw mo ngayon? ❤️`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          }
        ];
        setSessions(updatedSessions);
        localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(updatedSessions));
      }
    }
  };

  // Get active session
  const activeSessionIdx = sessions.findIndex(s => s.id === currentSessionId);
  const activeSession = activeSessionIdx !== -1 ? sessions[activeSessionIdx] : null;

  // Auto-scroll inside chat
  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeSession?.messages, activeTab]);

  // Seed demo data capability
  const handleLoadDemoScenarios = () => {
    const demoProfile: UserProfile = {
      userName: "Juan Dela Cruz",
      interests: "Upwork Web Development, PLUCK Ocoustic guitars",
      hobbies: "Acoustic song recording, learning web development late nights",
      goals: "Build a stable freelance tech career to overcome toxic 9-5",
      favoriteTopics: "Moving on from an LDR heartbreak in Baguio",
      memories: [
        "Planong mag-freelance bilang Web Developer.",
        "May pinagdadaanan pang pangungulila mula sa nakaraang Baguio heartbreak.",
        "Madalas puyat sa gabi para mag-aral mag-code ngunit nahihirapan magising sa umaga."
      ],
      currentMode: 'hugotero',
      currentPersonality: 'life_coach',
      languagePreference: 'Mix'
    };

    const demoSessionId_1 = 'session_demo_1';
    const demoSessionId_2 = 'session_demo_2';

    const demoSessions: ChatSession[] = [
      {
        id: demoSessionId_1,
        title: '💔 Paglipas ng LDR Heartbreak',
        lastUpdated: '10:45 AM',
        currentMode: 'hugotero',
        currentPersonality: 'hugotero',
        messages: [
          {
            id: 'm1',
            sender: 'user',
            text: "Napakahirap pa rin palang mag-move on kapag LDR. Tuwing nakikita ko 'yung mga lumang chat namin habang nagre-record ako ng kanta, naaalala ko siya.",
            timestamp: '10:42 AM'
          },
          {
            id: 'm2',
            sender: 'bot',
            text: "Ramdam kita, Juan. Ang hirap talaga kapag ang tanging hawak niyo lang noon ay mga mensahe sa screen. 'Minsan, hindi naman tayo nasasaktan dahil malayo sila. Nasasaktan tayo dahil pinili nilang lumayo kahit noong magkalapit pa ang inyong mga puso.' Normal lang na maalala mo siya. Hayaan mo lang pumatak ang luha habang tinutugtog mo ang gitara mo. 🎸",
            timestamp: '10:44 AM',
            emotionDetected: 'Sad'
          },
          {
            id: 'm3',
            sender: 'user',
            text: "Salamat Artchie. Swak na swak naman 'yang hugot mo. Parang binalot ako ng malaking yakap.",
            timestamp: '10:45 AM'
          }
        ]
      },
      {
        id: demoSessionId_2,
        title: '🚀 Plano sa Freelance Career',
        lastUpdated: 'Kahapon',
        currentMode: 'mentor',
        currentPersonality: 'life_coach',
        messages: [
          {
            id: 'ms1',
            sender: 'user',
            text: "Gusto ko nang maging seryosong Web Developer freelancer para makaalis sa toxic work ko, pero natatakot ako na walang kumuha sa akin.",
            timestamp: 'Kahapon'
          },
          {
            id: 'ms2',
            sender: 'bot',
            text: "Juan, normal ang matakot bago magsimula. Ngunit tandaan mo: 'Ang lahat ng eksperto ngayon ay nagsimula muna bilang amateur na hindi sumuko.' Dahil hilig mo naman ang pagko-code late nights, gawan natin yan ng blueprint! Unang hakbang ay ayusin ang Upwork profile mo at idokumento ang simpleng projects mo. May mga nasimulan ka na bang HTML/React side projects?",
            timestamp: 'Kahapon',
            emotionDetected: 'Motivated'
          }
        ]
      }
    ];

    setUserProfile(demoProfile);
    setSessions(demoSessions);
    setCurrentSessionId(demoSessionId_1);
    setActiveTab('chat');
    localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(demoProfile));
    localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(demoSessions));

    // Notice alert banner
    triggerNotification("Successfully loaded custom Juan's Hugot & Mentor scenarios!");
  };

  const triggerNotification = (rawText: string) => {
    setActiveNotification(rawText);
    setTimeout(() => {
      setActiveNotification(null);
    }, 4500);
  };

  // Helper: create a new blank session
  const handleAddNewSession = () => {
    const newId = 'session_' + Date.now();
    const newSession: ChatSession = {
      id: newId,
      title: 'Bagong Kwentuhan 💬',
      lastUpdated: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      currentMode: userProfile.currentMode,
      currentPersonality: userProfile.currentPersonality,
      messages: [
        {
          id: 'welcome_new',
          sender: 'bot',
          text: `Uy, panibagong simula! Kumusta ang pangkalahatang pakiramdam mo ngayon, ${userProfile.userName || 'Kaibigan'}? Gusto mo bang sumulat tayo ng bagong hugot o mag-focus muna sa mga pangarap natin?`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }
      ]
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    setCurrentSessionId(newId);
    setActiveTab('chat');
    localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(updated));
  };

  // Helper: delete a session
  const handleDeleteSession = (idToDelete: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      triggerNotification("Hindi mo maaaring burahin ang iyong natatanging active session.");
      return;
    }
    const filtered = sessions.filter(s => s.id !== idToDelete);
    setSessions(filtered);
    localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(filtered));

    if (currentSessionId === idToDelete) {
      setCurrentSessionId(filtered[0].id);
    }
    triggerNotification("Session log deleted.");
  };

  // Call daily feature generator cards
  const generateDailyFeature = async (type: 'morning' | 'motivation' | 'quote' | 'reflection' | 'evening') => {
    setIsGeneratingDaily(true);
    
    // Pick correct display label
    const labels = {
      morning: 'Magandang Umaga Check-in ☀️',
      motivation: 'Career & Life Motivation Builder 🚀',
      quote: 'Lokal Hugot & Quote Lines 💔',
      reflection: 'Daily Introspective Reflection 🧠',
      evening: 'Gabi ng Kapayapaan Check-in 🌙',
    };
    setDailyInspirationLabel(labels[type]);

    try {
      const res = await fetch('/api/daily', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: type,
          userProfile: userProfile,
          languagePreference: userProfile.languagePreference,
        }),
      });
      const data = await res.json();
      if (data.text) {
        setDailyInspirationText(data.text);
      } else {
        setDailyInspirationText("Nagkaroon ng munting aberya sa sistema. Pero sapat pa rin ang aking init para yakapin ka.");
      }
    } catch (err) {
      console.error(err);
      setDailyInspirationText("Naka-offline mode si Artchie sandali. 'Tandaan: Hindi lahat ng panandaliang distansya ay nangangahulugan ng paglimot.'");
    } finally {
      setIsGeneratingDaily(false);
    }
  };

  // Core action: Send message
  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isLoadingChat || !activeSession) return;

    const userText = inputMessage.trim();
    setInputMessage('');
    setIsLoadingChat(true);

    const userMsgId = 'user_msg_' + Date.now();
    const userMessage: Message = {
      id: userMsgId,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Update session instantly with user message
    const updatedMessages = [...activeSession.messages, userMessage];
    const updatedSessions = [...sessions];
    const activeSessionIdx = updatedSessions.findIndex(s => s.id === currentSessionId);
    if (activeSessionIdx !== -1) {
      updatedSessions[activeSessionIdx].messages = updatedMessages;
      // Truncate message text to update title if it was default
      if (updatedSessions[activeSessionIdx].title.includes('Bagong Kwentuhan') || updatedSessions[activeSessionIdx].title.includes('Kwentuhan kay Artchie')) {
        updatedSessions[activeSessionIdx].title = userText.length > 22 ? userText.slice(0, 20) + '...' : userText;
      }
      updatedSessions[activeSessionIdx].lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    setSessions(updatedSessions);
    localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(updatedSessions));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          userProfile: userProfile,
          currentMode: userProfile.currentMode,
          currentPersonality: userProfile.currentPersonality,
          languagePreference: userProfile.languagePreference,
        }),
      });

      const data = await response.json();
      
      const botMsgId = 'bot_msg_' + Date.now();
      const botMessage: Message = {
        id: botMsgId,
        sender: 'bot',
        text: data.reply || "Paumanhin kaibigan, medyo nahilo ako sandali sa signal. Ano nga ulit iyon?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        emotionDetected: data.emotion,
      };

      if (data.emotion) {
        setRecentEmotion(data.emotion);
      }

      // If a new memory is learned, register it!
      if (data.newMemory && data.newMemory.trim() !== '') {
        const addedMemory = data.newMemory.trim();
        // Prevent duplicate memories
        if (!userProfile.memories.includes(addedMemory)) {
          const updatedProf = {
            ...userProfile,
            memories: [...userProfile.memories, addedMemory]
          };
          setUserProfile(updatedProf);
          localStorage.setItem(LOCAL_STORAGE_PROFILE_KEY, JSON.stringify(updatedProf));
          triggerNotification(`💡 May binuong alaala si Artchie: "${addedMemory}"`);
        }
      }

      const finalSessions = [...sessions];
      const activeIdx = finalSessions.findIndex(s => s.id === currentSessionId);
      if (activeIdx !== -1) {
        finalSessions[activeIdx].messages = [...updatedMessages, botMessage];
      }
      setSessions(finalSessions);
      localStorage.setItem(LOCAL_STORAGE_SESSIONS_KEY, JSON.stringify(finalSessions));

    } catch (err: any) {
      console.error(err);
      const botErrorMsg: Message = {
        id: 'bot_err',
        sender: 'bot',
        text: "Medyo naputol ang koneksyon natin kaibigan, pero nakikinig pa rin ako. 'Hindi hadlang ang distansya o sagabal sa network kung seryoso tayong mag-usap.' subukan nating ulitin pagkatapos mo i-setup ang GEMINI_API_KEY sa Settings.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      
      const finalSessions = [...sessions];
      const activeIdx = finalSessions.findIndex(s => s.id === currentSessionId);
      if (activeIdx !== -1) {
        finalSessions[activeIdx].messages = [...updatedMessages, botErrorMsg];
      }
      setSessions(finalSessions);
    } finally {
      setIsLoadingChat(false);
    }
  };

  const handleClearHistory = () => {
    localStorage.removeItem(LOCAL_STORAGE_SESSIONS_KEY);
    localStorage.removeItem(LOCAL_STORAGE_PROFILE_KEY);
  };

  // Immediate mode switcher buttons from the right side-panel
  const handleQuickSwitchMode = (mode: CompanionMode) => {
    const updated = {
      ...userProfile,
      currentMode: mode,
    };
    handleUpdateProfile(updated);
    triggerNotification(`Inilipat mode sa: ${mode.toUpperCase()} Mode!`);
  };

  const currentModeDetails = {
    friend: { name: 'Friend Mode 🤝', color: 'text-emerald-400 bg-emerald-500/10' },
    hugotero: { name: 'Hugotero Mode 💔', color: 'text-pink-400 bg-pink-500/10' },
    creative: { name: 'Creative Mode 🎵', color: 'text-amber-400 bg-amber-500/10' },
    mentor: { name: 'Mentor Mode 🚀', color: 'text-cyan-400 bg-cyan-500/10' },
  }[userProfile.currentMode] || { name: 'Friend Mode Active 🤝', color: 'text-indigo-400 bg-indigo-500/10' };

  const isCharcoal = userProfile.theme === 'charcoal';
  const themeStyles = {
    bgMain: isCharcoal ? 'bg-[#151517]' : 'bg-[#09090b]',
    bgSidebar: isCharcoal ? 'bg-[#1c1c1f]/95' : 'bg-[#0c0c0e]/95',
    bgHeader: isCharcoal ? 'bg-[#1f1f23]/95' : 'bg-[#0c0c0e]/95',
    bgCapsule: isCharcoal ? 'bg-[#17171a]' : 'bg-[#09090b]',
    border: isCharcoal ? 'border-zinc-800' : 'border-white/5',
    inputBg: isCharcoal ? 'bg-[#27272a]' : 'bg-[#111115]',
    inputBorder: isCharcoal ? 'border-zinc-700 hover:border-amber-500/30' : 'border-white/15 hover:border-indigo-500/30',
    bubbleBot: isCharcoal ? 'bg-[#222225] border-zinc-700' : 'bg-[#18181b] border-zinc-700/80',
    bubbleUser: isCharcoal ? 'bg-[#2e261f] border-amber-600/30 text-[#fef3c7]' : 'bg-indigo-950/65 border-indigo-500/40',
    accentText: isCharcoal ? 'text-amber-400' : 'text-pink-400',
    accentMuted: isCharcoal ? 'text-amber-500/80' : 'text-pink-500/80',
    textMuted: isCharcoal ? 'text-zinc-400' : 'text-slate-400',
    itemActive: isCharcoal ? 'bg-amber-600/20 text-white border-amber-500/40' : 'bg-indigo-600/25 text-white border-indigo-500/50',
    quickBtn: isCharcoal ? 'hover:bg-amber-500/10' : 'hover:bg-pink-500/10'
  };

  if (showWelcome) {
    return <WelcomeScreen onStart={handleStartOnboarding} userProfile={userProfile} />;
  }

  return (
    <div 
      className={`w-full ${themeStyles.bgMain} text-slate-200 font-sans flex flex-col overflow-hidden select-none`}
      style={{ height: `${viewportHeight}px` }}
    >
      
      {/* Floating active dynamic memory notification banner */}
      <AnimatePresence>
        {activeNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 16 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#16161a] border border-pink-500/40 px-5 py-3 rounded-2xl shadow-[0_0_30px_rgba(244,63,94,0.15)] flex items-center gap-3 max-w-sm sm:max-w-md"
          >
            <div className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-ping absolute top-1 right-1" />
            <span className="text-xl">💡</span>
            <p className="text-xs font-semibold text-slate-100 leading-normal">
              {activeNotification}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Responsive Header / Navigation Bar */}
      <header className={`h-16 border-b ${themeStyles.border} ${themeStyles.bgHeader} backdrop-blur-md sticky top-0 z-20 px-4 md:px-6 flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          {/* Mobile Sidebar Trigger button */}
          <button
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 md:hidden cursor-pointer"
            title="Toggle Logs Sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center font-bold text-white shadow-lg text-sm select-none">
              A
            </div>
            <div>
              <span className="font-extrabold text-[#f43f5e] tracking-tight text-md">Artchie AI</span>
              <div className="flex items-center gap-1">
                <span className="text-[9px] bg-white/5 px-1 rounded text-slate-400 font-bold tracking-wider">v2.1</span>
                <span className="text-[9px] text-slate-300 capitalize hidden sm:inline">({userProfile.languagePreference} mode)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation Center */}
        <nav className="flex items-center bg-white/5 border border-white/5 p-1 rounded-xl gap-1 shrink-0">
          <button
            onClick={() => setActiveTab('chat')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'chat' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Chat Companion</span>
          </button>
          <button
            onClick={() => setActiveTab('personality')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'personality' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Modes & Config</span>
          </button>
          <button
            onClick={() => setActiveTab('memory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'memory' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Memory Bank</span>
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          {/* Active Status info */}
          <div className="hidden lg:flex items-center gap-1.5 bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-full text-[10px] uppercase tracking-wider font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            {recentEmotion} Detected
          </div>
          {/* Quick toggle for right parameters menu */}
          <button
            onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
            className="p-1.5 hover:bg-white/5 rounded-lg text-slate-400 cursor-pointer"
            title="Toggle Right panel"
          >
            <Compass className="w-5 h-5 text-indigo-400" />
          </button>
        </div>
      </header>

      {/* Main Framework Layout Container */}
      <div className="flex-grow flex flex-row overflow-hidden relative">

        {/* LEFT SIDEBAR: Saved Sessions & Memory Preview */}
        <aside
          className={`w-64 max-w-full shrink-0 border-r ${themeStyles.border} ${themeStyles.bgSidebar} flex flex-col absolute md:static top-0 bottom-0 left-0 z-30 transition-transform duration-300 md:translate-x-0 ${
            leftSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
          style={{ height: `${viewportHeight - 64}px` }}
        >
          {/* Mobile close button inside left side-panel */}
          <div className={`md:hidden flex justify-end p-2 border-b ${themeStyles.border}`}>
            <button onClick={() => setLeftSidebarOpen(false)} className="p-1 hover:bg-slate-800 rounded-lg">
              <X className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          <div className="p-4 flex-grow flex flex-col overflow-y-auto">
            
            {/* Header control: Add new chat */}
            <button
              onClick={handleAddNewSession}
              className="w-full py-2 bg-gradient-to-r from-pink-500/10 to-indigo-500/10 hover:from-pink-500/15 hover:to-indigo-500/15 text-slate-200 border border-white/10 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shrink-0 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-pink-400" />
              Bagong Kwentuhang Companion
            </button>

            {/* Part: Memory Snapshot */}
            <div className="mt-6">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 flex items-center justify-between">
                <span>Active Memory</span>
                <span className="text-[9px] text-pink-400 font-normal">({userProfile.memories.length} facts)</span>
              </p>
              <div className="bg-white/5 rounded-xl p-3 border border-white/5 space-y-2">
                <div>
                  <p className="text-[10px] text-slate-300">Current Companion User:</p>
                  <p className="text-xs font-bold text-indigo-300 truncate">{userProfile.userName || 'Kaibigan'}</p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-300 font-semibold">Active Long-term Goal:</p>
                  <p className="text-xs font-medium text-emerald-400 line-clamp-1">{userProfile.goals || 'None logged yet.'}</p>
                </div>
              </div>
            </div>

            {/* Part: Conversation List Logs */}
            <div className="mt-8 flex-grow flex flex-col">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Bookmark className="w-3 h-3 text-pink-400" />
                Dating Kwento (History)
              </p>
              
              <div className="space-y-1.5 overflow-y-auto max-h-[220px] md:max-h-[300px] pr-1">
                {sessions.map((s) => {
                  const isActive = s.id === currentSessionId;
                  return (
                    <div
                      key={s.id}
                      onClick={() => {
                        setCurrentSessionId(s.id);
                        setActiveTab('chat');
                        // Close mobile sidebar
                        if (window.innerWidth < 768) {
                          setLeftSidebarOpen(false);
                        }
                      }}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between group cursor-pointer border ${
                        isActive
                          ? `${themeStyles.itemActive} font-semibold`
                          : 'bg-white/5 text-slate-300 border-transparent hover:bg-white/10 hover:text-slate-100'
                      }`}
                    >
                      <div className="flex-grow truncate pr-2">
                        <p className="truncate text-left text-slate-100">{s.title}</p>
                        <span className="text-[9px] text-slate-400 font-normal">{s.lastUpdated}</span>
                      </div>
                      <button
                        onClick={(e) => handleDeleteSession(s.id, e)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-md transition-all cursor-pointer"
                        title="Delete Session Log"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* User profile capsule bottom */}
          <div className={`p-4 border-t ${themeStyles.border} ${themeStyles.bgCapsule}`}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-sm font-bold">
                🧑‍💻
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-200 truncate">{userProfile.userName || 'Juan Dela Cruz'}</p>
                <span className="text-[10px] text-slate-400 tracking-wider">Premium Companion User</span>
              </div>
              <button
                onClick={() => setActiveTab('settings')}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
                title="Settings"
              >
                ⚙️
              </button>
            </div>
          </div>
        </aside>

        {/* MIDDLE PORTION: Dynamic Tabs view container */}
        <main className={`flex-1 flex flex-col relative overflow-hidden ${themeStyles.bgMain}`}>
          
          {/* Subheader listener widget */}
          {activeTab === 'chat' && (
            <div className={`h-12 border-b ${themeStyles.border} flex items-center justify-between px-4 sm:px-6 ${themeStyles.bgMain}/80 backdrop-blur-md sticky top-0 z-10`}>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-xs font-semibold text-slate-300">
                  {isLoadingChat ? 'Artchie is composing thoughts...' : `Si Artchie ay nakikinig (${userProfile.currentPersonality.toUpperCase()})`}
                </span>
              </div>
              <div className="flex gap-2">
                <span className={`text-[10px] font-bold px-3 py-1 rounded-full border border-pink-500/20 shadow-sm ${currentModeDetails.color}`}>
                  {currentModeDetails.name}
                </span>
              </div>
            </div>
          )}

          {/* Tab Render router */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'chat' && (
              <div className="p-4 pb-4 sm:p-6 sm:pb-8 md:p-8 md:pb-12 flex flex-col gap-5 min-h-full max-w-3xl mx-auto">
                
                {/* Introduction info block */}
                {activeSession && activeSession.messages.length <= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl bg-zinc-900 border border-zinc-800 text-left max-w-xl mx-auto shadow-2xl relative overflow-hidden shrink-0 mb-3"
                  >
                    <div className="absolute top-2 right-2 flex gap-1 bg-pink-500/20 text-pink-300 text-[9px] px-2 py-0.5 rounded-full font-bold select-none">
                      💔 Hugot Partner
                    </div>
                    <h3 className="font-bold text-slate-100 text-sm mb-1.5">Kumusta, {userProfile.userName}!</h3>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Handa si Artchie AI na makipag-chika tungkol sa paksang gusto mo. Pumili ng mode sa kanang bahagi o sumulat ng mensahe para mag-umpisa. Maaari ka ring sumulat sa <b>Tagalog, Bisaya, o English</b>.
                    </p>
                  </motion.div>
                )}

                {/* Chat message elements */}
                {activeSession ? (
                  activeSession.messages.map((m) => {
                    const isBot = m.sender === 'bot';
                    return (
                      <div
                        key={m.id}
                        className={`flex gap-3 max-w-[85%] ${isBot ? '' : 'ml-auto flex-row-reverse'}`}
                      >
                        {/* Avatar */}
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 select-none ${
                          isBot
                            ? 'bg-gradient-to-tr from-pink-500 to-amber-500 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}>
                          {isBot ? 'AI' : 'KO'}
                        </div>

                        {/* Speech Bubble */}
                        <div className={`p-4 rounded-2xl text-left border ${
                          isBot
                            ? `${themeStyles.bubbleBot} rounded-tl-none shadow-xl`
                            : `${themeStyles.bubbleUser} rounded-tr-none`
                        }`}>
                          <p className={`text-xs md:text-sm leading-relaxed whitespace-pre-wrap ${
                            isBot && userProfile.currentMode === 'hugotero' ? 'italic font-semibold text-pink-200' : 'text-slate-100'
                          }`}>
                            {m.text}
                          </p>
                          
                          <div className="flex items-center justify-between gap-4 mt-2">
                            {/* Timestamp */}
                            <span className="text-[10px] text-slate-400 tracking-wide font-mono">
                              {m.timestamp}
                            </span>
                            {/* Tags or tags indicators */}
                            {m.emotionDetected && (
                              <span className="text-[9px] bg-white/5 px-2 py-0.5 rounded text-slate-300 capitalize">
                                #{m.emotionDetected}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center p-12">
                    <p className="text-slate-500 text-sm">Walang active chat. Gumawa muli sa left sidebar!</p>
                  </div>
                )}
                
                {/* Typing loader indicator */}
                {isLoadingChat && (
                  <div className="flex gap-3 max-w-[80%]">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-amber-500 flex items-center justify-center font-bold text-xs text-white">
                      AI
                    </div>
                    <div className={`${themeStyles.bubbleBot} p-3.5 rounded-2xl rounded-tl-none flex items-center gap-2`}>
                      <Loader2 className="w-3.5 h-3.5 text-pink-400 animate-spin" />
                      <span className="text-xs text-slate-300">Si Artchie ay sumusulat ng hugot...</span>
                    </div>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>
            )}

            {activeTab === 'personality' && (
              <PersonalitySelection
                currentMode={userProfile.currentMode}
                currentPersonality={userProfile.currentPersonality}
                onSelectMode={(m) => {
                  const updated = { ...userProfile, currentMode: m };
                  handleUpdateProfile(updated);
                }}
                onSelectPersonality={(p) => {
                  const updated = { ...userProfile, currentPersonality: p };
                  handleUpdateProfile(updated);
                }}
                onNavigateToChat={() => setActiveTab('chat')}
              />
            )}

            {activeTab === 'memory' && (
              <MemoryPage
                userProfile={userProfile}
                onChangeProfile={handleUpdateProfile}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsPage
                userProfile={userProfile}
                onChangeProfile={handleUpdateProfile}
                onClearHistory={handleClearHistory}
                onLoadDemoScenarios={handleLoadDemoScenarios}
              />
            )}
          </div>

          {/* Input control container (only renders on bottom of active Chat Tab) */}
          {activeTab === 'chat' && (
            <div className={`p-4 sm:p-6 border-t ${themeStyles.border} ${themeStyles.bgMain}/90 backdrop-blur-md shrink-0 max-md:border-t-0 max-md:bg-transparent max-md:p-3 max-md:pb-5`}>
              <form onSubmit={handleSendMessage} className="relative max-w-3xl mx-auto">
                <div className={`absolute inset-0 ${isCharcoal ? 'bg-amber-500/5' : 'bg-indigo-500/5'} blur-2xl rounded-full`} />
                <div className={`relative ${themeStyles.inputBg} border ${themeStyles.inputBorder} rounded-2xl p-2.5 flex items-center gap-2.5 shadow-2xl transition-all`}>
                  
                  {/* Speech synthesis emoji dummy */}
                  <div className="p-2 bg-slate-800/40 text-slate-400 rounded-xl cursor-default text-sm" title="Vocal Companion Mode enabled">
                    🇵🇭
                  </div>
                  
                  <input
                    type="text"
                    required
                    disabled={isLoadingChat}
                    value={inputMessage || ''}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ano ang gusto mong sabihin ngayon? Tagalog, Bisaya, or English..."
                    className="flex-grow bg-transparent border-none text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-0 text-xs sm:text-sm py-2 px-1 focus:placeholder-slate-300 transition-all"
                  />

                  {/* Send Action */}
                  <button
                    type="submit"
                    disabled={isLoadingChat || !inputMessage.trim()}
                    className="p-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl shadow-lg transition-all focus:outline-none cursor-pointer hover:scale-[1.03] active:scale-95 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </form>
              
              <div className="hidden md:flex justify-center flex-wrap gap-2 mt-3 select-none max-w-3xl mx-auto">
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                  <Info className="w-3 h-3 text-slate-400" /> Tips: Subukang magtanong ng: "Bigyan mo ako ng hugot tungkol sa pangarap ko."
                </span>
              </div>
            </div>
          )}
        </main>

        {/* RIGHT SIDEBAR: Dynamic modes configured and inline daily checks */}
        {rightSidebarOpen && (
          <aside
            className={`w-72 shrink-0 border-l ${themeStyles.border} ${themeStyles.bgSidebar} p-5 flex flex-col justify-between overflow-y-auto hidden lg:flex`}
            style={{ height: `${viewportHeight - 64}px` }}
          >
            <div className="space-y-6">
              
              {/* Part 1: Quick mode picker from right rails */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">
                  Quick Modes Switcher
                </h3>
                <div className="grid gap-2.5">
                  {[
                    {
                      id: 'friend' as CompanionMode,
                      name: 'Best Friend',
                      emoji: '🤝',
                      desc: 'Casual chika, updates'
                    },
                    {
                      id: 'hugotero' as CompanionMode,
                      name: 'Hugotero',
                      emoji: '💔',
                      desc: 'Drama & love lines'
                    },
                    {
                      id: 'creative' as CompanionMode,
                      name: 'Creator AI',
                      emoji: '🎵',
                      desc: 'Poems, songs & stories'
                    },
                    {
                      id: 'mentor' as CompanionMode,
                      name: 'Life Coach',
                      emoji: '🚀',
                      desc: 'Motivation & carrier goals'
                    },
                  ].map((km) => {
                    const isSelected = userProfile.currentMode === km.id;
                    return (
                      <div
                        key={km.id}
                        onClick={() => handleQuickSwitchMode(km.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer text-left ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500/60 shadow-md'
                            : 'bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="text-base">{km.emoji}</span>
                          <span className="font-bold text-slate-100 text-xs">{km.name}</span>
                          {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-indigo-500"></div>}
                        </div>
                        <p className="text-[10px] text-slate-400 mt-1">{km.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Part 2: Active Identity archetypes */}
              <div>
                <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">
                  Embodied Personality
                </h3>
                <div className="p-3 rounded-xl bg-white/5 border border-white/5 flex gap-2.5 items-center">
                  <div className="text-xl bg-slate-800 w-8 h-8 rounded flex items-center justify-center">
                    {
                      {
                        best_friend: '😊',
                        hugotero: '🥺',
                        motivator: '⚡',
                        storyteller: '📖',
                        songwriter: '🎸',
                        life_coach: '🧘',
                      }[userProfile.currentPersonality] || '🤖'
                    }
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-200 capitalize">
                      {userProfile.currentPersonality.replace('_', ' ')}
                    </h4>
                    <span className="text-[9px] text-slate-500">Piniling default archetype</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Part 3: Daily check-in quotes widgets (Interactive Generator cards!) */}
            <div className="border-t border-white/5 pt-5 mt-6">
              <div className="bg-gradient-to-tr from-indigo-500/5 via-pink-500/10 to-amber-500/10 p-4 rounded-2xl border border-pink-500/20 relative overflow-hidden">
                
                <span className="text-[9px] text-amber-300 font-extrabold uppercase tracking-widest block mb-2">
                  {dailyInspirationLabel}
                </span>

                <div className="min-h-[70px] flex items-center">
                  {isGeneratingDaily ? (
                    <div className="w-full flex flex-col items-center justify-center text-center py-2">
                      <Loader2 className="w-4 h-4 text-pink-400 animate-spin" />
                      <span className="text-[9px] text-slate-400 mt-1">Sinusulat...</span>
                    </div>
                  ) : (
                    <p className="text-xs italic leading-relaxed text-slate-200 text-left whitespace-pre-wrap">
                      "{dailyInspirationText.replace(/"/g, '')}"
                    </p>
                  )}
                </div>

                {/* Switchers to call /api/daily */}
                <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap gap-1.5">
                  <button
                    onClick={() => generateDailyFeature('morning')}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold text-slate-300 transition-all cursor-pointer"
                    title="morning greeting"
                  >
                    ☀️ Umaga
                  </button>
                  <button
                    onClick={() => generateDailyFeature('motivation')}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold text-slate-300 transition-all cursor-pointer"
                    title="motivation push"
                  >
                    🚀 Career
                  </button>
                  <button
                    onClick={() => generateDailyFeature('quote')}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold text-slate-300 transition-all cursor-pointer"
                    title="hugot quote"
                  >
                    💔 Hugot
                  </button>
                  <button
                    onClick={() => generateDailyFeature('reflection')}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold text-slate-300 transition-all cursor-pointer"
                    title="reflection ask"
                  >
                    🧠 Isip
                  </button>
                  <button
                    onClick={() => generateDailyFeature('evening')}
                    className="px-2 py-1 bg-white/5 hover:bg-white/10 rounded text-[9px] font-bold text-slate-300 transition-all cursor-pointer"
                    title="evening greeting"
                  >
                    🌙 Gabi
                  </button>
                </div>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
