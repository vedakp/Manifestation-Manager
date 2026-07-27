import React, { useRef } from 'react';
import { AppSettings, Goal, MoneyWin } from '../types';
import { Volume2, VolumeX, DollarSign, Settings as SettingsIcon, Download, Upload, Save, CheckCircle2 } from 'lucide-react';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
  goals: Goal[];
  moneyWins: MoneyWin[];
  onImportData: (goals: Goal[], moneyWins: MoneyWin[]) => void;
}

export function Settings({ settings, onUpdateSettings, goals, moneyWins, onImportData }: SettingsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showSavedMsg, setShowSavedMsg] = React.useState(false);

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onUpdateSettings({ ...settings, currency: e.target.value });
  };

  const toggleSound = () => {
    onUpdateSettings({ ...settings, soundEnabled: !settings.soundEnabled });
  };

  const handleExportData = () => {
    const data = {
      goals,
      moneyWins,
      settings,
      exportDate: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `manifest-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        
        if (parsed.goals && Array.isArray(parsed.goals)) {
          onImportData(parsed.goals, parsed.moneyWins || []);
          if (parsed.settings) {
            onUpdateSettings(parsed.settings);
          }
        } else {
          alert('Invalid backup file format.');
        }
      } catch (err) {
        alert('Error reading backup file.');
        console.error(err);
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleManualSave = () => {
    localStorage.setItem('manifest-goals', JSON.stringify(goals));
    localStorage.setItem('manifest-money-wins', JSON.stringify(moneyWins));
    localStorage.setItem('manifest-settings', JSON.stringify(settings));
    setShowSavedMsg(true);
    setTimeout(() => setShowSavedMsg(false), 2000);
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
          
          {/* Data Management */}
          <div className="pt-4 border-t border-gray-100">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 block">Data Management</label>
            
            <div className="space-y-3">
              <button
                onClick={handleManualSave}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
              >
                {showSavedMsg ? (
                  <><CheckCircle2 size={16} className="text-green-500" /> Saved to Local Storage</>
                ) : (
                  <><Save size={16} className="text-gray-400" /> Force Save to Local Storage</>
                )}
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleExportData}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <Download size={16} className="text-gray-400" /> Backup Data
                </button>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  <Upload size={16} className="text-gray-400" /> Restore Data
                </button>
                <input
                  type="file"
                  accept=".json"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImportData}
                />
              </div>
              <p className="text-[10px] text-gray-400 text-center mt-2 px-4">
                Backup your manifestation list to a JSON file on your device.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

