import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { Brain, Trash2, Plus, Sparkles, User, Heart, Compass } from 'lucide-react';

interface MemoryPageProps {
  userProfile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
}

export default function MemoryPage({ userProfile, onChangeProfile }: MemoryPageProps) {
  const [newMemoryInput, setNewMemoryInput] = useState('');
  const [userNameInput, setUserNameInput] = useState(userProfile.userName);
  const [interestsInput, setInterestsInput] = useState(userProfile.interests);
  const [hobbiesInput, setHobbiesInput] = useState(userProfile.hobbies);
  const [goalsInput, setGoalsInput] = useState(userProfile.goals);
  const [favoriteTopicsInput, setFavoriteTopicsInput] = useState(userProfile.favoriteTopics);
  const [isSavedNotice, setIsSavedNotice] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onChangeProfile({
      ...userProfile,
      userName: userNameInput,
      interests: interestsInput,
      hobbies: hobbiesInput,
      goals: goalsInput,
      favoriteTopics: favoriteTopicsInput,
    });
    setIsSavedNotice(true);
    setTimeout(() => setIsSavedNotice(false), 3000);
  };

  const handleAddMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMemoryInput.trim()) {
      onChangeProfile({
        ...userProfile,
        memories: [...userProfile.memories, newMemoryInput.trim()],
      });
      setNewMemoryInput('');
    }
  };

  const handleDeleteMemory = (indexToDelete: number) => {
    onChangeProfile({
      ...userProfile,
      memories: userProfile.memories.filter((_, idx) => idx !== indexToDelete),
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 text-slate-200">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent flex items-center gap-2">
          <Brain className="w-6 h-6 text-pink-400" />
          Artchie's Memory Bank & Custom Profile
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed mt-1">
          Narito ang mga impormasyong naaalala ni Artchie tungkol sa iyo mula sa inyong mga pag-uusap. Maaari mo ring baguhin ang mga detalye rito.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Profile Card & Info Form */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md flex flex-col gap-4"
        >
          <div className="flex items-center gap-3 border-b border-white/5 pb-3">
            <User className="w-5 h-5 text-indigo-400" />
            <h3 className="font-semibold text-white text-base">Iyong Personal na Profile</h3>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Your Name (Ano ang nais mong itawag ko sa iyo):</label>
              <input
                type="text"
                value={userNameInput}
                onChange={(e) => setUserNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Interests (Mga hilig o paboritong pag-usapan):</label>
              <input
                type="text"
                value={interestsInput}
                onChange={(e) => setInterestsInput(e.target.value)}
                placeholder="Hal. Pagko-code, LDR, Modernong kanta..."
                className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Hobbies (Mga gawain pag may libreng oras):</label>
              <input
                type="text"
                value={hobbiesInput}
                onChange={(e) => setHobbiesInput(e.target.value)}
                placeholder="Hal. Gitara, paggawa ng kanta, Netflix..."
                className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Goals (Pangarap o Career plan):</label>
                <input
                  type="text"
                  value={goalsInput}
                  onChange={(e) => setGoalsInput(e.target.value)}
                  placeholder="Hal. Maging malayang freelancer..."
                  className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Favorite Topics:</label>
                <input
                  type="text"
                  value={favoriteTopicsInput}
                  onChange={(e) => setFavoriteTopicsInput(e.target.value)}
                  placeholder="Hal. Love, Life lessons, Hugot..."
                  className="w-full px-3 py-2 bg-slate-800/60 border border-white/10 rounded-xl text-slate-100 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/20"
            >
              I-update ang aking Profile Facts
            </button>

            <AnimatePresence>
              {isSavedNotice && (
                <motion.div
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-xs text-emerald-400 text-center font-medium mt-2"
                >
                  ✓ Naka-save na! Na-update na ni Artchie ang base memory mo.
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </motion.div>

        {/* Dynamic AI Learnt Memories */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/40 p-6 rounded-2xl border border-white/5 backdrop-blur-md flex flex-col h-full"
        >
          <div className="flex items-center justify-between border-b border-white/5 pb-3">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <h3 className="font-semibold text-white text-base">Naalala ni Artchie</h3>
            </div>
            <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-0.5 rounded-full font-bold">
              {userProfile.memories.length} Facts
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-3 mb-4 leading-relaxed">
            Habang kayo ay nag-uusap, kusang naitatala ni Artchie ang mga personal mong kwento para mas maging personal ang inyong samahan sa susunod na mga sessions.
          </p>

          <div className="flex-grow space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {userProfile.memories.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-slate-950/40 rounded-xl border border-white/5 border-dashed">
                <Brain className="w-8 h-8 text-slate-500 mb-2" />
                <p className="text-slate-400 text-xs">Wala pa akong alam na sikreto mo, kaibigan. Simulan na nating mag-usap!</p>
              </div>
            ) : (
              userProfile.memories.map((m, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 bg-white/5 rounded-xl border border-white/10 group hover:border-pink-500/30 transition-all"
                >
                  <p className="text-xs text-slate-200 break-words flex-1 pr-3">
                    ✨ {m}
                  </p>
                  <button
                    onClick={() => handleDeleteMemory(idx)}
                    className="p-1 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-lg transition-colors cursor-pointer"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddMemory} className="mt-4 flex gap-2 pt-2 border-t border-white/5">
            <input
              type="text"
              required
              placeholder="Magdagdag ng bagong memory nang manu-mano..."
              value={newMemoryInput}
              onChange={(e) => setNewMemoryInput(e.target.value)}
              className="flex-grow px-3 py-2 bg-slate-800/60 border border-white/10 rounded-xl text-slate-200 placeholder-slate-400 text-xs focus:outline-none focus:ring-1 focus:ring-pink-500"
            />
            <button
              type="submit"
              className="px-3 bg-pink-600 hover:bg-pink-500 text-white rounded-xl text-xs font-semibold cursor-pointer transition-colors shrink-0"
            >
              IDAGDAG
            </button>
          </form>
        </motion.div>
      </div>

      <div className="mt-8 p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-center text-xs text-slate-400">
        📌 Pinoprotektahan namin ang iyong data. Lahat ng chat, session history, at memory ay naka-save lamang sa iyong browser via <b>localStorage</b>.
      </div>
    </div>
  );
}
