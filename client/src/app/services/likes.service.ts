import { HttpClient } from '@angular/common/http';
import { Injectable,inject, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Member } from '../models/member';
import { PaginatedResult } from '../models/pagination';
import { getPaginationHeaders, paginatedResponse } from './PaginationHelper';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  baseUrl = environment.apiUrl;
  private http= inject(HttpClient);
  likeIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  constructor() { }

  toggleLike(targetId:number){
    return this.http.post(this.baseUrl+"likes/"+targetId,{});
  }

  getLikes(predicate:string, pageNumber:number,pageSize:number){
    let params = getPaginationHeaders(pageNumber,pageSize);
    params.predicate = predicate;
    return this.http.get<Member[]>(`${this.baseUrl}likes`,{observe:'response',params}).subscribe({
      next:response=>{
        paginatedResponse(response,this.paginatedResult);
      }
    })
  }

  getLikeIds(){
    return this.http.get<number[]>(`${this.baseUrl}likes/list`).subscribe({
      next:(response)=>{
        this.likeIds.set(response);
      }
    })
  }
}
