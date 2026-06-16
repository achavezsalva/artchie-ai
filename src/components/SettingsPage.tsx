import React from 'react';
import { motion } from 'motion/react';
import { Settings, Shield, Globe, RefreshCw, Trash2, Heart, HelpCircle, Palette } from 'lucide-react';
import { UserProfile } from '../types';

interface SettingsPageProps {
  userProfile: UserProfile;
  onChangeProfile: (profile: UserProfile) => void;
  onClearHistory: () => void;
  onLoadDemoScenarios: () => void;
}

export default function SettingsPage({
  userProfile,
  onChangeProfile,
  onClearHistory,
  onLoadDemoScenarios,
}: SettingsPageProps) {

  const isCharcoal = userProfile.theme === 'charcoal';

  const handleLanguageChange = (lang: 'Mix' | 'English' | 'Tagalog' | 'Bisaya') => {
    onChangeProfile({
      ...userProfile,
      languagePreference: lang,
    });
  };

  const clearAllData = () => {
    if (window.confirm("Sigurado ka ba? Buburahin nito ang lahat ng saved memories, user stats, at inyong buong chat session history kasama si Artchie AI.")) {
      onClearHistory();
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 text-slate-200">
      <div className="mb-8">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-400 via-rose-300 to-amber-300 bg-clip-text text-transparent flex items-center gap-2">
          <Settings className="w-6 h-6 text-indigo-400" />
          Settings at Konpigurasyon
        </h2>
        <p className="text-slate-300 text-sm leading-relaxed mt-1">
          I-personalize ang wika, seguridad, at data ng iyong paboritong AI companion.
        </p>
      </div>

      <div className="space-y-6">
        {/* Theme Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-5 rounded-2xl border backdrop-blur-md transition-all duration-300 ${
            isCharcoal ? 'bg-zinc-900/60 border-zinc-800' : 'bg-slate-900/40 border-white/5'
          }`}
        >
          <div className="flex items-center gap-2.5 mb-3">
            <Palette className={`w-5 h-5 ${isCharcoal ? 'text-amber-400' : 'text-pink-400'}`} />
            <h3 className="font-semibold text-slate-200 text-sm">Estilo at Tema (Visual Theme)</h3>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Mamili sa pagitan ng dalawang natatanging madilim na tema (dark themes) para sa mas komportableng pagbasa at visual accessibility.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                id: 'midnight',
                name: '🌌 Deep Midnight',
                desc: 'Taimtim na madilim na may asul at lilang tono ng gabi.',
              },
              {
                id: 'charcoal',
                name: '🪵 Warm Charcoal',
                desc: 'Malambot at mainit-init na madilim na abuhin para sa mata.',
              },
            ].map((t) => {
              const isSelected = (userProfile.theme || 'midnight') === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChangeProfile({ ...userProfile, theme: t.id as 'midnight' | 'charcoal' })}
                  className={`py-3 px-4 rounded-xl border text-xs font-semibold cursor-pointer text-left transition-all flex flex-col justify-between h-20 ${
                    isSelected
                      ? 'bg-gradient-to-tr from-indigo-500/25 to-pink-500/10 border-pink-500 text-pink-300 shadow-[0_0_15px_rgba(244,63,94,0.15)]'
                      : isCharcoal 
                        ? 'bg-zinc-950/50 border-zinc-800 text-zinc-300 hover:bg-zinc-900/40'
                        : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="text-[14px] text-white font-bold">{t.name}</div>
                  <div className="text-[10px] text-slate-300 font-normal mt-1 leading-normal">{t.desc}</div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Language Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5 mb-3">
            <Globe className="w-5 h-5 text-pink-400" />
            <h3 className="font-semibold text-slate-200 text-sm">Wika at Lenggwahe (Preferred Language)</h3>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Piliin kung anong salita ang mas madalas gamitin ni Artchie kapag kausap ka. Ang companion ay mahusay sa pagsasama-sama ng mga wikang lokal.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['Mix', 'English', 'Tagalog', 'Bisaya'] as const).map((lang) => {
              const isSelected = userProfile.languagePreference === lang;
              const descriptions = {
                Mix: 'Friendly Taglish',
                English: 'Formal English',
                Tagalog: 'Purong Tagalog',
                Bisaya: 'Natural Bisaya',
              };
              return (
                <button
                  key={lang}
                  onClick={() => handleLanguageChange(lang)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-gradient-to-tr from-pink-500/20 to-rose-500/10 border-pink-500 text-pink-300'
                      : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-900/40'
                  }`}
                >
                  <div className="text-[14px] text-white">{lang}</div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">{descriptions[lang]}</div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Demo data / Seed sandbox */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/40 p-5 rounded-2xl border border-white/5 backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <RefreshCw className="w-5 h-5 text-amber-300" />
            <h3 className="font-semibold text-slate-200 text-sm">Demo Companion Scenarios</h3>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Gusto mo bang subukan kaagad ang mayroon nang sample memories (mga paboritong paksa tungkol sa LDR at Freelancing) at sample chat history? Mag-load ng hugot scenario upang mapatunayan ang talino ni Artchie!
          </p>
          <button
            onClick={onLoadDemoScenarios}
            className="w-full sm:w-auto px-4 py-2 bg-gradient-to-tr from-amber-500/20 to-rose-500/10 hover:from-amber-500/30 hover:to-rose-500/20 border border-amber-500/30 text-amber-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            🚀 Load Hugot & Freelancing Demo Facts
          </button>
        </motion.div>

        {/* Destruction and clean out database */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-slate-900/40 p-5 rounded-2xl border border-rose-950/50 backdrop-blur-md"
        >
          <div className="flex items-center gap-2.5 mb-2">
            <Trash2 className="w-5 h-5 text-rose-500" />
            <h3 className="font-semibold text-rose-400 text-sm">Peligrosong Sona (Danger Zone)</h3>
          </div>
          <p className="text-xs text-slate-300 mb-4 leading-relaxed">
            Buburahin nito ang buong stored sessions at memories sa browser database para magsimula muli sa simula (hard reset).
          </p>
          <button
            onClick={clearAllData}
            className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 hover:text-rose-300 rounded-xl text-xs font-semibold cursor-pointer transition-colors"
          >
            I-clear Lahat ng Session at Memories
          </button>
        </motion.div>

        {/* Info Card / Helpful facts */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-5 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-2xl border border-white/5"
        >
          <div className="flex gap-3">
            <HelpCircle className="w-5 h-5 text-indigo-400 shrink-0" />
            <div>
              <h4 className="font-semibold text-indigo-300 text-xs uppercase tracking-wide">Tungkol kay Artchie AI</h4>
              <p className="text-xs text-slate-300 leading-relaxed mt-2">
                Si <b>Artchie AI</b> ay ginawa bilang inyong mental wellness partner, kaibigang kapiling para magbigay ng seryosong tugon, o taga-aliw kapag sadyang walang makausap.
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-2 italic">
                "Sa bawat problemang may bigat, laging may kape o tsaa at kaibigang handang makinig."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
