import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {
  protected expenseService = inject(ExpenseService);
  
  isEditingBudget = false;
  newBudgetInput = 0;

  ngOnInit(): void {
    this.expenseService.loadExpenses();
  }

  enableBudgetEdit(): void {
    this.newBudgetInput = this.expenseService.totalBudget();
    this.isEditingBudget = true;
  }

  saveBudget(): void {
    if (this.newBudgetInput >= 0) {
      this.expenseService.setTotalBudget(this.newBudgetInput);
      this.isEditingBudget = false;
    }
  }

  cancelBudgetEdit(): void {
    this.isEditingBudget = false;
  }
}