import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { ExpenseFormComponent } from './components/expense-form/expense-form.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'expenses', component: ExpenseListComponent },
  { path: 'add-expense', component: ExpenseFormComponent },
  { path: 'edit-expense/:id', component: ExpenseFormComponent },
  { path: '**', redirectTo: 'home' }
];