import { ChangeDetectorRef, Component,Input , OnInit } from '@angular/core';
import { Chats as  ChatsService} from '../../../Services/Chats/chats';
import { Auth } from '../../../Services/Auth/auth';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';

import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Messages } from '../../../Services/Chats/messages';
import { Status } from '../../../Services/UserStatus/status';
import { TimeAgoPipe } from '../../../pipes/time-ago-pipe';

@Component({
  selector: 'app-chats',
  imports: [TimeAgoPipe,MatIconModule,CommonModule, MatListModule, MatButtonModule, MatMenuModule, MatFormFieldModule, MatInputModule, FormsModule],
  templateUrl: './chats.html',
  styleUrl: './chats.css'
})
export class Chats implements OnInit {
  chats: any[] = [];
  counter: number = 0;
  userStatus: any;
   currentUserId: any
  currentUser: any;
  selectedChat: any;
  searchTerm: any;
  isMobileMenuOpen: boolean = false;

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    this.cdr.detectChanges();
  }

  constructor(
    private _chats:ChatsService,
    private _auth:Auth,
    private cdr: ChangeDetectorRef,
    private _messages :Messages,
    private _userstatus:Status,
    
  ) {}
  ngOnInit(): void {
      this._chats.getChats().subscribe({
  next:(chats)=>{

    this.chats = chats?.data;
    console.log('Fetched chats:', this.chats);
   
   
    this.cdr.detectChanges();
  }
  ,
  error:(err)=>{
    console.error('Error fetching chats:', err);
  
}})
this._auth.UserData.subscribe({
  next:(userData)=>{
    console.log('User data:', userData);
    this.currentUserId = userData;
    console.log('Current user ID:', this.currentUserId);

    this.cdr.detectChanges();


  },
  error:(err)=>{
    console.error('Error fetching user data:', err);
  }
  })


}

  messages: any[] = [];
  newMessage: string = '';
  
  selectChat(chat: any) {
    this.selectedChat = chat;
    console.log('Selected chat:', chat);
    this._messages.getMessages(chat._id).subscribe({
      next: (response) => {
        console.log('Fetched messages:', response);
        this.messages = response?.data;
        this.scrollToBottom();
        this.cdr.detectChanges();

      },
      error: (err) => {
        console.error('Error fetching messages:', err);
      }
    });
    this._messages.markMessagesAsRead(chat._id).subscribe({
      next: (response) => {
        console.log('Messages marked as read:', response);
      },
      error: (err) => {
        console.error('Error marking messages as read:', err);
      }
    });
  }

  sendMessage() {
   
    if (!this.newMessage.trim() || !this.selectedChat) return;

    // Add optimistic update
    const tempMessage = {
      _id: Date.now().toString(),
      content: this.newMessage,
      sender: this.currentUser,
      createdAt: new Date().toISOString(),
      readBy: [],
      chat: this.selectedChat._id
    };

    this.messages.push(tempMessage);
    this.scrollToBottom();
    
    // Clear input
    const messageContent = this.newMessage;
    this.newMessage = '';

    // Send to server
    this._messages.sendMessage(this.selectedChat._id, messageContent).subscribe({
      next: (response:any) => {
        console.log('Message sent:', response);
        // Update the temporary message with the real one
        const index = this.messages.findIndex(m => m._id === tempMessage._id);
        if (index !== -1) {
          this.messages[index] = response.data;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error sending message:', err);
        // Remove the temporary message on error
        this.messages = this.messages.filter(m => m._id !== tempMessage._id);
        this.cdr.detectChanges();
      }
    });
    




  }

  private scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('.messages-list');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    });
  }
   getOtherUser(chat: any): any {
  // console.log(chat.users.find((user: any) => user._id !== this.currentUserId?._id) );
  
    
    return chat.users.find((user: any) => user._id !== this.currentUserId?._id) 
  }

  getOtherUserName(chat: any): string {
    const otherUser = this.getOtherUser(chat);
    return `${otherUser.firstName} ${otherUser.lastName}`;
  }

  getOtherUserAvatar(chat: any): string {
    // const otherUser = this.getOtherUser(chat);
    // return otherUser.avatar || 'assets/default-avatar.png';
    return  'assets/default-avatar.png';
  }

  isUserOnline(user: any): boolean {
    // Implement your online status check logic

    return user?.userStatus === 'online' ? true : false; // or your implementation
  }
//   changeUserStatus(chat: any, status: string) {
//     const users = this.chats.map(chat => chat.users)
//     let userchanged:any
//     this._userstatus.$userStatus.subscribe({
//       next: (userStatus) => {
//    userchanged = userStatus
//       },
//       error: (err) => {
//         console.error('Error fetching user status:', err);
//       }
//     })
// const userStatuschanged = users.filter(user => user._id !==userchanged.userId )

//   }

  getUnreadCount(chat: any): number {
    // Implement your unread count logic
    return chat.latestMessage?.readBy.includes(this.currentUser?._id || '') ? 0 : 1;
  }

navigateToChat(){
  this._messages.markMessagesAsRead(this.selectedChat._id).subscribe({
  next: (response) => {
  },
  error: (err) => {
    console.error('Error marking messages as read:', err);
  }
});
this.selectedChat = null; // Reset selected chat
this._chats.getChats()
this.cdr.detectChanges();
}
isViewable(){
  return this.currentUserId? true:false
}
UnreadMessagesCount(chat: any,thisUserId:string): number {
  let count = 0;
  if (!chat.latestMessage || !chat.latestMessage.readBy) {
    return 0;
  }
      
      chat.messages.forEach((message: any) => {
        message.readBy.forEach((userId: string) => {
          if (userId === thisUserId) {
            console.log(` userId ${userId} currentUserId ${thisUserId}`);
            
            count++;
          }
        });

      });

  return chat.messages.length - count;
}
getLastMessageSender(chat: any): string {
  if (!chat.latestMessage || !chat.latestMessage.sender) {
    return '';
  }

  return chat.latestMessage.sender === this.currentUserId?._id ? 'You' : this.getOtherUser(chat)?.username;

}
}
