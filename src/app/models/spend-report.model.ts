export interface DailyTotal {
  date: string;
  total: number;
}

export interface SpendReport {
  dailyTotals: DailyTotal[];
  completeTotal: number;
  highestValue: number;
  lowestValue: number;
  average: number;
}
