import { Component, OnInit } from '@angular/core';
import { HideNavBar } from '../../../Services/HideNav/hide-nav-bar';
import { CommonModule } from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import { RouterModule  } from '@angular/router';
import { Auth } from '../../../Services/Auth/auth';
import { Router } from '@angular/router';
import { SocketService } from '../../../Services/Sockets/socket';


@Component({
  selector: 'app-nav-bar',
  imports: [RouterModule ,MatIconModule, CommonModule],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.css'
})
export class NavBar implements OnInit {
  HideNavBar: boolean 
  constructor(private _hidenavbar: HideNavBar,
   private _Auth:Auth,
   private router: Router,
   private _socket:SocketService
     
  ) { 
  this.HideNavBar = false; // Initialize the property
    
  }
  // Add any properties or methods needed for the navigation bar
  ngOnInit() {
    // Initialization logic if needed
    this._hidenavbar.HideNav.subscribe({
      next: (hide: boolean) => {
        this.HideNavBar = hide;
        console.log(`HideNavBar is now: ${this.HideNavBar}`);
        
      }
    });

  }
  signOut(){
this._Auth.clearUserdata()
  this._Auth.UserToken.next(false);
  this._Auth.UserData.next(null);
  this._hidenavbar.HideNav.next(true);
  this._hidenavbar.socketStablished.next(false);
  localStorage.removeItem('Token');
  localStorage.removeItem('UserData');
this.router.navigate(['/auth/login']);
  this._socket.disconnect();

  }

}
