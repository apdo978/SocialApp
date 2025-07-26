import { Routes } from '@angular/router';
import { Login } from './Componants/landingPage/login/login';
import { Landing } from './Componants/landingPage/landing/landing';
import { Posts } from './Componants/landingPage/posts/posts';
import { Profile } from './Componants/landingPage/profile/profile';
import { SettingsPage } from './Componants/landingPage/settings-page/settings-page';
import { PostCreationPage } from './Componants/landingPage/post-creation-page/post-creation-page';
import { Personal } from './Componants/landingPage/profile/childs-componants/personal/personal';
import { Friends } from './Componants/landingPage/profile/childs-componants/friends/friends';
import { PostsProfile } from './Componants/landingPage/profile/childs-componants/PostsProfile/posts-profile';
import { DynamicUser } from './Componants/dynamic-user/dynamic-user';

export const routes: Routes = [
  {
    path: 'auth',
    children: [
      {
        path: 'login',
        component: Login
      },
    ]
  },
  {
    path: 'home',
    redirectTo: 'landing',
    pathMatch: 'full'
  },
 {
    path: 'landing',
    component: Landing
  },
  {
    path: 'landing',
    component: Landing
  },
  {
    path: 'profile',
    component: Profile,children:[
      {path: '', redirectTo: 'personal', pathMatch: 'full' },
      {path: 'personal', component: Personal},
      { path: 'friends', component:Friends },
      {path: 'posts', component: PostsProfile}

    ]
  },
  {
    path: 'settings',
    component: SettingsPage
  },
  {
    path: 'create-post',
    component: PostCreationPage
  },
  {
    path: 'profile/:id',
    component: DynamicUser
  },
  {
    path: '',
    redirectTo: 'landing',
    pathMatch: 'full'
  }
];
