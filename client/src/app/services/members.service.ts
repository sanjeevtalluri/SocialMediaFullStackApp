import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, of, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  paginatedResult= signal<PaginatedResult<Member[]> | null>(null);
  constructor() { }
  getMembers(pageNumber?:number,pageSize?:number) {
    let params = {
      pageNumber:1,
      pageSize:10
    };
    if(pageNumber){
      params.pageNumber=pageNumber;
    }
    if(pageSize){
      params.pageSize = pageSize;
    }
    return this.http.get<Member[]>(this.baseUrl + 'users', {
      params: params,
      observe: 'response'
    }).subscribe({
      next: response =>{
        this.paginatedResult.set({
          items: response.body as Member[],
          pagination: JSON.parse(response.headers.get('Pagination')!)
        })
      }
    })
  }

  getMember(username: string) {
    // const member = this.members.find(x => x.username === username);
    // console.log(member);
    // if (member !== undefined) return of(member);
    return this.http.get<Member>(this.baseUrl + 'users/' + username);
  }

  updateMember(member:Member){
    return this.http.put<Member>(this.baseUrl+'users',member).pipe(
      tap(()=>{
        // const index = this.members.indexOf(member);
        // this.members[index] = member;
      })
    )
  }

  setMainPhoto(id: number) {
    return this.http.put<Member>(this.baseUrl+'users/set-main-photo/'+id,{});
  }

  deletePhoto(photoId: number) {
    return this.http.delete(this.baseUrl + 'users/delete-photo/' + photoId);
  }
}
