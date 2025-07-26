import { AfterViewInit, Component, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { Posts } from '../posts/posts';
import { PostCreationPage } from '../post-creation-page/post-creation-page';
import { Chats } from '../chats/chats';
import { Auth } from '../../../Services/Auth/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Posts as PostsServ } from '../../../Services/Posts/posts';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { MatDivider } from "@angular/material/divider";
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { ChangeDetectorRef } from '@angular/core';
import { Form, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comments } from '../../../Services/comments/comments';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { TimeAgoPipe } from '../../../pipes/time-ago-pipe';
import { App } from '../../../app';
import { HideNavBar } from '../../../Services/HideNav/hide-nav-bar';
import { SocketService } from '../../../Services/Sockets/socket';






@Component({
  selector: 'app-landing',
  imports: [  TimeAgoPipe,MatMenuModule,MatIconModule,MatInputModule,ReactiveFormsModule,CommonModule,MatFormFieldModule,MatProgressBarModule, CommonModule, MatButtonModule, MatCardModule, MatDivider, PostCreationPage, Chats],
  templateUrl: './landing.html',
  styleUrl: './landing.css'
})
export class Landing implements OnInit {
  isChatOpen: boolean = false;
@ViewChild('menuTrigger') menuTrigger!: MatMenuTrigger;
 private localToken: string | null;
 posts:any
 socketStablished: boolean = false
hidecomments: any;
isLoading: boolean;
commentForm: FormGroup;
LikedPosts:any
user:any;
isLiking = false;
  private _router = inject(Router)
  closeTimeout: number | undefined;


  constructor(private _auth:Auth,
    private socketService: SocketService,
    private PostsTopostComp:PostsServ
    , private cdr: ChangeDetectorRef,
    private _comments: Comments,
    private snackbar: MatSnackBar,
    private _appcomp: App,
    private _hidenavbar: HideNavBar
  ) {
    this.localToken = localStorage.getItem('Token') || null;
    this.isLoading = true
    this.commentForm = new FormGroup({
      content: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(500)]),
    });
  }

  ngOnInit(): void {
    this._hidenavbar.HideNav.next(false);
    this._hidenavbar.socketStablished.subscribe({
      next:(data:boolean)=>{
        this.socketStablished = data;
        // console.log("from landing socketStablished",this.socketStablished);
        
      }
    });
    this.cdr.detectChanges();
    
      if (this.localToken){
      this._auth.getUSerData(this.localToken).subscribe({
        next:(userData:any) => {
          this.user = userData.data;
          this.user.SentFriendsRequestsUsersData = userData.SentFriendsRequestsUsersData;
          this._auth.SetUserData(this.localToken, this.user);
          this.cdr.detectChanges();},
        error:(err)=>{
        Swal.fire({
    title: 'Error',
    text: "Somthing Wnt wrong ",
    icon: 'warning',
    confirmButtonText: 'Login ',
    showCancelButton: true,
    cancelButtonText: 'Register'
  })
        }

})

          this.PostsTopostComp.getPosts().subscribe({
            next:(Posts:any)=>{
              if(Posts){
              // this.PostsTopostComp.posts.next(Posts)
              this.posts = Posts?.data;
              for (let post of this.posts) {
                post.comment = false;
                post.like = false;
    
              }

    this.isLoading = false
    
    console.log('posts', this.posts[0]);

            }
          }
      // this._router.navigate(['/landing']);
         
          
        ,
        error: (err) => {
          // this._auth.clearUserdata();
          const errorMessage = err.error?.message ||  'An error occurred';
    

          this._router.navigate(['/auth/login']);
        }
      })
      
      setTimeout(() => {
    
        
            if(!this.socketStablished ){
      this._appcomp.ngOnInit()
      this.socketStablished = true;
    }
        
      }, 2000);
  
 
    }
    

    else {
        Swal.fire({
    title: 'Error',
    text: "You need to login first",
    icon: 'warning',
    confirmButtonText: 'Login ',
    showCancelButton: true,
    cancelButtonText: 'Register'
  }).then((result) => {
      if (result.isConfirmed) {
        this._router.navigate(['/auth/login']);
  
        
      } else if (result.isDismissed) {
      this._router.navigate(['/auth/login'],{ queryParams: { signUp: true } });

      }
  });

      this._router.navigate(['/auth/login']);
    }
  
  }
  onCommentSubmit(post:any){
    if (this.commentForm.valid) {
            this._comments.addComment(post._id, this.commentForm.value).subscribe({
        next: (response: any) => {
          this.snackbar.open('Comment added successfully!', 'Close', {
            duration: 3000,
          });
     
       post.comment = false; // Hide the comment section after submission
       this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error adding comment:', error);
        }
      });
           console.log(this.commentForm.value);
                post.comments.push({user:post.author,content:this.commentForm.value.content,createdAt:new Date()})
       this.commentForm.reset(); // Reset the comment form
     // Trigger change detection to update the view
    } else {
      console.warn('Comment form is invalid');
    }

  }

onLikePost(postt: any) {
  console.log(postt.userLiked);
  
  this._comments.addliketopost(postt._id, this.user._id).subscribe({
    next: () => {
      this.snackbar.open('Post liked successfully!', 'Close', {
        duration: 3000,
      });
      postt.comment = false;
    },
    error: (error: any) => {
      console.error('Error liking post:', error);
    }
  });
  if(postt.userLiked){
    postt.userLiked = false
    console.log(postt.author);

  postt.likes =  postt.likes.filter((userUnLike:any)=>userUnLike.email !=this.user.email)

console.log(postt)
  console.log(postt.likes);
  } else {
    postt.userLiked = true
    postt.likes.push(this.user)

    console.log(postt)
    console.log(postt.likes);
  }

  

      this.cdr.detectChanges()
}
  NavigateToPostUser(postAuthor:any): void {  
    if(
      postAuthor._id === this.user._id
    ){
      this._router.navigate(['profile/personal']);
      return;
    }
    
this._router.navigate([`profile/user`], {
  state: { author: postAuthor,
    posts: this.posts,
    users:this.user
   } ,
});
}

mouseLeave() {
  this.closeTimeout = setTimeout(() => {
    this.menuTrigger.closeMenu();
    this.menuTrigger._handleMousedown
    clearTimeout(this.closeTimeout)
  },1000);
   

}

cancelClose() {
  clearTimeout(this.closeTimeout);
}
 toggleChat() {
    this.isChatOpen = !this.isChatOpen;
  }

  getLikes(){
              this.posts.forEach((post:any) => {
                post.likes.forEach((Like:any) => {
                  if (Like._id === this.user?._id) {
                    post.userLiked = true;
                  }
                  
                });



                
              });    
  
                
  }
}
