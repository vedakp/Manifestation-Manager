import React from 'react';
import { Goal, JournalEntry } from '../types';
import { Flame, Target, DollarSign, Calendar, Moon } from 'lucide-react';
import { format, isSameMonth } from 'date-fns';

interface StatsProps {
  goals: Goal[];
  entries: JournalEntry[];
  streak: number;
}

export function Stats({ goals, entries, streak }: StatsProps) {
  const totalCompleted = goals.filter(g => g.isCompleted).length;
  const totalPrice = goals.reduce((sum, g) => sum + (g.price || 0), 0);
  
  const today = new Date();
  const thisMonthEntries = entries.filter(e => isSameMonth(new Date(e.date), today));
  
  return (
    <div className="grid grid-cols-2 gap-4 mb-8 pt-2 pb-6">
      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="bg-orange-50 p-2.5 rounded-xl text-orange-500 mb-3">
          <Flame size={20} />
        </div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-1">Fire Streak</p>
        <p className="text-2xl font-light text-gray-800 tracking-tight">{streak} <span className="text-sm font-medium text-gray-400">Days</span></p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="bg-blue-50 p-2.5 rounded-xl text-blue-500 mb-3">
          <Target size={20} />
        </div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-1">Intentions Met</p>
        <p className="text-2xl font-light text-gray-800 tracking-tight">{totalCompleted} <span className="text-sm font-medium text-gray-400">/ {goals.length}</span></p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="bg-green-50 p-2.5 rounded-xl text-green-500 mb-3">
          <DollarSign size={20} />
        </div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-1">Total Value</p>
        <p className="text-2xl font-light text-gray-800 tracking-tight">${totalPrice.toLocaleString()}</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm">
        <div className="bg-purple-50 p-2.5 rounded-xl text-purple-500 mb-3">
          <Calendar size={20} />
        </div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-1">Total Days</p>
        <p className="text-2xl font-light text-gray-800 tracking-tight">{entries.length}</p>
      </div>
      
      <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex flex-col items-center justify-center text-center shadow-sm col-span-2">
        <div className="bg-white p-2.5 rounded-xl text-indigo-500 mb-3 shadow-sm">
          <Moon size={20} />
        </div>
        <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-widest mb-1">This Month</p>
        <p className="text-2xl font-light text-gray-800 tracking-tight">{thisMonthEntries.length} <span className="text-sm font-medium text-gray-400">Alignments</span></p>
      </div>
    </div>
  );
}
