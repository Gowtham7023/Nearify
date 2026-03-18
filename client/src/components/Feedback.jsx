import React from 'react';
import { Search, AlertCircle, Navigation } from 'lucide-react';
import { motion } from 'framer-motion';

export function Loader() {
  return (
    <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xlg:grid-cols-3 gap-6">
      {[1, 2, 3, 4, 5, 6].map(i => (
        <div key={i} className="glass rounded-2xl h-80 animate-pulse flex flex-col bg-slate-50 dark:bg-slate-800 border-none">
          <div className="h-48 bg-slate-200 dark:bg-slate-700/50 rounded-t-2xl"></div>
          <div className="p-5 space-y-4 flex-1">
            <div className="h-5 bg-slate-200 dark:bg-slate-700/50 rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-1/2"></div>
            <div className="mt-auto h-4 bg-slate-200 dark:bg-slate-700/50 rounded w-full"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function ErrorMessage({ message }) {
  return (
    <div className="flex-1 w-full flex flex-col items-center justify-center py-16 px-4 text-center text-rose-500 bg-rose-50 dark:bg-rose-900/10 rounded-3xl border border-rose-100 dark:border-rose-900/30">
      <AlertCircle size={56} className="mb-4 opacity-90 drop-shadow-md" />
      <h3 className="text-xl font-bold mb-2">Oops! Something went wrong</h3>
      <p className="text-rose-600 dark:text-rose-400 max-w-md">{message}</p>
    </div>
  );
}

export function EmptyState({ title, description, isLocationPrompt }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} 
      animate={{ opacity: 1, scale: 1 }}
      className="flex-1 w-full flex flex-col items-center justify-center py-20 px-4 text-center glass rounded-3xl border-dashed border-2 dark:border-slate-700"
    >
      <div className="w-24 h-24 bg-blue-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-6 text-primary shadow-sm border border-slate-100 dark:border-slate-700">
        {isLocationPrompt ? (
          <Navigation size={40} className="opacity-80 drop-shadow-sm text-primary" />
        ) : (
          <Search size={40} className="opacity-80 drop-shadow-sm text-primary" />
        )}
      </div>
      <h3 className="text-2xl font-bold mb-3">{title}</h3>
      <p className="text-textMuted max-w-sm text-lg">{description}</p>
    </motion.div>
  );
}
