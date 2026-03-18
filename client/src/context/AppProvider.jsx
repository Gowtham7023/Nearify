import React, { createContext, useContext, useState, useEffect } from 'react';
import { geocodeAddress, api } from '../services/api';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('nearify_favorites');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  
  // Auth States
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('nearify_token') || null);
  
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('nearify_theme');
      if (saved) return saved === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Persist Local Favorites conditionally
  useEffect(() => {
    if (!user) {
      localStorage.setItem('nearify_favorites', JSON.stringify(favorites));
    }
  }, [favorites, user]);

  // Auth Initialization
  useEffect(() => {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('nearify_token', token);
      
      // Fetch user profile and their persistant MongoDB favorites
      api.get('/auth/me')
        .then(res => setUser(res.data.user))
        .catch(() => logout());

      api.get('/favorites')
        .then(res => {
          if(res.data.favorites) setFavorites(res.data.favorites);
        })
        .catch(console.error);

    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('nearify_token');
    }
  }, [token]);

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('nearify_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('nearify_theme', 'light');
    }
  }, [darkMode]);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (email, password) => {
    const { data } = await api.post('/auth/register', { email, password });
    setToken(data.token);
    setUser(data.user);
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setFavorites([]); // clear favs on logout
  };

  const toggleFavorite = async (place) => {
    const isFav = favorites.find(p => p.id === place.id);
    
    if (user) {
      try {
        await api.post('/favorites', { place: place, action: isFav ? 'remove' : 'add' });
      } catch (err) {
        console.error("Failed to sync favorite to database", err);
        return; // Halt if DB sync fails
      }
    }
    
    // Update local state immediately after DB success (or locally if no user)
    setFavorites(prev => {
      if (isFav) return prev.filter(p => p.id !== place.id);
      return [...prev, place];
    });
  };

  const getUserLocation = () => {
    return new Promise((resolve, reject) => {
      setLoading(true);
      if (!navigator.geolocation) {
        setLoading(false);
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const loc = { 
              lat: position.coords.latitude, 
              lng: position.coords.longitude,
              addressString: "Current Location"
            };
            setUserLocation(loc);
            setLoading(false);
            resolve(loc);
          },
          (err) => {
            setLoading(false);
            reject(new Error('Location permission denied. Please allow access.'));
          }
        );
      }
    });
  };

  const searchCustomLocation = async (addressQuery) => {
    try {
      setLoading(true);
      setError(null);
      const data = await geocodeAddress(addressQuery);
      if (data && data.lat && data.lng) {
        setUserLocation({
          lat: data.lat,
          lng: data.lng,
          addressString: data.address
        });
        return true;
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to find that location.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider value={{
      places, setPlaces,
      favorites, toggleFavorite,
      loading, setLoading,
      error, setError,
      userLocation, setUserLocation,
      getUserLocation, searchCustomLocation,
      darkMode, setDarkMode,
      user, login, register, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
