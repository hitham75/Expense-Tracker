import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

@Injectable({
  providedIn: 'root'
})
export class AiChatbotService {

  sendMessage(message: string): Observable<string> {

    const reply = `شكراً لتواصلك! لقد استلمت استفسارك: "${message}". يمكنك متابعة مصروفاتك وإضافتها من القائمة الرئيسية.`;
    return of(reply).pipe(delay(1000));
  }
}