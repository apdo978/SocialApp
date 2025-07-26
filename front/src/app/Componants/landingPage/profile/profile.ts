import { AfterViewInit, Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { Auth } from '../../../Services/Auth/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { MatCardModule } from '@angular/material/card';
import { RouterModule  } from '@angular/router';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@Component({
  selector: 'app-profile',
  imports: [CommonModule,MatCardModule,RouterModule,MatProgressBarModule,MatProgressSpinnerModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit, AfterViewInit {
@ViewChild('Personal') personalElement!: ElementRef;

isLoading: boolean = true;
  user:any = {};
 private localToken: string | null;

  constructor(private _auth:Auth,
     private  _router:Router,
    private cdr: ChangeDetectorRef
  ) {
    this.localToken = localStorage.getItem('Token') || null;

    
  }
  ngAfterViewInit(): void {
  // if(this._auth.UserData ! == null ){
  //   this.personalElement.nativeElement.click();
  //   this.isLoading = false; // Set loading to false after the view is initialized
  // }
  // else {
  //    const tryClick = setInterval(() => {
  //   if (this._auth.UserData ) {
  //     clearInterval(tryClick);
  //     this.personalElement.nativeElement.click();
  //   this.isLoading = false; // Set loading to false after the view is initialized

  //   }
  // }, 500);

  // }
           
   

          

  }

  ngOnInit(): void {
    if(!this._auth.UserData.value){   
    if (this.localToken){
        this._auth.getUSerData().subscribe({
          next:(userData:any) => {
        this.user = userData.data;
          this.user.SentFriendsRequestsUsersData = userData.SentFriendsRequestsUsersData;

            this._auth.SetUserData(this.localToken, userData.data);
    this.isLoading = false; // Set loading to false after the view is initialized
            this.cdr.detectChanges();
          },
          error: (err) => {
            // this._auth.clearUserdata();
            const errorMessage = err.error?.message ||  'An error occurred';
            Swal.fire({
              title: 'Error',
              text: errorMessage,
              icon: 'error',
              confirmButtonText: 'OK'
            });
            this._router.navigate(['/auth/login']);
          }
        })  
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

     
})
      }
    }
    else if(this._auth.UserData.value){ 
            this._auth.SetUserData(this.localToken, this._auth.UserData.value);
    this.isLoading = false; // Set loading to false after the view is initialized
            this.cdr.detectChanges();


        this._router.navigate(['profile/personal'], {
    state: { userPersonalData: this.user }
  });

    }}


    goToPersonal() {


  this._router.navigate(['profile/personal'], {
    state: { userPersonalData: this.user }
  });
}

    goToFriends() {

      
  this._router.navigate(['profile/friends'], {
    state: { userPersonalData: this.user }
  });
}

    goToPosts() {

      
  this._router.navigate(['profile/posts'], {
    state: { userPersonalData: this.user }
  });
}
  }
