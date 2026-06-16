import React from 'react';
import { motion } from 'motion/react';
import {
  Heart,
  Sparkles,
  MessageSquare,
  Compass,
  ArrowRight,
  Shield,
  Lightbulb,
  BookOpen,
  LineChart,
  Bot,
  Video,
  Network
} from 'lucide-react';
import { CompanionMode, AIPersonality } from '../types';

interface PersonalitySelectionProps {
  currentMode: CompanionMode;
  currentPersonality: AIPersonality;
  onSelectMode: (mode: CompanionMode) => void;
  onSelectPersonality: (personality: AIPersonality) => void;
  onNavigateToChat: () => void;
}

export default function PersonalitySelection({
  currentMode,
  currentPersonality,
  onSelectMode,
  onSelectPersonality,
  onNavigateToChat,
}: PersonalitySelectionProps) {

  const modesList = [
    {
      id: 'friend' as CompanionMode,
      name: '🤝 Friend Mode',
      desc: 'Usapang tropa, daily updates, random fun topics, at simpleng kwentuhan.',
      color: 'from-emerald-500/20 to-teal-500/10 border-emerald-500/40 text-emerald-300',
      badgeColor: 'bg-emerald-500/20 text-emerald-300',
    },
    {
      id: 'hugotero' as CompanionMode,
      name: '💔 Hugotero Mode',
      desc: 'Deep love advise, comforting quotes, heartbreak guidance, and heartfelt talk.',
      color: 'from-pink-500/20 to-rose-500/10 border-pink-500/40 text-pink-300',
      badgeColor: 'bg-pink-500/20 text-pink-300',
    },
    {
      id: 'creative' as CompanionMode,
      name: '🎵 Creative Mode',
      desc: 'Sumulat ng kanta, poems, emotional stories, spoken word piece, at captions.',
      color: 'from-amber-500/20 to-yellow-500/10 border-amber-500/40 text-amber-300',
      badgeColor: 'bg-amber-500/20 text-amber-300',
    },
    {
      id: 'mentor' as CompanionMode,
      name: '🚀 Mentor Mode',
      desc: 'Goal setting, motivation guides, learning maps, at career tips para sa iyo.',
      color: 'from-cyan-500/20 to-blue-500/10 border-cyan-500/40 text-cyan-300',
      badgeColor: 'bg-cyan-500/20 text-cyan-300',
    },
  ];

  const personalitiesList = [
    {
      id: 'best_friend' as AIPersonality,
      name: 'Best Friend',
      desc: 'Friendly, funny, always active, loyal, uses common Taglish slangs, at handang makinig palagi.',
      avatar: '😊',
    },
    {
      id: 'hugotero' as AIPersonality,
      name: 'Hugotero Partner',
      desc: 'Dramatic, understands emotional pains, provides deep love analogies and comforting relationship advices.',
      avatar: '🥺',
    },
    {
      id: 'motivator' as AIPersonality,
      name: 'Dedicap Motivator',
      desc: 'Gives power boosts, quotes, highly enthusiastic cheerleader who drives you to wake up and perform.',
      avatar: '⚡',
    },
    {
      id: 'storyteller' as AIPersonality,
      name: 'Storyteller',
      desc: 'Narrates parables, parables about life, or interesting fictional situations to comfort your mind.',
      avatar: '📖',
    },
    {
      id: 'songwriter' as AIPersonality,
      name: 'Creative Songwriter',
      desc: 'Helps compile rhythmic lines, stanzas, choruses, and rhymes for songs or spoken word art.',
      avatar: '🎸',
    },
    {
      id: 'life_coach' as AIPersonality,
      name: 'Holistic Life Coach',
      desc: 'Calm, structures tips, poses reflective check-up questions, organizes long term plans step-by-step.',
      avatar: '🧘',
    },
  ];

  // Future Modules
  const futureModules = [
    {
      name: 'AI Learning Centered',
      tag: 'AI Learning',
      desc: 'Tailored study helper and academic tutor.',
      icon: BookOpen,
      color: 'border-fuchsia-500/20 text-fuchsia-400',
    },
    {
      name: 'AI Business Coach',
      tag: 'AI Startup Coach',
      desc: 'Micro-startup business planning and sales advice.',
      icon: LineChart,
      color: 'border-indigo-500/20 text-indigo-400',
    },
    {
      name: 'AI Content Creator',
      tag: 'AI Media Writer',
      desc: 'Draft scripts, blogs, or social media campaigns.',
      icon: Video,
      color: 'border-violet-500/20 text-violet-400',
    },
    {
      name: 'AI Freelancer Assistant',
      tag: 'Freelancer Ally',
      desc: 'Client proposals, rates, and platform guidance.',
      icon: Bot,
      color: 'border-purple-500/20 text-purple-400',
    },
    {
      name: 'AI Automation Assistant',
      tag: 'Smart Automation',
      desc: 'Task management and routine automations.',
      icon: Network,
      color: 'border-pink-500/20 text-pink-400',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent">
          Companion Configuration
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed mt-1">
          Ayusin ang mode at pagkatao ni Artchie para sa iyong mood ngayon.
        </p>
      </div>

      {/* Main Grid: Modes selection */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Compass className="w-4 h-4 text-pink-400" />
          Komunikasyon Modes
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {modesList.map((m) => {
            const isSelected = currentMode === m.id;
            return (
              <motion.button
                key={m.id}
                onClick={() => onSelectMode(m.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden backdrop-blur-md ${
                  isSelected
                    ? `bg-gradient-to-r ${m.color} shadow-lg ring-1 ring-white/10`
                    : 'bg-slate-900/40 border-slate-800/60 hover:bg-slate-900/60 hover:border-slate-700/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-pink-500"></span>
                  </div>
                )}
                <h4 className="font-bold text-slate-100 text-base mb-1">{m.name}</h4>
                <p className="text-slate-300 text-xs md:text-sm leading-relaxed">{m.desc}</p>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Grid: Deep Personalities selection */}
      <div className="mb-8">
        <h3 className="text-base font-semibold text-slate-200 mb-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          AI Personalities
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {personalitiesList.map((p) => {
            const isSelected = currentPersonality === p.id;
            return (
              <motion.button
                key={p.id}
                onClick={() => onSelectPersonality(p.id)}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                className={`text-left p-4 rounded-xl border transition-all cursor-pointer relative overflow-hidden flex gap-3 ${
                  isSelected
                    ? 'bg-gradient-to-br from-indigo-500/20 to-purple-500/10 border-indigo-500/60'
                    : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/60 hover:border-slate-700/40'
                }`}
              >
                <div className="text-2xl bg-slate-800/60 w-10 h-10 rounded-lg flex items-center justify-center shrink-0">
                  {p.avatar}
                </div>
                <div className="flex-grow">
                  <h4 className="font-bold text-slate-200 text-sm">{p.name}</h4>
                  <p className="text-slate-300 text-[11px] leading-relaxed mt-1">{p.desc}</p>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Section: Extensible Modular Strategy (Future Expansion Ready) */}
      <div className="mb-8 p-5 bg-gradient-to-r from-slate-950 to-slate-900 rounded-3xl border border-slate-800/55 relative overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -right-20 -bottom-20 w-48 h-48 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        <h3 className="text-sm font-semibold text-slate-200 mb-2 flex items-center gap-2">
          <Shield className="w-4 h-4 text-purple-400" />
          Artchie Core Architecture: Future Modules Expansion
        </h3>
        <p className="text-slate-300 text-[11px] md:text-xs leading-relaxed mb-4">
          Ang configuration page ni Artchie ay handa na para sa mga darating pang advanced tools. Ang backend ay modular para suportahan ang mga sumusunod nang walang major update:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {futureModules.map((fm) => {
            const IconComponent = fm.icon;
            return (
              <div
                key={fm.name}
                className={`p-3 bg-slate-900/60 rounded-xl border border-dashed text-left transition-all ${fm.color}`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <IconComponent className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold tracking-wider/60 uppercase text-slate-300 bg-slate-800/50 px-1.5 py-0.5 rounded">
                    S-Soon
                  </span>
                </div>
                <h5 className="font-semibold text-slate-200 text-xs truncate">{fm.name}</h5>
                <p className="text-[10px] text-slate-300 leading-normal mt-0.5 line-clamp-2">
                  {fm.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 mt-6">
        <button
          onClick={onNavigateToChat}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 hover:opacity-90 active:scale-95 text-white font-semibold rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-lg"
        >
          Mag-umpisang Makipag-chat
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
