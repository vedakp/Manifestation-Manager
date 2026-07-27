import React, { useState, useEffect } from 'react';
import { Compass as CompassIcon, Navigation } from 'lucide-react';

export function Compass() {
  const [heading, setHeading] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const [isListening, setIsListening] = useState(false);

  const requestAccess = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          startListening();
        } else {
          setError('Permission to access device orientation was denied.');
        }
      } catch (err: any) {
        setError('Error requesting compass permission.');
      }
    } else {
      startListening();
    }
  };

  const startListening = () => {
    setIsListening(true);
    window.addEventListener('deviceorientationabsolute', handleOrientation as any, true);
    // Fallback for some devices
    window.addEventListener('deviceorientation', handleOrientation, true);
  };

  const handleOrientation = (e: DeviceOrientationEvent) => {
    let compassHeading = e.alpha;

    if ((e as any).webkitCompassHeading) {
      // iOS
      compassHeading = (e as any).webkitCompassHeading;
    } else if (e.absolute && e.alpha !== null) {
      // Android
      compassHeading = 360 - e.alpha;
    }

    if (compassHeading !== null) {
      setHeading(compassHeading);
    }
  };

  useEffect(() => {
    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation as any, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, []);

  const getDirectionText = (degrees: number) => {
    const directions = ['North', 'Northeast', 'East', 'Southeast', 'South', 'Southwest', 'West', 'Northwest'];
    const index = Math.round(((degrees %= 360) < 0 ? degrees + 360 : degrees) / 45) % 8;
    return directions[index];
  };

  const getFengShuiMeaning = (direction: string) => {
    switch (direction) {
      case 'North': return 'Career & Life Path';
      case 'Northeast': return 'Wisdom & Knowledge';
      case 'East': return 'Health & Family';
      case 'Southeast': return 'Wealth & Abundance';
      case 'South': return 'Fame & Reputation';
      case 'Southwest': return 'Love & Partnership';
      case 'West': return 'Creativity & Children';
      case 'Northwest': return 'Helpful People & Travel';
      default: return '';
    }
  };

  const currentDir = heading !== null ? getDirectionText(heading) : '-';

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pt-2 pb-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6 text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-2">Manifestation Placement</h2>
        <p className="text-sm text-gray-500 mb-6 leading-relaxed">
          Feng Shui suggests hanging your manifestation frame in specific directions to amplify energy. Use this compass to find the perfect spot in your home.
        </p>

        {!isListening ? (
          <button
            onClick={requestAccess}
            className="bg-gray-900 text-white font-medium px-6 py-3 rounded-xl hover:bg-gray-800 transition-colors inline-flex items-center gap-2"
          >
            <CompassIcon size={18} />
            Activate Compass
          </button>
        ) : (
          <div className="flex flex-col items-center">
            <div className="relative w-48 h-48 rounded-full border-4 border-gray-50 bg-gray-50 flex items-center justify-center shadow-inner mb-6">
              <div 
                className="absolute inset-0 transition-transform duration-200 ease-out"
                style={{ transform: `rotate(${heading ? -heading : 0}deg)` }}
              >
                {/* Compass Markings */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-red-500">N</div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-bold text-gray-400">S</div>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">E</div>
                <div className="absolute left-2 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">W</div>
                
                {/* Needle */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-32 flex flex-col items-center">
                  <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[16px] border-l-transparent border-r-transparent border-b-red-500"></div>
                  <div className="w-1 h-16 bg-gray-200"></div>
                </div>
              </div>
              
              {/* Center Dot */}
              <div className="w-3 h-3 bg-white rounded-full z-10 shadow-sm border border-gray-200"></div>
            </div>

            {heading !== null && (
              <div className="bg-gray-50 rounded-xl p-4 w-full">
                <div className="text-3xl font-light text-gray-800 mb-1">{Math.round(heading)}° {currentDir}</div>
                <div className="text-sm font-medium text-gray-600">{getFengShuiMeaning(currentDir)}</div>
              </div>
            )}
          </div>
        )}

        {error && <p className="text-xs text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
