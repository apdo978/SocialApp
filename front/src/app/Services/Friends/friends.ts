import { Injectable } from '@angular/core';
import { Dev } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Friends {
  $friendsList: BehaviorSubject<any> = new BehaviorSubject(null);
  $friendRequests: BehaviorSubject<any> = new BehaviorSubject(null);
  $friend: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(private _http: HttpClient) {}

  getFriendsList() {
    this._http.get(`${Dev.apiUrl}/friends`).subscribe((res) => {
      this.$friendsList.next(res);
    });
    return this.$friendsList.asObservable();
  }

  addFriend(friendId: string) {
    return this._http.post(`${Dev.apiUrl}/friends/request/${friendId}`,{});
  }

  removeFriend(friendId: string) {
    return this._http.delete(`${Dev.apiUrl}/friends/${friendId}`);
  }


acceptFriendRequest(requestId: string) {
  return this._http.put(`${Dev.apiUrl}/friends/accept/${requestId}`, {});
}
rejectFriendRequest(requestId: string) {
  return this._http.put(`${Dev.apiUrl}/friends/reject/${requestId}`, {}); 
}
getFriendRequests() {
    this._http.get(`${Dev.apiUrl}/friends/requests`).subscribe((res) => {
      this.$friendRequests.next(res);
    });
    return this.$friendRequests.asObservable();
  }
  getFriendById(friendId: string) {
     this._http.get(`${Dev.apiUrl}/auth/friend/${friendId}`).subscribe((res) => {
       this.$friend.next(res);
     });
     return this.$friend.asObservable();
  }

}