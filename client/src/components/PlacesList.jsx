import React from 'react';
import PlaceCard from './PlaceCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function PlacesList({ places, filters, setFilters, isFavoritesView }) {
  return (
    <div className="flex-1 w-full">
      {!isFavoritesView && places.length > 0 && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6 gap-2">
          <h2 className="font-bold text-xl sm:text-2xl">Results ({places.length})</h2>
          <select 
            className="bg-transparent border-b-2 border-slate-300 dark:border-slate-700 pb-1 text-sm font-bold focus:outline-none focus:border-primary text-textMain cursor-pointer"
            value={filters.sort}
            onChange={(e) => setFilters(prev => ({ ...prev, sort: e.target.value }))}
          >
            <option value="relevance" className="dark:bg-slate-800">Most Relevant</option>
            <option value="distance" className="dark:bg-slate-800">Nearest</option>
            <option value="rating" className="dark:bg-slate-800">Highest Rated</option>
          </select>
        </div>
      )}

      {isFavoritesView && (
        <h2 className="font-bold text-xl sm:text-2xl mb-6">Saved Places ({places.length})</h2>
      )}

      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xlg:grid-cols-3 gap-6"
      >
        <AnimatePresence>
          {places.map(place => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
