import React, { useState, useEffect } from 'react';
import { Plus, Wand2, Heart, Sparkles, Check } from 'lucide-react';
import { Goal } from '../types';

interface AddGoalFormProps {
  onAddGoal: (title: string, price?: number, emotionalWhy?: string, reikiSymbol?: string) => void;
  onUpdateGoal?: (id: string, title: string, price?: number, emotionalWhy?: string, reikiSymbol?: string) => void;
  currency: string;
  initialData?: Goal | null;
  onCancelEdit?: () => void;
}

export function AddGoalForm({ onAddGoal, onUpdateGoal, currency, initialData, onCancelEdit }: AddGoalFormProps) {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [emotionalWhy, setEmotionalWhy] = useState('Joy');
  const [reikiSymbol, setReikiSymbol] = useState('Cho Ku Rei (Power)');
  const [isReframing, setIsReframing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setPrice(initialData.price !== undefined ? initialData.price.toString() : '');
      setEmotionalWhy(initialData.emotionalWhy || 'Joy');
      setReikiSymbol(initialData.reikiSymbol || 'Cho Ku Rei (Power)');
    } else {
      setTitle('');
      setPrice('');
      setEmotionalWhy('Joy');
      setReikiSymbol('Cho Ku Rei (Power)');
    }
  }, [initialData]);

  const handleReframe = async () => {
    if (!title.trim()) return;
    setIsReframing(true);
    try {
      const res = await fetch('/api/reframe-goal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: title })
      });
      const data = await res.json();
      if (data.reframedText) {
        setTitle(data.reframedText);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsReframing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const parsedPrice = price ? parseFloat(price) : undefined;
    
    if (initialData && onUpdateGoal) {
      onUpdateGoal(initialData.id, title.trim(), isNaN(parsedPrice as number) ? undefined : parsedPrice, emotionalWhy, reikiSymbol);
    } else {
      onAddGoal(title.trim(), isNaN(parsedPrice as number) ? undefined : parsedPrice, emotionalWhy, reikiSymbol);
    }
    
    if (!initialData) {
      setTitle('');
      setPrice('');
      setEmotionalWhy('Joy');
      setReikiSymbol('Cho Ku Rei (Power)');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          {initialData ? 'Edit Manifestation' : 'New Intention'}
        </h2>
        {initialData && onCancelEdit && (
          <button type="button" onClick={onCancelEdit} className="text-sm text-gray-400 hover:text-gray-600">
            Cancel
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5">
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">My Intention</label>
          <div className="relative">
            <textarea
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What are you manifesting?"
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-50 transition-all resize-none"
            />
            <button
              type="button"
              onClick={handleReframe}
              disabled={isReframing || !title.trim()}
              className="absolute bottom-3 right-3 text-xs bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 font-medium px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors disabled:opacity-50 shadow-sm"
            >
              <Wand2 size={12} className={isReframing ? 'animate-pulse text-gray-400' : ''} />
              {isReframing ? 'Reframing...' : 'Empower Text'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Target Value</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">{currency}</span>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-8 pr-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-50 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Core Emotion</label>
            <div className="relative">
              <Heart size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={emotionalWhy}
                onChange={(e) => setEmotionalWhy(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-50 transition-all appearance-none"
              >
                <option value="Joy">Joy</option>
                <option value="Freedom">Freedom</option>
                <option value="Security">Security</option>
                <option value="Peace">Peace</option>
                <option value="Love">Love</option>
              </select>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">Energy Symbol</label>
          <div className="relative">
            <Sparkles size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={reikiSymbol}
              onChange={(e) => setReikiSymbol(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-50 transition-all appearance-none"
            >
              <option value="Cho Ku Rei (Power)">Cho Ku Rei (Power & Action)</option>
              <option value="Sei He Ki (Harmony)">Sei He Ki (Harmony & Healing)</option>
              <option value="Vasudha (Prosperity)">Vasudha (Prosperity & Wealth)</option>
            </select>
          </div>
        </div>
        
        <p className="text-[10px] text-center text-gray-400 italic mt-1">
          "This or something better, for the highest good of all concerned."
        </p>

        <button
          type="submit"
          disabled={!title.trim()}
          className="w-full mt-2 bg-gray-900 hover:bg-gray-800 text-white font-medium px-6 py-3.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
        >
          {initialData ? <Check size={18} /> : <Plus size={18} />}
          <span>{initialData ? 'Save Changes' : 'Plant Intention'}</span>
        </button>
      </div>
    </form>
  );
}

