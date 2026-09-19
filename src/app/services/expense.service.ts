import { Injectable, signal, inject, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Expense } from '../models/expense.model';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ExpenseService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:3000/expenses';

  expenses = signal<Expense[]>([]);
  
  // حفظ الميزانية الكلية في localStorage للحفاظ عليها
  totalBudget = signal<number>(
    Number(localStorage.getItem('totalBudget')) || 2000
  );

  // إجمالي المصاريف الحالية
  totalSpent = computed(() => {
    return this.expenses().reduce((acc, curr) => acc + Number(curr.amount || 0), 0);
  });

  // المتبقي من الميزانية (الميزانية الكلية - المصاريف)
  remainingBudget = computed(() => {
    return this.totalBudget() - this.totalSpent();
  });

  // تحديث الميزانية الكلية
  setTotalBudget(amount: number): void {
    this.totalBudget.set(amount);
    localStorage.setItem('totalBudget', amount.toString());
  }

  loadExpenses(): void {
    this.http.get<Expense[]>(this.apiUrl).subscribe({
      next: (data) => this.expenses.set(data),
      error: (err) => console.error('Error fetching expenses:', err)
    });
  }

  getExpenseById(id: string | number) {
    return this.http.get<Expense>(`${this.apiUrl}/${id}`);
  }

  addExpense(expense: Omit<Expense, 'id'>) {
    return this.http.post<Expense>(this.apiUrl, expense).pipe(
      tap((newExpense) => {
        this.expenses.update(items => [...items, newExpense]);
      })
    );
  }

  updateExpense(id: string | number, expense: Partial<Expense>) {
    return this.http.put<Expense>(`${this.apiUrl}/${id}`, expense).pipe(
      tap((updated) => {
        this.expenses.update(items => 
          items.map(item => String(item.id) === String(id) ? updated : item)
        );
      })
    );
  }

  deleteExpense(id: string | number) {
    return this.http.delete(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this.expenses.update(items => items.filter(item => String(item.id) !== String(id)));
      })
    );
  }
}