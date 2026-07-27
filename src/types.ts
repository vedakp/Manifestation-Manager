export interface Goal {
  id: string;
  title: string;
  price?: number;
  roadmap: { step: string; completed: boolean }[];
  isCompleted: boolean;
  emotionalWhy?: string;
  reikiSymbol?: string;
}

export interface JournalEntry {
  date: string;
  affirmation: string;
}

export interface MoneyWin {
  id: string;
  date: string;
  amount: number;
  description: string;
}

export interface AppSettings {
  currency: string;
  soundEnabled: boolean;
}
