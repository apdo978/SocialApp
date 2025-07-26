import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Dev } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class Chats {
     chats:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient){}

  getChats() {
    this.http.get(`${Dev.apiUrl}/chats`).subscribe(data => {
      this.chats.next(data);
    });
    return this.chats.asObservable();
  }

  startNewChat(chatData: any) {
    this.http.post(`${Dev.apiUrl}/chats`, {userId: chatData}).subscribe(data => {
      this.chats.next(data);
    });
    return this.chats.asObservable();
  }
  // getChatById(chatId: string) {
  //   return this.http.get(`${Dev.apiUrl}/chats/${chatId}`);
  // }
  // Send message to a chat room
  sendChatRoomMessage(chatRoomId: string, messageData: any) {
    return this.http.post(`${Dev.apiUrl}/chats/${chatRoomId}/messages`, messageData);
  }
  createGroupChat(groupData: any) {
    return this.http.post(`${Dev.apiUrl}/chats/group`, groupData);
  }
  renameGroupChat(chatId: string, newName: string) {
    return this.http.put(`${Dev.apiUrl}/chats/group/${chatId}`, { name: newName });
  }
  addToGroup(chatId: string, userIds: string[]) {
    return this.http.put(`${Dev.apiUrl}/chats/group/${chatId}/add`, { users: userIds });
  }
  removeFromGroup(chatId: string, userIds: string[]) {
    return this.http.put(`${Dev.apiUrl}/chats/group/${chatId}/remove`, { users: userIds });
  }
}


// Group chat routes
// router.route('/group').post(protect, validateCreateGroup, createGroupChat);
// router.route('/group/:chatId').put(protect, validateRenameGroup, renameGroup);
// router.route('/group/:chatId/add').put(protect, validateGroupMembers, addToGroup);
// router.route('/group/:chatId/remove').put(protect, validateGroupMembers, removeFromGroup);