import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Auth } from '../../../../../Services/Auth/auth';
import { Posts } from '../../../../../Services/Posts/posts';
import {MatButtonModule} from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-posts-profile',
  imports: [CommonModule,MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './posts-profile.html',
  styleUrl: './posts-profile.css'
})
export class PostsProfile implements OnInit,AfterViewInit {

  userPersonalData: any;
  UserPosts: any;
  isLoading: boolean = true;
  hideShowButton: boolean;
  hideComment: boolean;
  hideLikes: boolean;
      constructor(private _auth:Auth,
      private _posts:Posts,
      private _router:Router
      , private snackbar:MatSnackBar,
      private cdr: ChangeDetectorRef
      ) {
        this.hideShowButton = false
        this.hideComment = false
        this.hideLikes = false

      }

  ngAfterViewInit(): void {

  }
      ngOnInit(): void {
        // Initialization logic if needed
        this._auth.UserData.subscribe({
          next: (userData) => {
            this.userPersonalData = userData
              this.cdr.detectChanges()
            // console.log(userData,"idddddddddddddddddd");
            
            this._posts.getMyPosts(this.userPersonalData._id).subscribe({
          next: (postsList: any) => {

            this.UserPosts = postsList.data;
            console.log(this.UserPosts);

            this.isLoading = false;
               this.cdr.detectChanges()
            
          },
          error: (err: any) => {
  
            this.UserPosts = [];
  this.snackbar.open('Error fetching posts', 'Close', {
              duration: 3000,

          })
            this.isLoading = false;

               this.cdr.detectChanges()

          }
        });
            
            
            // You can perform additional actions with userData here
          },
          error: (err) => {
            console.error('Error fetching user data:', err);
          }
        });

          
    

      }
  
  NavigateToPostUser(postAuthor:any): void {  
//     console.log(this.UserPosts);
    
//     if(
//       postAuthor._id === this.user._id
//     ){
//       this._router.navigate(['profile/personal']);
//       return;
//     }
    
// this._router.navigate([`profile/user`], {
//   state: { author: postAuthor
//    } ,
// });
}

}
