import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';
import { Dev } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
   private socket!: Socket;

  constructor() {

  }
connect():boolean{
      this.socket = io(Dev.socketUrl, {
      auth: {
        token: localStorage.getItem('Token') // خزّن التوكين هنا
      },
      transports: ['websocket'] // أو حسب إعداداتك
    });

    this.socket.on('connect', () => {
      console.log('🟢 Socket connected:', this.socket.id);
      return true;
    });

    this.socket.on('connect_error', (err) => {
      console.error('❌ Socket connection error:', err.message);
      return false;
    });
    return false;
}

  // Listen to any event
  listen(eventName: string): Observable<any> {
    return new Observable((subscriber) => {
      this.socket.on(eventName, (data) => {
        subscriber.next(data);
      });
    });
  }
  

  /** 👂 استقبال رسالة جديدة */
  // onNewMessage(): Observable<any> {
  //   return new Observable(observer => {
  //     this.socket.on('new message', (message) => {
  //       observer.next(message);
  //     });
  //   });
  // }
  // onNewFriendsRequest(): Observable<any> {
  //   return new Observable(observer => {
  //     this.socket.on('new friend request', (request) => {
  //       console.log('New friend request received:', request);
        
  //       observer.next(request);
  //     });
  //   });
  // }
  // onChatAccessed(): Observable<any> {
  //   return new Observable(observer => {
  //     this.socket.on('chat accessed', (request) => {
  //       console.log('Chat accessed event received:', request);

  //       observer.next(request);
  //     });
  //   });
  // }

  /** 📬 إرسال انك بتكتب */
  typing(chatId: string) {
    this.socket.emit('typing', { chatId, isTyping: true });
  }

  /** ✋ إيقاف الكتابة */
  stopTyping(chatId: string) {
    this.socket.emit('typing', { chatId, isTyping: false });
  }

  /** 📩 دخول روم */
  joinChat(chatId: string) {
    this.socket.emit('join chat', chatId);
  }

  /** 🚪 الخروج من روم */
  leaveChat(chatId: string) {
    this.socket.emit('leave chat', chatId);
  }

  /** 👀 متابعة الكتابة من الآخرين */
  onTyping(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('typing', data => observer.next({ ...data, isTyping: true }));
      this.socket.on('stop typing', data => observer.next({ ...data, isTyping: false }));
    });
  }

  /** 💌 استقبال تأكيد التوصيل */
  onMessageDelivered(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('message delivered', data => observer.next(data));
    });
  }

  /** 🧑‍🤝‍🧑 نظام الحالة */
  onUserStatusChange(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('user status changed', (data) => {
        observer.next(data);
      });
    });
  }
  chatAccessed(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('chat access', (data) => {
        observer.next(data);
        console.log(data);
        
      });
    });
  }

  /** 🔔 طلبات صداقة */
  onFriendRequest(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('new friend request', (data) => {
        console.log('New friend request received:', data);
        
        observer.next(data);
      });
    });
  }

  /** ✅ الرد على طلب الصداقة */
  onFriendRequestResponse(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('friend_request_response', (data) => {
        observer.next(data);
      });
    });
  }
   emit(eventName: string, data: any) {
    this.socket.emit(eventName, data);
  }
disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket?.emit('user-logout');
    }
  }
  
}
