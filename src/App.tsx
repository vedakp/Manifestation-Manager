import React, { useState, useEffect, useRef } from 'react';
import { Goal, JournalEntry, MoneyWin, AppSettings } from './types';
import { AddGoalForm } from './components/AddGoalForm';
import { GoalList } from './components/GoalList';
import { Stats } from './components/Stats';
import { MoneyMagnet } from './components/MoneyMagnet';
import { Settings as SettingsComponent } from './components/Settings';
import { exportReportToPdf } from './lib/pdfExport';
import { PrintableManifestation } from './components/PrintableManifestation';
import { PrintableList } from './components/PrintableList';
import { Compass } from './components/Compass';
import { ListTodo, PlusCircle, BarChart3, Heart, DollarSign, Magnet, Sparkles, Cloud, Sun, Settings as SettingsIcon, Compass as CompassIcon, Printer } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import quotesData from './data/quotes.json';

export default function App() {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('manifest-goals');
    return saved ? JSON.parse(saved) : [];
  });
  const [entries, setEntries] = useState<JournalEntry[]>(() => {
    const saved = localStorage.getItem('manifest-entries');
    return saved ? JSON.parse(saved) : [];
  });
  const [moneyWins, setMoneyWins] = useState<MoneyWin[]>(() => {
    const saved = localStorage.getItem('manifest-money-wins');
    return saved ? JSON.parse(saved) : [];
  });
  const [settings, setSettings] = useState<AppSettings>(() => {
    const saved = localStorage.getItem('manifest-settings');
    return saved ? JSON.parse(saved) : { currency: '$', soundEnabled: true };
  });
  
  const [activeTab, setActiveTab] = useState<'list' | 'add' | 'stats' | 'money' | 'settings' | 'compass'>('list');
  
  const [dailyQuote] = useState(() => {
    return quotesData[Math.floor(Math.random() * quotesData.length)];
  });

  const [dailyAffirmation, setDailyAffirmation] = useState("I am an open channel for infinite abundance.");
  const [isCheckingIn, setIsCheckingIn] = useState(false);
  const [chargeProgress, setChargeProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [printingGoal, setPrintingGoal] = useState<Goal | null>(null);

  const chargeIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    localStorage.setItem('manifest-goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('manifest-entries', JSON.stringify(entries));
    calculateStreak();
  }, [entries]);

  useEffect(() => {
    localStorage.setItem('manifest-money-wins', JSON.stringify(moneyWins));
  }, [moneyWins]);

  useEffect(() => {
    localStorage.setItem('manifest-settings', JSON.stringify(settings));
  }, [settings]);

  const playChime = () => {
    if (!settings.soundEnabled) return;
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(523.25, audioCtx.currentTime); // C5
      oscillator.frequency.exponentialRampToValueAtTime(1046.50, audioCtx.currentTime + 0.5); // C6
      
      gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.5, audioCtx.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.8);
      
      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.8);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const fetchAffirmation = async () => {
      try {
        const today = format(new Date(), 'yyyy-MM-dd');
        const hasEntryToday = entries.some(e => e.date === today);
        
        if (hasEntryToday) {
           const todayEntry = entries.find(e => e.date === today);
           if (todayEntry) {
              setDailyAffirmation(todayEntry.affirmation);
              return;
           }
        }
        
        const fallbackAffirmations = [
          "I am an open channel for infinite abundance.",
          "Every day, in every way, I am getting better and better.",
          "I attract miracles naturally.",
          "The universe is conspiring in my favor.",
          "I am worthy of all my dreams coming true."
        ];
        setDailyAffirmation(fallbackAffirmations[Math.floor(Math.random() * fallbackAffirmations.length)]);
      } catch (e) {
        console.error("Error setting affirmation", e);
      }
    };
    fetchAffirmation();
  }, []);

  const calculateStreak = () => {
    if (entries.length === 0) return setStreak(0);
    
    const sortedDates = [...entries].map(e => e.date).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    let currentStreak = 0;
    const today = format(new Date(), 'yyyy-MM-dd');
    let dateToCheck = new Date(today);

    if (sortedDates[0] !== today) {
       dateToCheck.setDate(dateToCheck.getDate() - 1);
       if (sortedDates[0] !== format(dateToCheck, 'yyyy-MM-dd')) {
         return setStreak(0);
       }
    }

    let i = 0;
    while (i < sortedDates.length) {
      if (sortedDates[i] === format(dateToCheck, 'yyyy-MM-dd')) {
        currentStreak++;
        dateToCheck.setDate(dateToCheck.getDate() - 1);
        i++;
      } else {
        break;
      }
    }
    setStreak(currentStreak);
  };

  const handleAddGoal = (title: string, price?: number, emotionalWhy?: string, reikiSymbol?: string) => {
    const newGoal: Goal = {
      id: Date.now().toString(),
      title,
      price,
      emotionalWhy,
      reikiSymbol,
      roadmap: [],
      isCompleted: false,
    };
    setGoals([newGoal, ...goals]);
    setActiveTab('list');
  };

  const handleUpdateGoal = (id: string, title: string, price?: number, emotionalWhy?: string, reikiSymbol?: string) => {
    setGoals(goals.map(g => 
      g.id === id ? { ...g, title, price, emotionalWhy, reikiSymbol } : g
    ));
    setEditingGoal(null);
    setActiveTab('list');
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setActiveTab('add');
  };

  const handlePrintGoal = (goal: Goal) => {
    setPrintingGoal(goal);
    setTimeout(() => {
      exportReportToPdf('print-manifestation');
    }, 100);
  };

  const handleCancelEdit = () => {
    setEditingGoal(null);
    setActiveTab('list');
  };

  const handlePrintList = () => {
    setTimeout(() => {
      exportReportToPdf('print-manifestation-list');
    }, 100);
  };

  const handleGoalsReorder = (reorderedGoals: Goal[]) => {
    setGoals(reorderedGoals);
  };

  const handleToggleGoal = (id: string) => {
    setGoals(goals.map(g => 
      g.id === id ? { ...g, isCompleted: !g.isCompleted } : g
    ));
  };

  const handleDeleteGoal = (id: string) => {
    setGoals(goals.filter(g => g.id !== id));
  };

  const handleAddMoneyWin = (amount: number, description: string) => {
    const newWin: MoneyWin = {
      id: Date.now().toString(),
      amount,
      description,
      date: new Date().toISOString()
    };
    setMoneyWins([newWin, ...moneyWins]);
  };

  const completeCheckIn = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    if (entries.some(e => e.date === today)) return;
    
    setEntries([{ date: today, affirmation: dailyAffirmation }, ...entries]);
    setIsCheckingIn(true);
    setChargeProgress(0);
    
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate([100, 50, 100, 50, 200]);
    }
    playChime();
    
    setTimeout(() => setIsCheckingIn(false), 3000);
  };

  const startCharge = () => {
    if (hasCheckedInToday) return;
    setChargeProgress(0);
    
    let progress = 0;
    chargeIntervalRef.current = window.setInterval(() => {
      progress += 5; // 5% every 50ms = 100% in 1 second (fast but satisfying)
      if (progress >= 100) {
        if (chargeIntervalRef.current) clearInterval(chargeIntervalRef.current);
        completeCheckIn();
        setChargeProgress(100);
      } else {
        setChargeProgress(progress);
        if (navigator.vibrate && progress % 20 === 0) navigator.vibrate(10); // subtle ticks
      }
    }, 50);
  };

  const endCharge = () => {
    if (chargeIntervalRef.current) {
      clearInterval(chargeIntervalRef.current);
      if (chargeProgress < 100 && !hasCheckedInToday) {
        setChargeProgress(0); // Reset if didn't hold long enough
      }
    }
  };

  const today = format(new Date(), 'yyyy-MM-dd');
  const hasCheckedInToday = entries.some(e => e.date === today);

  const totalPrice = goals.reduce((sum, g) => sum + (g.price || 0), 0);
  
  // Calculate active energy flow (number of check-ins + streak modifier)
  const energyFlow = streak * 10 + (hasCheckedInToday ? 20 : 0);

  return (
    <div className="min-h-[100dvh] bg-gray-50 flex justify-center p-0 sm:p-4 font-sans items-center">
      <div className="w-full sm:max-w-[420px] bg-white h-[100dvh] sm:h-[800px] sm:max-h-[90vh] sm:rounded-3xl sm:shadow-lg relative overflow-hidden sm:border border-gray-100 flex flex-col">
        
        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-24 px-4 pt-6 relative z-10" id="report-content">
          
          {/* Global Header */}
          <header className="text-center mb-6 relative">
            <h1 className="text-2xl font-serif text-gray-800 flex items-center justify-center gap-2">
              Manifest
              <Sparkles className="text-gray-400 w-5 h-5 drop-shadow-sm" fill="currentColor" />
            </h1>
            <p className="text-sm font-medium text-gray-500 mt-2 italic px-4">"{dailyQuote}"</p>
          </header>

          {activeTab === 'list' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              
              {/* Daily Affirmation & Energy Check-in */}
              <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm mb-6 text-center transform hover:-translate-y-0.5 transition-transform">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Daily Energy Check-in</h2>
                
                <div className="relative mx-auto w-48 h-12">
                  {/* Energy Progress Ring / Background */}
                  <div 
                    className="absolute inset-0 bg-gray-200 rounded-xl opacity-50"
                    style={{ width: `${chargeProgress}%`, transition: 'width 0.1s linear' }}
                  />
                  <button
                    onMouseDown={startCharge}
                    onMouseUp={endCharge}
                    onMouseLeave={endCharge}
                    onTouchStart={startCharge}
                    onTouchEnd={endCharge}
                    disabled={hasCheckedInToday || isCheckingIn}
                    className={`absolute inset-0 w-full h-full rounded-xl font-medium text-sm transition-all flex items-center justify-center gap-2 select-none border
                      ${hasCheckedInToday 
                        ? "bg-gray-50 text-gray-500 border-gray-200 z-10" 
                        : "bg-white text-gray-700 hover:bg-gray-50 border-gray-200 shadow-sm z-10"}
                    `}
                  >
                    <Sparkles className={hasCheckedInToday ? "text-gray-400" : "text-gray-500"} fill={hasCheckedInToday ? "currentColor" : "none"} size={16} />
                    {isCheckingIn 
                      ? "Charging Aura..." 
                      : hasCheckedInToday 
                        ? "Energy Sent! ✨" 
                        : chargeProgress > 0 
                          ? "Hold to Charge!" 
                          : "Hold to Send Energy"}
                  </button>
                </div>
              </div>

              {/* Manifest List Stats */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Manifest Value</p>
                  <p className="text-xl font-light text-gray-800 flex items-center">
                    <span className="mr-0.5 text-sm text-gray-500">{settings.currency}</span>
                    {totalPrice.toLocaleString()}
                  </p>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Vibe Level</p>
                    <div className="flex items-center justify-end gap-1 text-gray-800 font-medium">
                      <Sparkles size={14} className="text-gray-500" /> {energyFlow}%
                    </div>
                  </div>
                  {goals.length > 0 && (
                    <button
                      onClick={handlePrintList}
                      className="bg-gray-50 border border-gray-100 text-gray-500 p-2 rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
                      title="Print List"
                    >
                      <Printer size={16} />
                    </button>
                  )}
                </div>
              </div>
              
              <GoalList 
                goals={goals}
                onGoalsReorder={handleGoalsReorder}
                onToggleGoal={handleToggleGoal}
                onDeleteGoal={handleDeleteGoal}
                onEditGoal={handleEditGoal}
                onPrintGoal={handlePrintGoal}
                currency={settings.currency}
              />
            </div>
          )}

          {activeTab === 'add' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <AddGoalForm 
                onAddGoal={handleAddGoal} 
                onUpdateGoal={handleUpdateGoal}
                initialData={editingGoal}
                onCancelEdit={handleCancelEdit}
                currency={settings.currency} 
              />
            </div>
          )}

          {activeTab === 'compass' && (
            <Compass />
          )}

          {activeTab === 'money' && (
            <MoneyMagnet wins={moneyWins} onAddWin={handleAddMoneyWin} currency={settings.currency} />
          )}

          {activeTab === 'stats' && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
              <Stats goals={goals} entries={entries} streak={streak} />
            </div>
          )}

          {activeTab === 'settings' && (
            <SettingsComponent 
              settings={settings} 
              onUpdateSettings={setSettings} 
              goals={goals}
              moneyWins={moneyWins}
              onImportData={(importedGoals, importedWins) => {
                setGoals(importedGoals);
                setMoneyWins(importedWins);
                setActiveTab('list');
              }}
            />
          )}

        </div>

        {/* Bottom Taskbar */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-100 px-6 py-3 pb-8 sm:pb-4 flex justify-between items-center z-50 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex flex-col items-center gap-1 transition-colors w-12 ${activeTab === 'list' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <ListTodo size={22} className={activeTab === 'list' ? 'stroke-[2px]' : ''} />
            <span className="text-[10px] font-semibold">List</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('money')}
            className={`flex flex-col items-center gap-1 transition-colors w-12 ${activeTab === 'money' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <Magnet size={22} className={activeTab === 'money' ? 'stroke-[2px]' : ''} />
            <span className="text-[10px] font-semibold">Attract</span>
          </button>
          
          <button 
            onClick={() => {
              setEditingGoal(null);
              setActiveTab('add');
            }}
            className={`flex flex-col items-center justify-center w-14 h-14 rounded-full -mt-8 shadow-sm border border-gray-100 transition-transform hover:scale-105 active:scale-95 bg-gray-900 text-white flex-shrink-0 mx-2`}
          >
            <PlusCircle size={24} />
          </button>
          
          <button 
            onClick={() => setActiveTab('compass')}
            className={`flex flex-col items-center gap-1 transition-colors w-12 ${activeTab === 'compass' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <CompassIcon size={22} className={activeTab === 'compass' ? 'stroke-[2px]' : ''} />
            <span className="text-[10px] font-semibold">Place</span>
          </button>

          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex flex-col items-center gap-1 transition-colors w-12 ${activeTab === 'settings' ? 'text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <SettingsIcon size={22} className={activeTab === 'settings' ? 'stroke-[2px]' : ''} />
            <span className="text-[10px] font-semibold">Settings</span>
          </button>
        </div>

        <PrintableManifestation goal={printingGoal} currency={settings.currency} />
        <PrintableList goals={goals} currency={settings.currency} totalPrice={totalPrice} />
      </div>
    </div>
  );
}
