import React from 'react';
import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { useAppContext } from '../context/AppProvider';

export default function InteractiveMap({ places }) {
  const { userLocation, darkMode } = useAppContext();
  const center = userLocation ? { lat: userLocation.lat, lng: userLocation.lng } : { lat: 28.6139, lng: 77.2090 };

  return (
    <div className="w-full h-[600px] rounded-3xl overflow-hidden glass shadow-2xl relative border border-slate-200 dark:border-slate-800">
      <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
        <Map
          defaultCenter={center}
          defaultZoom={14}
          mapId={darkMode ? "8e0a97af9386fef" : "e7a3eb175f56aab8"} // generic Map IDs to enable AdvancedMarker
          disableDefaultUI={true}
          gestureHandling={'greedy'}
        >
          {/* User Location Pulse */}
          {userLocation && (
            <AdvancedMarker position={center} zIndex={100}>
              <div className="relative flex items-center justify-center w-8 h-8">
                <div className="absolute w-full h-full bg-blue-500/30 rounded-full animate-ping" />
                <div className="w-4 h-4 bg-blue-600 border-2 border-white rounded-full shadow-lg" />
              </div>
            </AdvancedMarker>
          )}

          {/* Place Markers */}
          {places && places.map((place, index) => (
            <AdvancedMarker 
              key={place.id || index}
              position={{ lat: place.location.lat, lng: place.location.lng }}
              title={place.name}
            >
              <Pin 
                background={darkMode ? '#8b5cf6' : '#3b82f6'} 
                borderColor={darkMode ? '#c4b5fd' : '#bfdbfe'} 
                glyphColor={'#fff'} 
              />
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
