import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { Expense, ExpenseCategory } from '../../models/expense.model';
import { timeout } from 'rxjs';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './expense-form.component.html',
  styleUrl: './expense-form.component.css'
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

      this.expenseService.getExpenseById(idParam).pipe(timeout(3000)).subscribe({
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
        error: (err) => {
          console.error('Error fetching expense:', err);
          this.errorMessage = 'Could not load expense details. Make sure json-server is running.';
          this.isLoading = false;
        }
      });
    }
  }

  onSubmit(): void {
    if (
      !this.expenseData.title ||
      !this.expenseData.title.trim() ||
      this.expenseData.amount === null ||
      this.expenseData.amount <= 0 ||
      !this.expenseData.category ||
      !this.expenseData.date
    ) {
      this.errorMessage = 'Please fill in all required fields with valid values.';
      return;
    }

    this.errorMessage = 'Something went wrong saving this expense.';
  }

  onCancel(): void {
    this.errorMessage = null;
    this.router.navigate(['/expenses']);
  }
}