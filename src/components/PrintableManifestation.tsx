import React from 'react';
import { Goal } from '../types';
import { Heart, Sparkles } from 'lucide-react';

interface PrintableProps {
  goal: Goal | null;
  currency: string;
}

export function PrintableManifestation({ goal, currency }: PrintableProps) {
  if (!goal) return null;

  const getQuote = (why?: string) => {
    switch (why) {
      case 'Joy': return "Joy is the infallible sign of the presence of universal abundance.";
      case 'Freedom': return "Freedom is the open window through which pours the light of your highest self.";
      case 'Security': return "True security lies in the infinite flow of the universe.";
      case 'Peace': return "Peace comes from within. You are aligned with tranquility.";
      case 'Love': return "Love is the bridge between you and everything you desire.";
      default: return "Whatever you hold in your mind on a consistent basis is exactly what you will experience in your life.";
    }
  };

  return (
    <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none">
      <div 
        id="print-manifestation" 
        className="w-[794px] h-[1123px] bg-[#fcf9f9] flex flex-col items-center justify-center p-24 text-center relative font-sans"
        style={{
          boxSizing: 'border-box',
          border: '24px solid #ffffff',
          boxShadow: 'inset 0 0 0 1px #f5e6ea'
        }}
      >
        <div className="absolute top-24 left-1/2 -translate-x-1/2 text-[#fbcfe8]">
          <Sparkles size={48} strokeWidth={1} />
        </div>

        <h2 className="text-xl font-medium text-[#9ca3af] mb-12 tracking-[0.4em] uppercase">My Sacred Intention</h2>
        
        <h1 className="text-5xl font-serif text-[#1f2937] mb-16 leading-[1.4] max-w-2xl">
          "{goal.title}"
        </h1>

        <div className="w-16 h-px bg-[#fde68a] mb-16"></div>

        <p className="text-2xl font-light text-[#6b7280] italic max-w-xl leading-relaxed mb-16">
          {getQuote(goal.emotionalWhy)}
        </p>

        <div className="flex items-center gap-6 text-[#9ca3af] font-medium tracking-widest text-sm uppercase">
          {goal.price !== undefined && (
            <span className="flex items-center gap-2">
              Value: {currency}{goal.price.toLocaleString()}
            </span>
          )}
          {goal.price !== undefined && goal.emotionalWhy && <span className="w-1 h-1 rounded-full bg-[#d1d5db]"></span>}
          {goal.emotionalWhy && (
            <span className="flex items-center gap-2">
              <Heart size={14} /> {goal.emotionalWhy}
            </span>
          )}
        </div>

        <div className="absolute bottom-24 text-xs font-semibold text-[#d1d5db] tracking-[0.3em] uppercase flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border border-[#e5e7eb] flex items-center justify-center">
            <span className="text-[10px]">✨</span>
          </div>
          Manifested for the highest good of all
        </div>
      </div>
    </div>
  );
}
