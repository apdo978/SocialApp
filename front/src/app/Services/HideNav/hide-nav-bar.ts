import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class HideNavBar {
    HideNav = new BehaviorSubject<boolean>(false);
  socketStablished =  new BehaviorSubject<boolean>(false);
 


  constructor() {

  }


  
}
