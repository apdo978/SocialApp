import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Dev } from '../../../environments/environment.development';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Posts { 
   posts:BehaviorSubject<any> 
  constructor(private http: HttpClient) {
    this.posts = new BehaviorSubject(null)
  }

  getPosts() {
    this.http.get(`${Dev.apiUrl}/posts`).subscribe(posts => {
      this.posts.next(posts);
    });
    return this.posts.asObservable();
  }
  getMyPosts(id: string) {
    return this.http.get(`${Dev.apiUrl}/posts/${id}`);
    
  }

  createPost(postData: any) {
    return this.http.post(`${Dev.apiUrl}/posts`, postData);
  }

  updatePost(postId: string, postData: any) {
    return this.http.put(`${Dev.apiUrl}/posts/${postId}`, postData);
  }

  deletePost(postId: string) {
    return this.http.delete(`${Dev.apiUrl}/posts/${postId}`);
  }
}
