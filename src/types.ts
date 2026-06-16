export interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  emotionDetected?: string;
  personalitySelected?: string;
}

export type CompanionMode = 'friend' | 'hugotero' | 'creative' | 'mentor';

export type AIPersonality =
  | 'best_friend'
  | 'hugotero'
  | 'motivator'
  | 'storyteller'
  | 'songwriter'
  | 'life_coach';

export interface UserProfile {
  userName: string;
  interests: string;
  hobbies: string;
  goals: string;
  favoriteTopics: string;
  memories: string[]; // List of facts Artchie has noted down from chat
  detectedEmoji?: string;
  currentMode: CompanionMode;
  currentPersonality: AIPersonality;
  languagePreference: 'Mix' | 'English' | 'Tagalog' | 'Bisaya';
  theme?: 'midnight' | 'charcoal';
}

export interface ChatSession {
  id: string;
  title: string;
  lastUpdated: string;
  messages: Message[];
  currentMode: CompanionMode;
  currentPersonality: AIPersonality;
}
