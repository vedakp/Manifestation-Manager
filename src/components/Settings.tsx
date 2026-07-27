import React from 'react';
import { AppSettings } from '../types';
import { Volume2, VolumeX, DollarSign, Settings as SettingsIcon } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

export function Settings({ settings, onUpdateSettings }: SettingsProps) {
  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateSettings({ ...settings, currency: e.target.value });
  };

  const toggleSound = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 pt-2 pb-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
          <SettingsIcon size={18} className="text-gray-400" />
          App Settings
        </h2>
        
        <div className="space-y-6">
          {/* Currency Setting */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Currency Symbol</label>
            <div className="relative">
              <DollarSign size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <select
                value={settings.currency}
                onChange={handleCurrencyChange}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm text-gray-800 focus:outline-none focus:border-gray-300 focus:ring-2 focus:ring-gray-50 transition-all appearance-none"
              >
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
                <option value="₹">₹ (INR)</option>
                <option value="¥">¥ (JPY)</option>
              </select>
            </div>
          </div>

          {/* Sound Setting */}
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Audio</label>
            <button
              onClick={toggleSound}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition-all ${
                settings.soundEnabled 
                  ? 'bg-white border-green-200 text-green-700 shadow-sm' 
                  : 'bg-gray-50 border-gray-200 text-gray-500'
              }`}
            >
              <span className="flex items-center gap-3 text-sm font-medium">
                {settings.soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                Sound Effects
              </span>
              <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-md ${settings.soundEnabled ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'}`}>
                {settings.soundEnabled ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

