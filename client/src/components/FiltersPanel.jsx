import React from 'react';

export default function FiltersPanel({ filters, setFilters }) {
  const handleDistance = (val) => setFilters(prev => ({ ...prev, max_distance: val }));
  const handleRating = (val) => setFilters(prev => ({ ...prev, min_rating: val }));
  const handlePrice = (val) => setFilters(prev => ({ ...prev, price_level: val }));

  return (
    <div className="glass rounded-2xl p-5 mb-6 md:mb-0 md:sticky md:top-24 w-full md:w-64 flex-shrink-0">
      <h3 className="font-bold text-lg mb-4">Filters</h3>
      
      <div className="mb-6">
        <label className="text-sm font-semibold text-textMuted block mb-2">Distance</label>
        <div className="flex flex-wrap gap-2">
          {[2000, 5000, 10000].map(dist => (
            <button
              key={dist}
              onClick={() => handleDistance(dist)}
              className={`px-3 py-1.5 text-sm rounded-full transition ${
                filters.max_distance === dist 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              &lt;{dist/1000}km
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <label className="text-sm font-semibold text-textMuted block mb-2">Rating</label>
        <div className="flex flex-wrap gap-2">
          {[0, 3, 4, 4.5].map(rating => (
            <button
              key={rating}
              onClick={() => handleRating(rating)}
              className={`px-3 py-1.5 text-sm rounded-full transition ${
                filters.min_rating === rating 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {rating === 0 ? 'Any' : `${rating}+`}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-textMuted block mb-2">Max Price</label>
        <div className="flex flex-wrap gap-2">
          {[-1, 1, 2, 3, 4].map(price => (
            <button
              key={price}
              onClick={() => handlePrice(price)}
              className={`px-3 py-1.5 text-sm rounded-full transition ${
                filters.price_level === price 
                  ? 'bg-primary text-white shadow-md' 
                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {price === -1 ? 'Any' : '₹'.repeat(price)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
