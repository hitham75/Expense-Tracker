export type ExpenseCategory =
  | 'Food'
  | 'Transport'
  | 'Shopping'
  | 'Bills'
  | 'Entertainment'
  | 'Other';

export interface Expense {
  id: string | number;
  title: string;
  amount: number;
  category: ExpenseCategory;
  date: string;
  note?: string;
}