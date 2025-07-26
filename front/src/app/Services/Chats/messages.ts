import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Dev } from '../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class Messages {
       messages$:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(
    private http: HttpClient
  ){}

  getMessages(chatId: string) {
    this.http.get(`${Dev.apiUrl}/messages/${chatId}`).subscribe({
      next: (messages) => {
        this.messages$.next(messages);
      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      }
    });
    return this.messages$.asObservable();
  }
  sendMessage(chatId: string, messageData: any) {
    return this.http.post(`${Dev.apiUrl}/messages`, {chatId, content:messageData});
  }
  markMessagesAsRead(chatId: string) {
    return this.http.put(`${Dev.apiUrl}/messages/${chatId}/read`, {});
  }
}
