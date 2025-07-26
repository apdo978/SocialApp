import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Dev } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class Auth {

     UserToken:BehaviorSubject<any>  = new BehaviorSubject<any>(null);
     UserData:BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private _http:HttpClient, ) {
    
   
  }
  signUp(SignUpFormData:object){
   return this._http.post(`${Dev.apiUrl}/auth/register`, SignUpFormData)

}
  LogIN(SignInFormData:object){
    return this._http.post(`${Dev.apiUrl}/auth/login`, SignInFormData)
  
}
updateUserData(updateDetailsData:object, token:any){
  return this._http.put(`${Dev.apiUrl}/auth/updatedetails`, updateDetailsData)
}
getUSerData(token?:any){
  if (token) {
      //  this._http.get(`${Dev.apiUrl}/auth/me`, {headers: { Authorization: `Bearer ${token}` }}).
      //  subscribe((userData:any) => {this.UserData.next(userData)});
      //  return this.UserData.asObservable();
      return this._http.get(`${Dev.apiUrl}/auth/me`, {headers: { Authorization: `Bearer ${token}` }});
  
  } else {
    
//     this._http.get(`${Dev.apiUrl}/auth/me`).subscribe((userData:any) => {this.UserData.next(userData)});
//     console.log(this.UserData.value);

// return this.UserData.asObservable();
return this._http.get(`${Dev.apiUrl}/auth/me`, )
    //    this.http.post(`${Dev.apiUrl}/posts/${postId}/comments`, commentData).subscribe(comment => {
    //   this._Comments.next(comment);
    // });
}
}
SetUserData(token:any, data:any){
  localStorage.setItem('Token',token);
  this.UserToken.next(token);
  this.UserData.next(data);
}
clearUserdata(){
  localStorage.removeItem('Token');
  this.UserToken.next(null);
  this.UserData.next(null);
}


}
