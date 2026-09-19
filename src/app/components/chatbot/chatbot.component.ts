import { Component, inject, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ExpenseService } from '../../services/expense.service';

interface ChatMessage {
  text: string;
  isUser: boolean;
}

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.css'
})
export class ChatbotComponent {
  private expenseService = inject(ExpenseService);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  isOpen: boolean = false;
  userInput: string = '';
  isTyping: boolean = false;

  messages: ChatMessage[] = [
    { text: 'مرحباً بك! أنا مساعدك الذكي للتأكد من حالة مصاريفك، كيف يمكنني مساعدتك اليوم؟', isUser: false }
  ];

  toggleChat(): void {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.scrollToBottom();
    }
  }

  sendMessage(): void {
    if (!this.userInput.trim() || this.isTyping) return;

    const query = this.userInput.trim();
    
    // إضافة رسالة المستخدم فوراً
    this.messages = [...this.messages, { text: query, isUser: true }];
    this.userInput = '';
    this.isTyping = true;
    
    this.cdr.detectChanges();
    this.scrollToBottom();

    // رد المساعد الذكي
    setTimeout(() => {
      const botResponse = this.generateSmartResponse(query);
      this.messages = [...this.messages, { text: botResponse, isUser: false }];
      this.isTyping = false;
      
      this.cdr.detectChanges();
      this.scrollToBottom();
    }, 600);
  }

  private generateSmartResponse(input: string): string {
    const text = input.toLowerCase();
    const expenses = this.expenseService.expenses();
    const totalAmount = expenses.reduce((sum, item) => sum + Number(item.amount), 0);

    if (text.includes('مرحبا') || text.includes('أهلا') || text.includes('ازيك') || text.includes('hi') || text.includes('hello')) {
      return `أهلاً بك! إجمالي مصاريفك المسجلة حالياً هو $${totalAmount.toFixed(2)}. كيف يمكنني مساعدتك اليوم؟`;
    }

    if (text.includes('تساعدني') || text.includes('ازاي') || text.includes('بتعمل ايه') || text.includes('help') || text.includes('ماذا تفعل')) {
      return `أنا مساعدك الذكي للمصاريف! 💡\nيمكنني مساعدتك في:\n1️⃣ معرفة "إجمالي المصاريف".\n2️⃣ معرفة "أعلى مصروف" قمت بإنفاقه.\n3️⃣ عرض "تفاصيل المصاريف" المسجلة بالكامل.`;
    }

    if (text.includes('مجموع') || text.includes('إجمالي') || text.includes('كم') || text.includes('كام') || text.includes('total')) {
      return `لديك ${expenses.length} مصاريف مسجلة بإجمالي قدره $${totalAmount.toFixed(2)}.`;
    }

    if (text.includes('أعلى') || text.includes('أكبر') || text.includes('highest') || text.includes('اغلى')) {
      if (expenses.length === 0) return 'لا توجد مصاريف مسجلة حتى الآن.';
      const maxExpense = expenses.reduce((max, item) => Number(item.amount) > Number(max.amount) ? item : max, expenses[0]);
      return `أعلى مصروف لديك هو "${maxExpense.title}" بقيمة $${maxExpense.amount} في فئة ${maxExpense.category}.`;
    }

    if (text.includes('تفاصيل') || text.includes('عرض') || text.includes('قائمة') || text.includes('كل') || text.includes('list')) {
      if (expenses.length === 0) return 'قائمة المصاريف فارغة حالياً.';
      const listText = expenses.map(e => `• ${e.title}: $${e.amount} (${e.category})`).join('\n');
      return `إليك قائمة مصاريفك المسجلة:\n${listText}`;
    }

    return `يمكنك أن تسألني عن "إجمالي المصاريف"، "أعلى مصروف"، أو اكتب "تقدر تساعدني ازاي" لمعرفة الخيارات المتاحة!`;
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      if (this.scrollContainer) {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }
    }, 50);
  }
}