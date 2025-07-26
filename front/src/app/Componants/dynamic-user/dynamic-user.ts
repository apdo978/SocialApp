import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCard, MatCardModule, } from "@angular/material/card";
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import { Chats } from '../../Services/Chats/chats';
import { Chats as chatcomp } from '../landingPage/chats/chats';
import { App } from '../../app';
import { Friends } from '../../Services/Friends/friends';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Auth } from '../../Services/Auth/auth';


@Component({
  selector: 'app-dynamic-user',
  imports: [chatcomp,CommonModule, MatCard,MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './dynamic-user.html',
  styleUrl: './dynamic-user.css'
})
export class DynamicUser implements OnInit {

  user: any;
  posts: any;
  private _router = inject(Router);
    author: any;
hideLikes: boolean;
hideComment: boolean;
  users: any;
  hideAddButton: boolean;
  constructor(
    private cdr: ChangeDetectorRef,
    private _Chats:Chats,
    private AppComp:App,
    private _Friends:Friends,
    private _snackBar: MatSnackBar,
    private _auth: Auth
  ) {
    this.hideAddButton = false;
    this.hideLikes = false;
    this.hideComment = false;

  }
  ngOnInit(): void {
  this.author =  history.state.author;
console.log(this.author);

   
    if (!this.author||!this.AppComp.userData) {
      this._router.navigate(['/landing']);
    } 
    this.users =  history.state.users;
    // this.users = this.users.filter( (user: any) => user._id === this.author._id);
    console.log(this.users);

    this.posts =  history.state.posts;
     this.posts  = this.posts.filter( (post: any) => post.author._id === this.author._id);
   

  }
createChatOrAccess(){

     this._Chats.startNewChat(this.author?._id).subscribe()
 this._Chats.getChats()

this.toggleChat()
return


 
}

  isChatOpen = false;

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }
sendFriendRequest(friendId: string) {
  console.log('Sending friend request to:', friendId);
  this.hideAddButton = true;
  
  this._Friends.addFriend(friendId).subscribe({
    next: (res: any) => {
      this._snackBar.open('Friend request sent successfully!', 'Close', {
        duration: 3000,
      });
    },
    error: (err: any) => {
      console.error('Error sending friend request:', err);
    
}
  });
  this._auth.getUSerData().subscribe(
    (userData:any) => {
//       console.log('User data:', userData);
//       console.log('User /////////////////////////////');
// this.users = userData.data;
//       this.cdr.detectChanges();
//       console.log('Users:', this.users);
    },
    (error) => {
      console.error('Error fetching user data:', error);
    }
  );
}
 findFriendRequest(authorId: any) {
// for(let i  = 39; i>0; i--){ 
//   for(let y =1; y<39; y++){
//     if(y%2 !== 0){
//       console.log( " ".repeat((i-y)/2)  + "*".repeat(y));
//     }

//   }
// }
const foundUser = this.users?.following.find((sentfriendReq:any) => sentfriendReq.recipient === authorId || sentfriendReq.sender === authorId);
const foundUserfriendrequest = this.users?.friendRequests.find((RracievedfriendReq:any) => RracievedfriendReq.recipient === authorId || RracievedfriendReq.sender === authorId);

if(!foundUser && !foundUserfriendrequest){return false}
if(foundUser){return  true }
if(foundUserfriendrequest){return  true }

return false;
  }

}
