import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Message } from '../models/Message';
import { PaginatedResult } from '../models/pagination';
import { getPaginationHeaders, paginatedResponse } from './PaginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  paginatedResult = signal<PaginatedResult<Message[]>|null>(null);

  constructor() { }

  getMessages(pageNo:number,pageSize:number,container:string){
    let params = getPaginationHeaders(pageNo,pageSize);
    params.container = container;
    return this.http.get<Message[]>(this.baseUrl+'messages',{observe:'response',params}).subscribe({
      next:(response)=>{
        paginatedResponse(response,this.paginatedResult);
      }
    })
  }

  getMessageThread(username: string) {
    return this.http.get<Message[]>(this.baseUrl + 'messages/thread/' + username);
  }

  sendMessage(username: string, content: string) {
    return this.http.post<Message>(this.baseUrl + 'messages', {recipientUsername: username, content})
  }
}
