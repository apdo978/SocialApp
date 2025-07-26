import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Auth } from '../../../../../Services/Auth/auth';
import { Friends as FriendsServ } from '../../../../../Services/Friends/friends';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { MatCardHeader } from "@angular/material/card";
import { MatCard, MatCardTitle, MatCardSubtitle, MatCardContent } from '@angular/material/card';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatListModule } from '@angular/material/list';
import { MatMenu } from "@angular/material/menu";
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {TimeAgoPipe} from '../../../../../pipes/time-ago-pipe';

@Component({
  selector: 'app-friends',
  imports: [TimeAgoPipe,MatProgressSpinnerModule,MatButtonModule,MatListModule, CommonModule, MatCardHeader, MatCard, MatCardTitle, MatCardSubtitle, MatCardContent, MatIconModule, MatIconModule],
  templateUrl: './friends.html',
  styleUrl: './friends.css'
})
export class Friends implements OnInit {
@ViewChild('card') card!: ElementRef;
   userPersonalData: any;
   userFriends: any;
  friendsRequests: any;
  SentFriendsRequestsUsersData: any;
  friendReqShow: any[] = [];
    constructor(private _auth:Auth,
      private _friends:FriendsServ,
      private cdr: ChangeDetectorRef,

    ) {
  
    }
    ngOnInit(): void {
      // Initialization logic if needed
      this._auth.UserData.subscribe({
        next: (userData) => {
          this.userPersonalData = userData      
          this.cdr.detectChanges();
          // You can perform additional actions with userData here
        },
        error: (err) => {
          console.error('Error fetching user data:', err);
        }
      });
      this._friends.getFriendsList().subscribe({
        next: (friendsList: any) => {
          console.log('Friends list received:', friendsList);
          this.userFriends = friendsList?.data;
        },
        error: (err: any) => {
          console.error('Error fetching friends list:', err);
        }
      });
      this._friends.getFriendRequests().subscribe({
        next: (friendRequests: any) => {
          this.friendsRequests = friendRequests?.data;
          console.log('Friend requests received:', this.friendsRequests);
          this.cdr.detectChanges();
        },
        error: (err: any) => {
          console.error('Error fetching friend requests:', err);
        }
      });
    }
    showFriendsRequests() {

      //    if(this.userPersonalData?.following?.length >0){
      //     for (const request of this.userPersonalData?.following) {
      //   this._friends.getFriendById(request?.recipient).subscribe({
      //     next: (friendData: any) => {
      //       this.friendReqShow?.push(friendData?.data);
      //   this.cdr.detectChanges();

      //     },
      //     error: (err: any) => {
      //       console.error('Error fetching friend data:', err);
      //     },
      //   });

      // }
      //   this.uniqueUsers(this.friendReqShow);

      // console.log(this.friendReqShow);

   
      // }
    }
    rejectFriendRequest(RequestId: string) {
      this._friends.rejectFriendRequest(RequestId).subscribe({
        next: (response: any) => {
          Swal.fire({
            title: 'Success',
            text: 'Friend request rejected successfully',
            icon: 'success',
            confirmButtonText: 'OK'
          });
      
          // this.friendsRequests = this.friendsRequests.filter((request: any) => request._id !== RequestId);
          // this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error rejecting friend request:', error);
        }
      });
    }


acceptFriendRequest(RequestId: string) {
  this._friends.acceptFriendRequest(RequestId).subscribe({
    next: (response: any) => {
      // this.friendsRequests = this.friendsRequests.filter((request: any) => request._id !== RequestId);
      // this.cdr.detectChanges();
      Swal.fire({
        title: 'Success',
        text: 'Friend request accepted successfully',
        icon: 'success',
        confirmButtonText: 'OK'
      });
    },
    error: (error: any) => {
      console.error('Error accepting friend request:', error);
    }
  });
}
RemoveFriend(id:string){
this._friends.removeFriend(id).subscribe({
  next: (response: any) => {
        this.userFriends = this.userFriends.filter((friend: any) => friend._id !== id);
    this.cdr.detectChanges();
    Swal.fire({
      title: 'Success',
      text: 'Friend removed successfully',
      icon: 'success',
      confirmButtonText: 'OK'
    })

  },
  error: (error: any) => {

    Swal.fire({
      title: 'Error',
      text: 'Failed to remove friend',
      icon: 'error',
      confirmButtonText: 'OK'
    });
  }
});

}
  //  uniqueUsers(users: any[]) {
  //   this.friendReqShow = users.filter((user, index, self) =>
  //     index === self.findIndex(u => u.email === user.email)
  //   );
    
  // }

}
