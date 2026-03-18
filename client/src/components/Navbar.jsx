import React, { useState } from 'react';
import { MapPin, Moon, Sun, LocateFixed, Search, User, LogOut } from 'lucide-react';
import { useAppContext } from '../context/AppProvider';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { darkMode, setDarkMode, userLocation, getUserLocation, searchCustomLocation, user, logout } = useAppContext();
  const [searchInput, setSearchInput] = useState('');
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      searchCustomLocation(searchInput);
      setSearchInput('');
    }
  };

  return (
    <nav className="sticky top-0 z-50 glass px-4 md:px-8 py-3 flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-white flex items-center justify-center text-white dark:text-slate-900 font-bold text-xl shadow-md">
          N
        </div>
        <span className="font-bold text-xl tracking-tight hidden sm:block">Nearify</span>
      </div>

      <div className="flex bg-slate-100 dark:bg-slate-800 rounded-full flex-1 max-w-lg px-1 py-1 items-center transition-all focus-within:ring-2 focus-within:ring-primary/50">
        <form onSubmit={handleSearch} className="flex flex-1 items-center px-3 gap-2">
          <Search size={16} className="text-textMuted" />
          <input 
            type="text" 
            placeholder={userLocation ? userLocation.addressString : "Search any location..."}
            className="bg-transparent border-none outline-none text-sm w-full dark:text-white"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
        <div className="h-5 w-px bg-slate-300 dark:bg-slate-600 mx-2 hidden sm:block"></div>
        <button 
          onClick={getUserLocation}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 transition shadow-sm text-primary flex-shrink-0"
          title="Use current location"
        >
          <LocateFixed size={16} />
          <span className="text-sm font-medium hidden md:block">Near Me</span>
        </button>
      </div>

      <div className="flex items-center gap-2 md:gap-3 flex-shrink-0">
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-full hover:bg-slate-100 dark:bg-slate-800 transition shadow-sm"
          title="Toggle Dark Mode"
        >
          {darkMode ? <Sun size={20} className="text-amber-400" /> : <Moon size={20} className="text-slate-700 dark:text-slate-300" />}
        </button>

        {user ? (
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 pl-1 p-1 pr-3 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {user.email.charAt(0).toUpperCase()}
            </div>
            <button 
              onClick={logout}
              className="text-slate-500 hover:text-rose-500 transition-colors ml-1"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          </div>
        ) : (
          <button 
            onClick={() => setIsAuthOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-full hover:shadow-lg transition hover:scale-105"
          >
            <User size={16} />
            <span className="text-sm hidden sm:block">Sign In</span>
          </button>
        )}
      </div>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </nav>
  );
}
