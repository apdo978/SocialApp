import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './Componants/Bars/nav-bar/nav-bar';
import { MatSnackBar } from '@angular/material/snack-bar';

import { SocketService } from './Services/Sockets/socket';
import { Chats } from './Services/Chats/chats';
import { Messages } from './Services/Chats/messages';
import { HideNavBar } from './Services/HideNav/hide-nav-bar';
import { Auth } from './Services/Auth/auth';
import { Status } from './Services/UserStatus/status';
import { Friends } from './Services/Friends/friends';
import { CustomSnackbarComponent } from './Componants/landingPage/custom-snackbar-component/custom-snackbar-component';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,NavBar],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
   establishSocket: boolean = false; 
   userLogedIn: boolean = false;
   userData: any;
  protected readonly title = signal('Front');
  constructor(   private socketService: SocketService,
    private _Messages:Messages,
    private _Chats: Chats,
    private snackBar: MatSnackBar,
    private _hidenavbar:HideNavBar,
    private _auth:Auth,
    private cdr: ChangeDetectorRef,
     private _userstatus:Status,
     private _friends:Friends,
  ) {
    }
     ngOnInit(): boolean {
    // this.socketService.onNewMessage().subscribe((data) => {
    //   if (data) {
    //     this.snackBar.open(`New message from ${data.message.sender.username}`, 'Close', { duration: 3000 });
    //     // ممكن تضيف هنا توجيه أو تنبيه صوتي أو غيره
    //   }
    // });
    // this.socketService.onNewFriendsRequest().subscribe((data) => {
    //   if (data) {
    //     console.log('New friend request received:', data);
        
    //     this.snackBar.open(`New friend request from ${data}`, 'Close', { duration: 3000 });
    //     // ممكن تضيف هنا توجيه أو تنبيه صوتي أو غيره
    //   }
    // });
    // this.socketService.onChatAccessed().subscribe((data) => {
    //   if (data) {
    //     console.log(`Chat accessed by user: `+ data);
    //     this.snackBar.open(`Chat accessed by ${data.accessedBy.username}`, 'Close', { duration: 3000 });

    //   }
    // });
      this._hidenavbar.HideNav.subscribe({
      next: (hide: boolean) => {
        this.establishSocket = hide;

      }
    });
    this._auth.UserToken.subscribe({
         next: (logdin: boolean) => {
        this.userLogedIn = logdin;
        

      }
    })
    this._auth.UserData.subscribe({
      next: (userData) => {
this.userData = userData;
      }})

    this.cdr.detectChanges();
    let counter = 0;
          // this.socketService.connect();
    
          // console.log("outsideinterval");
 const checkUserlogdIn = setInterval(()=>{
    // console.log("interval ");

   counter++
   if (!this.establishSocket && this.userLogedIn  ) {
          console.log("insideinterval");

      this.socketService.connect();
      console.log('Socket connection established successfully.');
      this.snackBar.open('Socket connection established successfully.', 'Close', { duration: 3000 });
    this._hidenavbar.socketStablished.next(true)
    
    this.socketService.listen('new chat').subscribe((data) => {
      if (data) {
   ;
        this.snackBar.open(`New chat started with ID: `+data.chatId, 'Close', { duration: 3000 });
        // ممكن تضيف هنا توجيه أو تنبيه صوتي أو غيره
      }
    });
    this.socketService.listen('typing').subscribe((data) => {
      if (data) {
        console.log(`${data} is typing...`);
   
        this.snackBar.open(`${data} is typing...`, 'Close', { duration: 3000 });
        // ممكن تضيف هنا توجيه أو تنبيه صوتي أو غيره
      }
    });
    this.socketService.listen('new message').subscribe((data) => {
      if (data) {
        this._Messages.getMessages(data.chat._id).subscribe()
        this._Chats.getChats().subscribe()

        console.log(`New message received:`, data);
        this.snackBar.open(`New message from `+ data.message.sender.username, 'Close', { duration: 3000 });
        // ممكن تضيف هنا توجيه أو تنبيه صوتي أو غيره
      }
    });

    this.socketService.listen('stop typing').subscribe((data) => {
      if (data) {
        console.log(`${data} stopped typing.`);
        this.snackBar.open(`${data} stopped typing.`, 'Close', { duration: 3000 });
        // ممكن تضيف هنا توجيه أو تنبيه صوتي أو غيره
      }
    });
    this.socketService.listen('join chat').subscribe((data) => {
      if (data) {
        console.log(`Joined chat with ID: ${data}`);
        this.snackBar.open(`Joined chat with ID: ${data}`, 'Close', { duration: 3000 });
        // ممكن تضيف هنا توجيه أو تنبيه صوتي أو غيره
      }
    });
   this.socketService.listen('leave chat').subscribe(() => {
      console.log('Left chat');
      this.snackBar.open('Left chat', 'Close', { duration: 3000 });
      // ممكن تضيف هنا توج
      //  يه أو تنبيه صوتي أو غيره
   });   

    this.socketService.listen('typing').subscribe(() => {
      console.log('User is typing...');
      this.snackBar.open('User is typing...', 'Close', { duration: 3000 });
    });
    this.socketService.listen('stop typing').subscribe(() => {
      console.log('User stopped typing.');
      this.snackBar.open('User stopped typing.', 'Close', { duration: 3000 });
    });
    this.socketService.listen('new Like').subscribe((res) => {
      this.snackBar.open('new Like.'+res.message, 'Close', { duration: 3000 })
    });
    this.socketService.listen('new Comment').subscribe((res) => {
      this.snackBar.open('new Comment.'+res.message, 'Close', { duration: 3000 })
    });
    this.socketService.listen('message delivered').subscribe((data) => {
      console.log('Message delivered:', data);
      
      this.snackBar.open("Message delivered to chat with ID: ", 'Close', { duration: 3000 });
    });
    this.socketService.listen('user status changed').subscribe((data) => {
      if(data.userId == this.userData ._id){
    return
      }
      this._userstatus.$userStatus.next(data);
      this.snackBar.open(`User status changed in chat with ID: `+ data, 'Close', { duration: 3000 });
  //       this.snackBar.openFromComponent(CustomSnackbarComponent, {
  //   duration: 3000,
  //   verticalPosition: 'bottom', // أو 'bottom'
  //   horizontalPosition: 'right', // أو 'center', 'left'
  //   panelClass: ['custom-snackbar'] // هنضيفها للتصميم
  // });
    });

    this.socketService.onFriendRequest().subscribe((data) => {
      this._friends.getFriendRequests()
      console.log(data);
      
      this.snackBar.open(`New friend request`, 'Close', { duration: 3000 });
      // ممكن تضيف هنا توجيه أو تنبيه صوتي أو غيره
    });
    this.socketService.listen('friend request response').subscribe((data) => {
      this.snackBar.open(`Friend request response from user: ${data}`, 'Close', { duration: 3000 });
    });
    this.socketService.listen('chat accessed').subscribe((data) => {
      this.snackBar.open(`Chat accessed by user: ${data.accessedBy.username}`, 'Close', { duration: 3000 });
    });
    clearInterval(checkUserlogdIn);
  }
  if(this.establishSocket && counter >= 4){
    // this.socketService.disconnect();
    clearInterval(checkUserlogdIn);
  }
  if (counter >= 5){
    window.alert("Socket connection failed to establish after multiple attempts. Please check your connection or try to refresh.");
    clearInterval(checkUserlogdIn);

  } 

  },2000)


   return true;
}

  currentYear: number = new Date().getFullYear();
}
