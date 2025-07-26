import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dev } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Comments { 
     private _Comments:BehaviorSubject <any> = new BehaviorSubject(null);
     private _Likes:BehaviorSubject <any> = new BehaviorSubject(null);

  constructor(private http: HttpClient,
 
  ) {
  }

  addComment(postId: string, commentData: any) {

this.http.post(`${Dev.apiUrl}/posts/${postId}/comments`, commentData).subscribe(comment => {
      this._Comments.next(comment);
    });
    return this._Comments.asObservable();

  }
  addliketopost(postId: string, userId: string) {
     this.http.put(`${Dev.apiUrl}/posts/${postId}/like`, { userId }).subscribe(like => {
       this._Likes.next(like);
     });
     return this._Likes.asObservable();

  }



}
