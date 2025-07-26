import {AfterViewInit, ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Posts as PostsServ } from '../../../Services/Posts/posts';
import { CommonModule } from '@angular/common';
import { MatDivider } from "@angular/material/divider";
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-posts',
  imports: [MatProgressBarModule,CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class Posts implements OnInit,AfterViewInit {
 posts:any ;
 hidecomments:boolean
isLoading: boolean;
  finishedposts!: boolean;

  
  constructor(
    private _posts:PostsServ
  ){
   


this.finishedposts = false
    this.hidecomments = true

    this.isLoading = true
  }
  ngAfterViewInit(): any {
  return this.isLoading
  }

  ngOnInit(): void {
//     this._posts.posts.subscribe({
//       next:(posts)=>{
// this.posts = posts.data
//     this.isLoading = false

//       }
//     })



}



  
}