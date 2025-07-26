import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import { HideNavBar } from '../../../Services/HideNav/hide-nav-bar';
import { Auth } from '../../../Services/Auth/auth';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatButtonModule} from '@angular/material/button';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule,MatProgressBarModule,MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
   changeDetection: ChangeDetectionStrategy.OnPush
})
export class Login implements OnInit,OnDestroy,AfterViewInit  {
    @ViewChild('SignUpbutt') loginBtn!: ElementRef;
  SignInForm: FormGroup
  SignUpForm: FormGroup
  signErrArray: string[] = [];
isLoading: boolean;
 private _snackBar = inject(MatSnackBar);
 private localToken: string | null;
  
  constructor(private _fB: FormBuilder,private _hidenavbar: HideNavBar,
    private _auth:Auth,
    private _router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.localToken = localStorage.getItem('Token') || null;
    this.isLoading = false; // Initialize loading state
    this.SignUpForm = _fB.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      firstName: ['',[ Validators.required]],
      lastName: ['',[ Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]],
    })

    this.SignInForm = _fB.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }
  ngAfterViewInit(): void {
 this.route.queryParams.subscribe(params => {
      if (params['signUp'] && this.loginBtn) {
        this.loginBtn.nativeElement.click();
      }
    });
  }
  ngOnDestroy(): void {
    this._hidenavbar.HideNav.next(false);
 
  }
  ngOnInit(): void {
    this._hidenavbar.HideNav.next(true);
    
    if (this.localToken){
      this._auth.getUSerData(this.localToken).subscribe({
        next:(userData:any) => {
          console.log(userData,userData.data);
          this._auth.SetUserData(this.localToken, userData.data);
      this.openSnackBar(`Welcom Again ${userData.data.username}` , 'Close');
      this._router.navigate(['/landing']);
          
        },
        error: (err) => {
          // this._auth.clearUserdata();
          const errorMessage = err.error?.message ||  'An error occurred';
          
          this.openSnackBar('Some Thing Went Wrong ' + errorMessage, 'Close');
          this._router.navigate(['/auth/login']);
        }
      })  
    }
    
  }

  // Helper methods for form validation
  getErrorMessage(controlName: string): string {
    const control = this.SignUpForm.get(controlName);
    if (control?.hasError('required')) {
      return `Please add a ${controlName}`;
    }
    if (control?.hasError('minlength')) {
      return controlName === 'username' 
        ? 'Username must be at least 3 characters long'
        : 'Password must be at least 6 characters long';
    }
    if (control?.hasError('email') || control?.hasError('pattern')) {
      return 'Please add a valid email';
    }
    return '';
  }

  onSignInSubmit() {
    if (this.SignInForm.valid) {
    const  {username:email,password} = this.SignInForm.value;
      
      this.SignInForm.disable()
      this.isLoading = true; 
      this._auth.LogIN({email,password}).subscribe({
    next:(respons:any) =>{ 
      this._auth.getUSerData(respons.token).subscribe({
        next:(userData:any) => {

          console.log(userData,"userData");
          this._auth.SetUserData(respons.token, userData.data);
          this.isLoading = false; // Reset loading state
      this.openSnackBar(`Welcom ${userData.data.username}` , 'Close');
      this._router.navigate(['/landing']);
          
        }
      })        
 },
 error:(err)=>{
      this.isLoading = false; 
      this.signErrArray = err.error.errors || err.error ;
      console.log(this.signErrArray);
      
     if (Array.isArray(this.signErrArray)) {
      let msg:any;
      for( msg of this.signErrArray){

        this.openSnackBar(`Login failed. Please try again.  ${msg.message}`, 'Close');
      }}
        this.openSnackBar(`Login failed. Please try again.  ${err.error.error}`, 'Close');

      this.SignInForm.enable();
 }
    })
      
   

  }
}

  onSignUpFormSubmit() {
    if (this.SignUpForm.valid) {
      this.SignUpForm.disable()
      this.isLoading = true; 
      this._auth.signUp(this.SignUpForm.value).subscribe({
        next: (responseWithTok:any) => {
          this.openSnackBar(`Welcome  ${this.SignUpForm.value.username}`, 'Close');
          this._auth.getUSerData(responseWithTok.token).subscribe({
            next: (userData:any) => {
              this._auth.SetUserData(responseWithTok.token, userData.data);
              this._router.navigate(['/landing']);
      this.isLoading = false; 

            },
            error: (err) => {

              const errorMessage = err.error?.message || 'An error occurred';
              this.openSnackBar('Some Thing Went Wrong ' + errorMessage, 'Close');
              this._router.navigate(['/login']);

            }
          });
         
        },
        error: (err) => {
                     this.isLoading = false; // Reset loading state
              this.SignUpForm.enable();
              this.cdr.detectChanges();
          this.signErrArray = err.error.errors || err.error ||"Some Thing Went Wrong";
          
          if (Array.isArray(this.signErrArray)) {
            let msg:any;
            for( msg of this.signErrArray){
              this.openSnackBar(`Sign up failed. Please try again.  ${msg.message}`, 'Close');
            }
          } else {
            if (err.error.error == 'Duplicate field value entered') {
            this.openSnackBar(`Sign up failed. Please try again.  username or Email is used`, 'Close');}
            else{
            this.openSnackBar(`Sign up failed. Please try again.  ${err.error.error}`, 'Close');}
          }
          this.SignUpForm.enable();
        }
      });
    }
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
