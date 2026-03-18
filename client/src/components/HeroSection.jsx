import React from 'react';
import { Briefcase, Heart, Cookie, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

import { useAppContext } from '../context/AppProvider';

const MOODS = [
  { id: 'Work', label: 'Work', icon: Briefcase, iconColor: 'text-blue-500', color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' },
  { id: 'Date', label: 'Date', icon: Heart, iconColor: 'text-rose-500', color: 'bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400' },
  { id: 'Quick Bite', label: 'Quick Bite', icon: Cookie, iconColor: 'text-amber-500', color: 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400' },
  { id: 'Budget', label: 'Budget', icon: Wallet, iconColor: 'text-emerald-500', color: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400' }
];

export default function HeroSection({ selectedMood, onSelectMood }) {
  const { userLocation } = useAppContext();

  return (
    <section className="pt-8 pb-6 px-4 md:px-8 max-w-5xl mx-auto text-center">
      <motion.h1 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl md:text-5xl font-extrabold mb-5 text-slate-900 dark:text-white tracking-tight"
      >
        Places that match your vibe
      </motion.h1>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="text-textMuted mb-8 max-w-xl mx-auto flex flex-col items-center gap-3"
      >
        <p>Discover the perfect spot tailored exactly to what you're feeling right now. High-quality recommendations in seconds.</p>
        
        {userLocation && (
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/80 px-4 py-1.5 rounded-full text-sm font-semibold text-slate-800 dark:text-slate-200 shadow-sm border border-slate-200 dark:border-slate-700">
            <span className="opacity-70">Exploring:</span>
            <span className="text-primary truncate max-w-xs">{userLocation.addressString}</span>
          </div>
        )}
      </motion.div>
      
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {MOODS.map((mood, idx) => (
          <motion.button
            key={mood.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + idx * 0.1 }}
            onClick={() => onSelectMood(mood.id)}
            className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold transition-all shadow-sm ${
              selectedMood === mood.id 
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-[var(--background)] ' + mood.color
                : 'glass hover:bg-white dark:hover:bg-slate-700/80'
            }`}
          >
            <mood.icon size={20} className={selectedMood === mood.id ? '' : mood.iconColor} />
            <span className={selectedMood === mood.id ? '' : 'text-slate-700 dark:text-slate-200'}>{mood.label}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
