import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

export interface Expense {
  id?: string | number;
  amount: number;
  category: string;
  date: string;
  note?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatbotService {
  private apiUrl = 'http://localhost:3000/expenses';

  constructor(private http: HttpClient) {}

  private async fetchExpenses(): Promise<Expense[]> {
    try {
      return await firstValueFrom(this.http.get<Expense[]>(this.apiUrl));
    } catch {
      return [];
    }  
  }

  private retrieveRelevantContext(query: string, expenses: Expense[]): { contextData: Expense[]; summary: any } {
    const q = query.toLowerCase();
    
    const categoryMatches = expenses.filter(e => e.category && e.category.toLowerCase().includes(q));
    const noteMatches = expenses.filter(e => e.note && e.note.toLowerCase().includes(q));
    
    let combined = Array.from(new Set([...categoryMatches, ...noteMatches]));
    
    if (combined.length === 0) {
      combined = expenses;
    }

    const totalAmount = combined.reduce((sum, e) => sum + Number(e.amount || 0), 0);
    const maxExpense = combined.length > 0 ? combined.reduce((prev, current) => (Number(prev.amount) > Number(current.amount)) ? prev : current) : null;

    return {
      contextData: combined,
      summary: {
        totalCount: combined.length,
        totalAmount,
        maxExpense
      }
    };
  }

  private augmentPrompt(userQuery: string, retrievedData: { contextData: Expense[]; summary: any }): string {
    return `
You are an intelligent financial assistant embedded in an Expense Tracker Angular application.
Answer the user's question accurately using ONLY the retrieved context provided below.

[Retrieved Context]
- Total Relevant Expenses Count: ${retrievedData.summary.totalCount}
- Total Amount calculated: $${retrievedData.summary.totalAmount}
- Highest Expense in Context: ${retrievedData.summary.maxExpense ? `$${retrievedData.summary.maxExpense.amount} (${retrievedData.summary.maxExpense.category})` : 'N/A'}
- Detailed Expense Items: ${JSON.stringify(retrievedData.contextData)}

User Question: "${userQuery}"

Instructions:
- If the requested information is present in the context, answer concisely in the same language as the user query (Arabic/English).
- Do not invent any numbers or details outside the provided context.
`;
  }

  async processQueryWithRAG(userQuery: string): Promise<string> {
    const expenses = await this.fetchExpenses();
    const retrieved = this.retrieveRelevantContext(userQuery, expenses);
    const augmentedPrompt = this.augmentPrompt(userQuery, retrieved);

    return this.generateAnswer(augmentedPrompt, userQuery, retrieved);
  }

  private async generateAnswer(augmentedPrompt: string, originalQuery: string, retrieved: { contextData: Expense[]; summary: any }): Promise<string> {
    const isArabic = /[\u0600-\u06FF]/.test(originalQuery);

    if (retrieved.contextData.length === 0) {
      return isArabic ? 'لا توجد مصاريف مسجلة حالياً للإجابة على استفسارك.' : 'No expenses found in your database to answer this query.';
    }

    const q = originalQuery.toLowerCase();

    if (q.includes('إجمالي') || q.includes('مجموع') || q.includes('total') || q.includes('sum')) {
      return isArabic 
        ? `إجمالي المصاريف المتعلقة بطلبك هو $${retrieved.summary.totalAmount} (عدد العمليات: ${retrieved.summary.totalCount}).`
        : `The total amount for the matching expenses is $${retrieved.summary.totalAmount} (${retrieved.summary.totalCount} transactions).`;
    }

    if (q.includes('أعلى') || q.includes('أكبر') || q.includes('highest') || q.includes('max')) {
      if (retrieved.summary.maxExpense) {
        return isArabic
          ? `أعلى مصروف هو $${retrieved.summary.maxExpense.amount} في فئة "${retrieved.summary.maxExpense.category}" بتاريخ ${retrieved.summary.maxExpense.date}.`
          : `The highest expense is $${retrieved.summary.maxExpense.amount} under category "${retrieved.summary.maxExpense.category}" on ${retrieved.summary.maxExpense.date}.`;
      }
    }

    return isArabic
      ? `تم العثور على ${retrieved.summary.totalCount} من المصاريف بإجمالي $${retrieved.summary.totalAmount}.`
      : `Found ${retrieved.summary.totalCount} expenses matching your request with a total of $${retrieved.summary.totalAmount}.`;
  }
}