import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { LikesService } from './likes.service';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentUser = signal<User|null>(null);
  roles = computed(()=>{
    const user = this.currentUser();
    if(user && user.token){
      const role = JSON.parse(atob(user.token.split('.')[1])).role;
      return Array.isArray(role)?role:[role];
    }
    return [];
  })
  private likesService = inject(LikesService); 
  constructor() { }
  login(model:any){
    
    return this.http.post<User>(this.baseUrl+'account/login',model).pipe(
      map((user)=>{
        if(user){
          this.setCurrentUser(user);
          return user;
        }
        return null;
      })
    )
  }

  logout(){
    localStorage.removeItem('user');
    this.currentUser.set(null);
  }
  register(model:any){
    console.log(this.baseUrl);
    return this.http.post<User>(this.baseUrl+'account/register',model).pipe(
      map((user)=>{
        if(user){
          this.setCurrentUser(user);
          return user;
        }
        return null;
      })
    )
  }

  setCurrentUser(user:User){
    localStorage.setItem('user',JSON.stringify(user));
    this.currentUser.set(user);
    this.likesService.getLikeIds();
  }
}
