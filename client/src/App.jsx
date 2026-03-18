import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import FiltersPanel from './components/FiltersPanel';
import PlacesList from './components/PlacesList';
import { Loader, ErrorMessage, EmptyState } from './components/Feedback';
import Preloader from './components/Preloader';
import InteractiveMap from './components/InteractiveMap';
import { AnimatePresence } from 'framer-motion';
import { Map as MapIcon, List as ListIcon } from 'lucide-react';
import { useAppContext } from './context/AppProvider';
import { getPlaces } from './services/api';

function App() {
  const { 
    places, setPlaces, 
    favorites, userLocation, 
    loading, setLoading, 
    error, setError 
  } = useAppContext();

  const [activeTab, setActiveTab] = useState('Results'); 
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [selectedMood, setSelectedMood] = useState(null);
  const [filters, setFilters] = useState({
    max_distance: 5000,
    min_rating: 0,
    price_level: -1,
    sort: 'relevance'
  });
  
  const [showPreloader, setShowPreloader] = useState(true); // Added showPreloader state

  const fetchRecommendations = async () => {
    if (!userLocation || !selectedMood) return;
    
    setLoading(true);
    setError(null);
    try {
      const data = await getPlaces({
        lat: userLocation.lat,
        lng: userLocation.lng,
        mood: selectedMood,
        max_distance: filters.max_distance,
        min_rating: filters.min_rating,
        price_level: filters.price_level,
        sort: filters.sort
      });
      setPlaces(data.data || []);
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to fetch places. Ensure the backend is running and API key is set.');
      setPlaces([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRecommendations();
    }, 500);
    return () => clearTimeout(timer);
  }, [userLocation, selectedMood, filters]);

  return (
    <>
      <AnimatePresence>
        {showPreloader && <Preloader onComplete={() => setShowPreloader(false)} />}
      </AnimatePresence>
      <div className={`min-h-screen flex flex-col text-textMain bg-[var(--background)] transition-colors duration-300 ${showPreloader ? 'h-screen overflow-hidden' : ''}`}>
        <Navbar />
      
      <main className="flex-1 w-full max-w-[1400px] mx-auto pb-12">
        <HeroSection selectedMood={selectedMood} onSelectMood={setSelectedMood} />

        <div className="px-4 md:px-8 mb-8 flex gap-8 border-b border-slate-200 dark:border-slate-800">
          <button 
            className={`pb-3 font-bold text-lg transition-all ${
              activeTab === 'Results' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-textMuted hover:text-textMain'
            }`}
            onClick={() => setActiveTab('Results')}
          >
            Results
          </button>
          <button 
            className={`pb-3 font-bold text-lg transition-all flex items-center gap-2 ${
              activeTab === 'Favorites' 
                ? 'border-b-2 border-primary text-primary' 
                : 'text-textMuted hover:text-textMain'
            }`}
            onClick={() => setActiveTab('Favorites')}
          >
            Favorites
            {favorites.length > 0 && (
              <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full shadow-sm">
                {favorites.length}
              </span>
            )}
          </button>
          
          {/* View Mode Toggle (Only show on Results Tab) */}
          {activeTab === 'Results' && places.length > 0 && (
            <div className="ml-auto flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl shadow-inner border border-slate-200 dark:border-slate-700">
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg flex items-center transition ${viewMode === 'list' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                <ListIcon size={18} />
              </button>
              <button 
                onClick={() => setViewMode('map')}
                className={`p-2 rounded-lg flex items-center transition ${viewMode === 'map' ? 'bg-white dark:bg-slate-700 text-primary shadow-sm' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'}`}
              >
                <MapIcon size={18} />
              </button>
            </div>
          )}
        </div>

        <div className="px-4 md:px-8 flex flex-col md:flex-row gap-8 items-start">
          {activeTab === 'Results' && (
            <>
              <FiltersPanel filters={filters} setFilters={setFilters} />
              
              <div className="flex-1 w-full">
                {loading && <Loader />}
                
                {!loading && error && <ErrorMessage message={error} />}
                
                {!loading && !error && places.length > 0 && (
                  viewMode === 'list' ? (
                    <PlacesList 
                      places={places} 
                      filters={filters} 
                      setFilters={setFilters} 
                      isFavoritesView={false} 
                    />
                  ) : (
                    <InteractiveMap places={places} />
                  )
                )}
                
                {!loading && !error && places.length === 0 && (
                  <EmptyState 
                    title={!userLocation ? "Location Required" : !selectedMood ? "Select a Mood" : "No places found"} 
                    description={
                      !userLocation ? "Please search for a location in the top bar or click 'Near Me'." :
                      !selectedMood ? "Choose what you're in the mood for to get personalized recommendations." :
                      "Try expanding your distance or lowering rating filters to see more results."
                    }
                    isLocationPrompt={!userLocation}
                  />
                )}
              </div>
            </>
          )}

          {activeTab === 'Favorites' && (
            <div className="flex-1 w-full">
              {favorites.length > 0 ? (
                <PlacesList 
                  places={favorites} 
                  filters={filters} 
                  setFilters={setFilters} 
                  isFavoritesView={true} 
                />
              ) : (
                <EmptyState 
                  title="No favorites yet" 
                  description="Places you favorite will appear here for easy access later." 
                  isLocationPrompt={false}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
    </>
  );
}

export default App;
