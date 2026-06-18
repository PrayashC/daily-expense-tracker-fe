import { BehaviorSubject, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import { HttpService } from './http-service';
import { ExpenseData } from '../models/expense-data.model';
import { SpendReport } from '../models/spend-report.model';

@Injectable({
  providedIn: 'root',
})
export class ExpenseService {
  private readonly httpService = inject(HttpService);
  private readonly todayExpensesSubject = new BehaviorSubject<ExpenseData[]>([]);
  readonly todayExpenses$ = this.todayExpensesSubject.asObservable();

  public getTodayExpenses(): Observable<ExpenseData[]> {
    const api = `/api/expenses/today`;
    return this.httpService.get(api) as Observable<ExpenseData[]>;
  }

  public loadTodayExpenses(): void {
    this.getTodayExpenses().subscribe({
      next: (expenses) => this.todayExpensesSubject.next(expenses),
      error: () => this.todayExpensesSubject.next([]),
    });
  }

  public getExpensesByRange(startDate: string, endDate: string): Observable<ExpenseData[]> {
    const api = `/api/expenses/entries/range`;
    return this.httpService.get(api, { startDate, endDate }) as Observable<ExpenseData[]>;
  }

  public addExpenseEntry(entry: ExpenseData): Observable<ExpenseData[]> {
    const api = `/api/expenses/entries`;
    return this.httpService.post(api, { ...entry }) as Observable<ExpenseData[]>;
  }

  public updateExpenseEntry(entryId: string, entry: ExpenseData): Observable<ExpenseData[]> {
    const api = `/api/expenses/entries/${entryId}`;
    return this.httpService.put(api, { ...entry }) as Observable<ExpenseData[]>;
  }

  public deleteExpenseEntry(entryId: string): Observable<ExpenseData[]> {
    const api = `/api/expenses/entries/${entryId}`;
    return this.httpService.delete(api) as Observable<ExpenseData[]>;
  }

  public getSpendReport(startDate: string, endDate: string): Observable<SpendReport> {
    const api = `/api/expenses/spend-report`;
    return this.httpService.get(api, { startDate, endDate }) as Observable<SpendReport>;
  }

  public updateTodayExpenses(expenses: ExpenseData[]): void {
    this.todayExpensesSubject.next(expenses);
  }
}
