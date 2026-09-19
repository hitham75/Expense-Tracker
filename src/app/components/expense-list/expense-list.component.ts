import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-expense-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CurrencyPipe, DatePipe, DecimalPipe],
  templateUrl: './expense-list.component.html'
})
export class ExpenseListComponent implements OnInit {
  protected expenseService = inject(ExpenseService);

  searchTerm = signal('');
  selectedCategory = signal('');

  // دالة الحساب للتصفية المباشرة بناءً على السيرش والـ Category
  filteredExpenses = computed(() => {
    const list = this.expenseService.expenses();
    const search = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();

    return list.filter(item => {
      const matchesSearch = !search || item.title.toLowerCase().includes(search);
      const matchesCategory = !category || item.category === category;
      return matchesSearch && matchesCategory;
    });
  });

  ngOnInit(): void {
    this.expenseService.loadExpenses();
  }

  deleteExpense(id: string | number | undefined): void {
    if (!id) return;
    if (confirm('Are you sure you want to delete this expense?')) {
      this.expenseService.deleteExpense(id).subscribe({
        error: (err) => console.error('Error deleting expense:', err)
      });
    }
  }
}