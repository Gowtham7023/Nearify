import React from 'react';
import { Heart, Star, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAppContext } from '../context/AppProvider';

export default function PlaceCard({ place }) {
  const { favorites, toggleFavorite } = useAppContext();
  const isFav = favorites.some(p => p.id === place.id);

  const priceIndicator = place.price_level > 0 ? '₹'.repeat(place.price_level) : '';

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -5 }}
      className="glass rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col h-full bg-white dark:bg-slate-800/80"
    >
      <div className="relative h-48 bg-slate-200 dark:bg-slate-700">
        {place.photo_reference ? (
          <img 
            src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${place.photo_reference}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}`} 
            alt={place.name}
            className="w-full h-full object-cover"
            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80' }}
          />
        ) : (
          <img 
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=400&q=80" 
            alt="placeholder" 
            className="w-full h-full object-cover opacity-60 mix-blend-multiply dark:mix-blend-screen"
          />
        )}
        <button 
          onClick={() => toggleFavorite(place)}
          className="absolute top-3 right-3 p-2 bg-white/50 backdrop-blur-md rounded-full hover:bg-white dark:hover:bg-slate-800 transition shadow-sm"
        >
          <Heart size={20} className={isFav ? "fill-rose-500 text-rose-500" : "text-slate-800 dark:text-slate-200"} />
        </button>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-2 gap-2">
          <h3 className="font-bold text-lg leading-tight line-clamp-2">{place.name}</h3>
          {place.rating > 0 && (
            <div className="flex items-center gap-1 bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-1 rounded-md text-sm font-semibold flex-shrink-0">
              <Star size={15} className="fill-amber-400 text-amber-500" />
              <span>{place.rating}</span>
            </div>
          )}
        </div>

        <p className="text-sm text-textMuted mb-4 line-clamp-1">{place.vicinity}</p>
        
        <div className="mt-auto space-y-2">
          <div className="flex items-center text-sm text-textMuted gap-4">
            <span className="flex items-center gap-1">
              <MapPin size={16} className="text-rose-500" />
              {place.distance} km
            </span>
            {priceIndicator && <span className="font-medium text-slate-500 dark:text-slate-400">{priceIndicator}</span>}
          </div>
          
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock size={14} className={place.open_now ? "text-green-500" : "text-rose-500"} />
            <span className={place.open_now ? "text-green-600 dark:text-green-400" : "text-rose-600 dark:text-rose-400"}>
              {place.open_now ? "Open Now" : "Closed"}
            </span>
            <span className="text-textMuted font-normal ml-auto text-xs">
              ({place.review_count} reviews)
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
