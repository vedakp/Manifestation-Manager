import React, { useState } from 'react';
import { MoneyWin } from '../types';
import { Plus, ArrowUpRight, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface MoneyMagnetProps {
  wins: MoneyWin[];
  onAddWin: (amount: number, description: string) => void;
  currency: string;
}

export function MoneyMagnet({ wins, onAddWin, currency }: MoneyMagnetProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || !description.trim()) return;
    
    onAddWin(parseFloat(amount), description.trim());
    setAmount('');
    setDescription('');
  };

  const totalAttracted = wins.reduce((sum, win) => sum + win.amount, 0);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pt-2 pb-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 mb-6 text-center">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 flex items-center justify-center gap-2">
          <Sparkles size={14} className="text-amber-400" /> Abundance Flow
        </h2>
        <p className="text-4xl font-light text-gray-800 tracking-tight">
          {currency}{totalAttracted.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">Log a Financial Win</h3>
        <div className="flex flex-col gap-4">
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-medium">{currency}</span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              min="0.01"
              step="0.01"
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-50 transition-all"
            />
          </div>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Found a coin, received a discount..."
            required
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-green-300 focus:ring-2 focus:ring-green-50 transition-all"
          />
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            <span>Add to Ledger</span>
          </button>
        </div>
      </form>

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-500 text-xs tracking-wider uppercase px-2">Recent Flow</h3>
        {wins.length === 0 ? (
          <div className="text-center p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-sm">
            Your ledger is open. Await the abundance!
          </div>
        ) : (
          wins.map((win) => (
            <div key={win.id} className="bg-white p-4 rounded-xl border border-gray-100 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-4">
                <div className="bg-green-50 p-2 rounded-lg text-green-600">
                  <ArrowUpRight size={18} />
                </div>
                <div>
                  <p className="font-medium text-gray-800 text-sm leading-tight mb-1">{win.description}</p>
                  <p className="text-[11px] text-gray-400">{format(new Date(win.date), 'MMM d, yyyy')}</p>
                </div>
              </div>
              <p className="font-medium text-gray-800">
                +{currency}{win.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
