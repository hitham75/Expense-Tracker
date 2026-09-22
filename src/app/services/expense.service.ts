import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000/expenses';

  expenses = signal<Expense[]>([]);
  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  totalBudget = signal<number>(2000);

  totalSpent = computed(() => {
    return this.expenses().reduce((sum, item) => sum + Number(item.amount || 0), 0);
  });

  remainingBudget = computed(() => {
    return this.totalBudget() - this.totalSpent();
  });

  constructor(private http: HttpClient) {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.http.get<Expense[]>(this.apiUrl).subscribe({
      next: (data: Expense[]) => {
        this.expenses.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Fetch expenses error:', err);
        this.errorMessage.set('Failed to fetch expenses. Make sure json-server is running.');
        this.isLoading.set(false);
      }
    });
  }

  getExpenseById(id: string | number): Observable<Expense> {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  addExpense(payload: Partial<Expense>): Observable<Expense> {
    return this.http.post<Expense>(this.apiUrl, payload).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  updateExpense(id: string | number, payload: Partial<Expense>): Observable<Expense> {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, payload).pipe(
      catchError((error) => throwError(() => error))
    );
  }

  deleteExpense(id: string | number): void {
    this.isLoading.set(true);
    this.http.delete(`${this.apiUrl}/${id}`).subscribe({
      next: () => {
        this.expenses.update(prev => prev.filter(e => e.id !== id));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.errorMessage.set('Failed to delete expense. Check server status.');
        this.isLoading.set(false);
      }
    });
  }

  setTotalBudget(newBudget: number): void {
    this.totalBudget.set(newBudget);
  }
}