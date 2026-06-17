import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Heart, MessageSquare, Compass } from 'lucide-react';
import { UserProfile } from '../types';

const artchieLogo = '/favicons/android-icon-192x192.png';

interface WelcomeScreenProps {
  onStart: (name: string) => void;
  userProfile: UserProfile;
}

export default function WelcomeScreen({ onStart, userProfile }: WelcomeScreenProps) {
  const [name, setName] = useState(userProfile.userName || '');
  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart(name.trim());
    }
  };

  return (
    <div className={`w-full min-h-screen bg-[#09090b] text-slate-200 flex flex-col items-center justify-center text-center px-4 py-8 overflow-y-auto font-sans transition-all duration-300 ${isInputFocused ? 'max-md:justify-start max-md:pt-10' : ''}`}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: isInputFocused ? 0.7 : 1, opacity: isInputFocused ? 0 : 1 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className={`mb-6 relative transition-all duration-300 ${isInputFocused ? 'max-md:hidden h-0 mb-0' : ''}`}
      >
        <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full" />
        <div className="relative bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 p-[3px] rounded-full shadow-[0_0_50px_rgba(244,63,94,0.3)]">
          <div className="bg-[#0b0c16] rounded-full overflow-hidden w-28 h-28 flex items-center justify-center p-0.5">
            <img 
              src={artchieLogo} 
              alt="Artchie AI Logo" 
              className="w-full h-full object-cover rounded-full" 
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
      </motion.div>

      <motion.h1
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className={`text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent tracking-tight ${isInputFocused ? 'max-md:text-2xl max-md:mb-2' : ''}`}
      >
        Artchie AI
      </motion.h1>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className={`mt-2 text-base md:text-lg text-slate-300 font-medium tracking-wide/relaxed max-w-md mx-auto transition-all ${isInputFocused ? 'max-md:hidden' : ''}`}
      >
        "Your AI Friend, Mentor, and Hugot Companion."
      </motion.p>

      {/* Intro greeting quote */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
        className={`mt-4 p-5 bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 text-left max-w-lg mx-auto transition-all duration-300 ${isInputFocused ? 'max-md:hidden h-0 mt-0 pointer-events-none overflow-hidden border-none' : ''}`}
      >
        <p className="text-slate-300 leading-relaxed text-sm md:text-base">
          "Hi, ako si <span className="text-pink-400 font-semibold">Artchie AI</span>. Kaibigan mo ako anumang oras. Kung gusto mong makipagkwentuhan, humingi ng payo, gumawa ng kanta, o maglabas ng sama ng loob, nandito lang ako para makinig at tumulong." 🇵🇭❤️
        </p>
      </motion.div>

      {/* Guided Features Bento list */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isInputFocused ? 0 : 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className={`grid grid-cols-2 gap-3 max-w-lg mt-6 w-full transition-all duration-300 ${isInputFocused ? 'max-md:hidden h-0 mt-0' : ''}`}
      >
        <div className="p-3 bg-slate-800/20 backdrop-blur-sm rounded-xl border border-slate-700/30 text-left">
          <Heart className="w-5 h-5 text-pink-400 mb-2" />
          <h3 className="font-semibold text-slate-200 text-xs md:text-sm">Hugot Partner (💔)</h3>
          <p className="text-slate-300 text-[10px] md:text-xs">Deep love advise at heartbreak lines anytime.</p>
        </div>
        <div className="p-3 bg-slate-800/20 backdrop-blur-sm rounded-xl border border-slate-700/30 text-left">
          <Sparkles className="w-5 h-5 text-amber-300 mb-2" />
          <h3 className="font-semibold text-slate-200 text-xs md:text-sm">Creative Muse (🎵)</h3>
          <p className="text-slate-300 text-[10px] md:text-xs">Songs, spoken poetry, captions and stories.</p>
        </div>
        <div className="p-3 bg-slate-800/20 backdrop-blur-sm rounded-xl border border-slate-700/30 text-left">
          <MessageSquare className="w-5 h-5 text-emerald-400 mb-2" />
          <h3 className="font-semibold text-slate-200 text-xs md:text-sm">Trusted Friend (🤝)</h3>
          <p className="text-slate-300 text-[10px] md:text-xs">Casual daily life updates, fun topics, and laughs.</p>
        </div>
        <div className="p-3 bg-slate-800/20 backdrop-blur-sm rounded-xl border border-slate-700/30 text-left">
          <Compass className="w-5 h-5 text-cyan-400 mb-2" />
          <h3 className="font-semibold text-slate-200 text-xs md:text-sm">Life Coach & Mentor (🚀)</h3>
          <p className="text-slate-300 text-[10px] md:text-xs">Motivation, freelancing, and learning guides.</p>
        </div>
      </motion.div>

      {/* Onboarding onboarding form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className={`mt-8 bg-zinc-900 p-6 rounded-2xl border border-zinc-800 w-full max-w-md shadow-2xl transition-all duration-300 ${isInputFocused ? 'max-md:scale-105 max-md:mt-4 shadow-pink-500/5 border-pink-500/30' : ''}`}
      >
        <h2 className="text-sm font-bold text-slate-200 mb-3 text-left flex items-center justify-between">
          <span>Ano ang gusto mong itawag ko sa iyo?</span>
          {isInputFocused && <span className="text-[10px] text-pink-400 font-semibold animate-pulse sm:hidden">⌨️ Keyboard active</span>}
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            required
            placeholder="Hal. Andrei, Maria, Boss..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            onFocus={() => setIsInputFocused(true)}
            onBlur={() => {
              // small timeout to allow clicking submit button without instant blur displacement
              setTimeout(() => setIsInputFocused(false), 150);
            }}
            className="flex-grow px-4 py-3 bg-slate-800/80 border border-slate-700 rounded-xl text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-base"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-white rounded-xl font-semibold hover:opacity-90 active:scale-95 transition-all shadow-md shrink-0 text-sm md:text-base cursor-pointer"
          >
            Simulan ang Chat
          </button>
        </div>
      </motion.form>
    </div>
  );
}
