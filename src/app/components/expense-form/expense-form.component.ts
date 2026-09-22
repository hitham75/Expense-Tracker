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

  isLoading = false;
  errorMessage: string | null = null;

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
      this.isLoading = true;

      this.expenseService.getExpenseById(idParam).subscribe({
        next: (data: Expense) => {
          this.expenseData = {
            title: data.title || '',
            category: data.category,
            amount: data.amount,
            date: data.date,
            note: data.note || ''
          };
          this.isLoading = false;
        },
        error: () => {
          this.errorMessage = 'Something went wrong loading this expense.';
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (!this.expenseData.title || !this.expenseData.amount || !this.expenseData.category || !this.expenseData.date) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = null;

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
          this.isLoading = false;
          this.expenseService.loadExpenses();
          this.router.navigate(['/expenses']);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Something went wrong saving this expense.';
        }
      });
    } else {
      this.expenseService.addExpense(payload).subscribe({
        next: () => {
          this.isLoading = false;
          this.expenseService.loadExpenses();
          this.router.navigate(['/expenses']);
        },
        error: () => {
          this.isLoading = false;
          this.errorMessage = 'Something went wrong saving this expense.';
        }
      });
    }
  }

  onCancel(): void {
    this.errorMessage = null;
    this.router.navigate(['/expenses']);
  }
}