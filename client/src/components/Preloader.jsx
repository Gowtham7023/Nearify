import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function Preloader({ onComplete }) {
  const [dots, setDots] = useState([]);
  
  // Generate tracking pins
  useEffect(() => {
    const timer = setInterval(() => {
      setDots(prev => {
        if (prev.length >= 6) {
          clearInterval(timer);
          return prev;
        }
        return [...prev, {
          id: prev.length,
          top: `${20 + Math.random() * 60}%`,
          left: `${20 + Math.random() * 60}%`,
        }];
      });
    }, 600);
    
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);
    
    return () => {
      clearInterval(timer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  // Generate outer space particles
  const particles = Array.from({ length: 30 }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 3,
    duration: 3 + Math.random() * 4
  }));

  return (
    <motion.div 
      key="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05, filter: "blur(5px)" }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-950 overflow-hidden"
    >
      {/* Space Particles */}
      {particles.map(p => (
        <motion.div
          key={`p-${p.id}`}
          initial={{ opacity: 0, y: "100vh" }}
          animate={{ opacity: [0, 0.8, 0], y: "-10vh" }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
          className="absolute w-1 h-1 bg-blue-300 rounded-full blur-[1px]"
          style={{ left: p.left }}
        />
      ))}

      {/* Orbit/Satellite Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] md:w-[600px] md:h-[600px] perspective-[1000px]">
        <motion.div 
          animate={{ rotateZ: 360, rotateX: [70, 75, 70] }}
          transition={{ rotateZ: { duration: 15, repeat: Infinity, ease: "linear" }, rotateX: { duration: 4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }}
          className="absolute inset-0 rounded-full border border-blue-500/20 border-t-blue-400/80 shadow-[0_0_30px_rgba(59,130,246,0.2)]"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div 
          animate={{ rotateZ: -360, rotateX: [65, 70, 65] }}
          transition={{ rotateZ: { duration: 20, repeat: Infinity, ease: "linear" }, rotateX: { duration: 5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }}
          className="absolute inset-0 rounded-full border border-purple-500/20 border-b-purple-400/80 scale-125 shadow-[0_0_30px_rgba(168,85,247,0.2)]"
          style={{ transformStyle: 'preserve-3d' }}
        />
        <motion.div 
          animate={{ rotateZ: 360, rotateY: [60, 65, 60] }}
          transition={{ rotateZ: { duration: 25, repeat: Infinity, ease: "linear" }, rotateY: { duration: 6, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } }}
          className="absolute inset-0 rounded-full border border-pink-500/10 border-r-pink-400/60 scale-150"
          style={{ transformStyle: 'preserve-3d' }}
        />
      </div>

      {/* Center 3D Globe */}
      <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-full bg-slate-900 border border-slate-700/50 shadow-[inset_-25px_-25px_50px_rgba(0,0,0,0.9),0_0_60px_rgba(59,130,246,0.3)] overflow-hidden z-10 flex items-center justify-center">
        {/* Globe Grid/Map Texture (Animated) */}
        <motion.div 
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 15, ease: "linear", repeat: Infinity }}
          className="absolute inset-y-0 left-0 w-[200%] flex opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at center, transparent 30%, #0f172a 70%), linear-gradient(90deg, rgba(59,130,246,0.4) 1px, transparent 1px), linear-gradient(0deg, rgba(59,130,246,0.4) 1px, transparent 1px)`,
            backgroundSize: `100% 100%, 25px 25px, 25px 25px`
          }}
        />
        
        {/* Glowing Location Pins on Globe */}
        <AnimatePresence>
          {dots.map(dot => (
            <motion.div
              key={dot.id}
              initial={{ scale: 0, opacity: 0, y: -20 }}
              animate={{ scale: [0, 1.2, 1], opacity: 1, y: 0 }}
              transition={{ duration: 0.6, type: 'spring' }}
              className="absolute text-blue-400 drop-shadow-[0_0_12px_rgba(59,130,246,1)]"
              style={{ top: dot.top, left: dot.left }}
            >
              <MapPin size={20} className="fill-blue-500/20" />
              <motion.div 
                animate={{ scale: [1, 2.5], opacity: [0.8, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute inset-0 bg-blue-400/50 rounded-full -z-10"
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Nearify Branding */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 1 }}
        className="mt-16 z-10 text-center flex flex-col items-center"
      >
        <span className="font-extrabold tracking-widest text-4xl md:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-blue-400 to-pink-500 drop-shadow-[0_0_20px_rgba(168,85,247,0.6)]">
          Nearify
        </span>
        <motion.p 
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="text-blue-200/80 text-sm md:text-base tracking-[0.3em] uppercase font-medium mt-4"
        >
          Discovering places around you...
        </motion.p>
      </motion.div>
      
      {/* Ambient center back-glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
    </motion.div>
  );
}
