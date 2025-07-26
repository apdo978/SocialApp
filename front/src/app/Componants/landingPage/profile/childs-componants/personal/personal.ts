import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { Auth } from '../../../../../Services/Auth/auth';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

import {MatSnackBar} from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


@Component({
  selector: 'app-personal',
  imports: [ MatProgressSpinnerModule,MatButtonModule,CommonModule,ReactiveFormsModule,MatFormFieldModule,MatInputModule,CommonModule],
  templateUrl: './personal.html',
  styleUrl: './personal.css'
})
export class Personal implements OnInit {
@ViewChild('FormFirstName') FormFirstName!: ElementRef;
@ViewChild('FormLastName') FormLastName!: ElementRef;
@ViewChild('FormEmail') FormEmail!: ElementRef;
@ViewChild('FormUserName') FormUserName!: ElementRef;
EditUserData: FormGroup
  userPersonalData: any;
  hidePersonalData: boolean;
 private _snackBar = inject(MatSnackBar);

  constructor(private _auth:Auth,
   private _fB :FormBuilder ,
    private cdr: ChangeDetectorRef
  ) {
    
    this.hidePersonalData = false;
      this.EditUserData = this._fB.group({
        email: ['',],
        username: [''],
        firstname: [''],
        lastname: [''],
        password: ['',[Validators.required, Validators.minLength(6)]],
        newPassword: ['',[ Validators.minLength(6)]]

      }
    )
  }

  ngOnInit(): void {
  
    // Initialization logic if needed
    this._auth.getUSerData().subscribe({
      next: (userData:any) => {
        this.userPersonalData = userData.data
        this.cdr.detectChanges();
        // You can perform additional actions with userData here
      },
      error: (err) => {
        console.error('Error fetching user data:', err);
      }
    });
  }
  ShowPersonalDataEdit(){
    this.EditUserData.setValue({
      email: this.userPersonalData.email,
      username: this.userPersonalData.username,
      firstname: this.userPersonalData.firstName,
      lastname: this.userPersonalData.lastName,
      password: '',
      newPassword: ''
    });
    this.hidePersonalData = true;
    this.EditUserData.patchValue({
      email: this.userPersonalData.email,
      username: this.userPersonalData.username,
      firstname: this.userPersonalData.firstName,
      lastname: this.userPersonalData.lastName,
      password: '',
      newPassword: this.userPersonalData.password
    });
  }

  onEditUpFormSubmit() {
    
     
    this._auth.updateUserData(this.EditUserData.value, this._auth.UserToken.value).subscribe({
      next: (response:any) => {
  
    this.userPersonalData.firstName = this.EditUserData.value.firstname;
    this.userPersonalData.lastName = this.EditUserData.value.lastname;
    this.userPersonalData.email = this.EditUserData.value.email;
    this.userPersonalData.username = this.EditUserData.value.username;
    this.cdr.detectChanges();
      this.openSnackBar(response.data , 'Close');
       
      },
      error: (error) => {
        if ( error.error.error) {
          this.openSnackBar(`UserName Or Email is Already Used`, 'Close');
        }else{

          this.openSnackBar(error.error.error, 'Close');        
        }


        // Handle error appropriately, e.g., show a notification
      }
    
    });



      this.hidePersonalData = false;
      console.log(this.FormFirstName);
       this.FormFirstName


  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

}
