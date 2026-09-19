import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { Expense } from '../../models/expense.model';

@Component({
  selector: 'app-expense-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './expense-form.component.html'
})
export class ExpenseFormComponent implements OnInit {
  private expenseService = inject(ExpenseService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  isEditMode = false;
  expenseId: string | null = null;

  expenseData: Omit<Expense, 'id'> = {
    title: '',
    category: 'Food',
    amount: 0,
    date: new Date().toISOString().split('T')[0]
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEditMode = true;
      this.expenseId = idParam;
      this.expenseService.getExpenseById(idParam).subscribe({
        next: (data) => {
          this.expenseData = {
            title: data.title,
            category: data.category,
            amount: Number(data.amount),
            date: data.date
          };
        },
        error: (err) => console.error('Error fetching expense:', err)
      });
    }
  }

  onSubmit(): void {
    if (!this.expenseData.title || !this.expenseData.amount) return;

    const payload = {
      ...this.expenseData,
      amount: Number(this.expenseData.amount)
    };

    if (this.isEditMode && this.expenseId) {
      this.expenseService.updateExpense(this.expenseId, payload).subscribe({
        next: () => {
          this.expenseService.loadExpenses(); // إعادة تحميل القائمة
          this.router.navigate(['/expenses']);
        },
        error: (err) => console.error('Error updating expense:', err)
      });
    } else {
      this.expenseService.addExpense(payload).subscribe({
        next: () => {
          this.expenseService.loadExpenses(); // إعادة تحميل القائمة
          this.router.navigate(['/expenses']);
        },
        error: (err) => console.error('Error adding expense:', err)
      });
    }
  }
}