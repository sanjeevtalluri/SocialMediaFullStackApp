import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  currentUser = signal<User|null>(null);
  constructor() { }
  login(model:any){
    
    return this.http.post<User>(this.baseUrl+'account/login',model).pipe(
      map((user)=>{
        if(user){
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUser.set(user);
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
          localStorage.setItem('user',JSON.stringify(user));
          this.currentUser.set(user);
          return user;
        }
        return null;
      })
    )
  }
}
