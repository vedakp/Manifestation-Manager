import React from 'react';
import { Goal } from '../types';
import { Heart, Sparkles, CheckCircle, Circle } from 'lucide-react';

interface PrintableListProps {
  goals: Goal[];
  currency: string;
  totalPrice?: number;
}

export function PrintableList({ goals, currency, totalPrice = 0 }: PrintableListProps) {
  if (goals.length === 0) return null;

  return (
    <div className="fixed top-[-9999px] left-[-9999px] pointer-events-none">
      <div 
        id="print-manifestation-list" 
        className="w-[794px] min-h-[1123px] bg-[#fffcfc] flex flex-col p-16 text-left relative font-sans"
        style={{
          boxSizing: 'border-box',
          border: '24px solid #ffffff',
          boxShadow: 'inset 0 0 0 1px #e5e7eb'
        }}
      >
        <div className="absolute top-12 right-16 text-[#e5e7eb]">
          <Sparkles size={48} strokeWidth={1} />
        </div>

        <h2 className="text-xl font-medium text-[#9ca3af] mb-4 tracking-[0.4em] uppercase">My Sacred Intentions</h2>
        <div className="flex justify-between items-end mb-12">
          <h1 className="text-4xl font-serif text-[#1f2937]">Manifestation List</h1>
          <div className="text-right">
            <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-widest mb-1">Total Value</p>
            <p className="text-2xl font-light text-[#1f2937]">
              {currency}{totalPrice.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {goals.map((goal, i) => (
            <div key={goal.id} className="border-b border-[#f3f4f6] pb-6 flex items-start gap-4">
              <div className={`mt-1 ${goal.isCompleted ? 'text-[#22c55e]' : 'text-[#d1d5db]'}`}>
                {goal.isCompleted ? <CheckCircle size={24} /> : <Circle size={24} />}
              </div>
              <div className="flex-1">
                <h3 className={`text-2xl font-serif mb-2 ${goal.isCompleted ? 'text-[#9ca3af] line-through' : 'text-[#1f2937]'}`}>
                  {goal.title}
                </h3>
                <div className="flex items-center gap-4 text-[#9ca3af] font-medium tracking-widest text-[10px] uppercase">
                  {goal.price !== undefined && (
                    <span>Value: {currency}{goal.price.toLocaleString()}</span>
                  )}
                  {goal.price !== undefined && goal.emotionalWhy && <span className="w-1 h-1 rounded-full bg-[#d1d5db]"></span>}
                  {goal.emotionalWhy && (
                    <span className="flex items-center gap-1">
                      <Heart size={10} /> {goal.emotionalWhy}
                    </span>
                  )}
                  {goal.reikiSymbol && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-[#d1d5db]"></span>
                      <span className="flex items-center gap-1">
                        <Sparkles size={10} /> {goal.reikiSymbol.split(' ')[0]}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-xs font-semibold text-[#d1d5db] tracking-[0.3em] uppercase flex flex-col items-center gap-4">
          <div className="w-8 h-8 rounded-full border border-[#e5e7eb] flex items-center justify-center">
            <span className="text-[10px]">✨</span>
          </div>
          Manifested for the highest good of all
        </div>
      </div>
    </div>
  );
}
