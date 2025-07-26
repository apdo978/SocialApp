import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Status {
 $userStatus:BehaviorSubject<any> = new BehaviorSubject<any>(null);
  constructor(){}

  
}
