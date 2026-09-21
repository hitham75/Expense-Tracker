import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { Expense, ExpenseCategory } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './expense-form.component.html'
})
export class ExpenseFormComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  expenseId: string | number | null = null;
  isEditMode = false;

  expenseData = {
    title: '',
    category: '' as ExpenseCategory | string,
    amount: null as number | null,
    date: '',
    note: ''
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.expenseId = idParam;
      this.isEditMode = true;
      this.expenseService.getExpenseById(idParam).subscribe({
        next: (data: Expense) => {
          this.expenseData = {
            title: data.title || '',
            category: data.category,
            amount: data.amount,
            date: data.date,
            note: data.note || ''
          };
        },
        error: (err: unknown) => console.error('Error fetching expense:', err)
      });
    }
  }

  onSubmit(): void {
    if (!this.expenseData.title || !this.expenseData.amount || !this.expenseData.category || !this.expenseData.date) {
      return;
    }

    const payload = {
      title: this.expenseData.title,
      amount: Number(this.expenseData.amount),
      category: this.expenseData.category as ExpenseCategory,
      date: this.expenseData.date,
      note: this.expenseData.note
    };

    if (this.isEditMode && this.expenseId) {
      this.expenseService.updateExpense(this.expenseId, payload).subscribe({
        next: () => {
          this.expenseService.loadExpenses();
          this.router.navigate(['/expenses']);
        },
        error: (err: unknown) => console.error('Error updating expense:', err)
      });
    } else {
      this.expenseService.addExpense(payload).subscribe({
        next: () => {
          this.expenseService.loadExpenses();
          this.router.navigate(['/expenses']);
        },
        error: (err: unknown) => console.error('Error adding expense:', err)
      });
    }
  }
}