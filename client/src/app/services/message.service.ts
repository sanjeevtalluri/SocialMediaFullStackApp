import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { HubConnection, HubConnectionBuilder, HubConnectionState } from '@microsoft/signalr';
import { environment } from '../../environments/environment.development';
import { Message } from '../models/Message';
import { PaginatedResult } from '../models/pagination';
import { User } from '../models/user';
import { getPaginationHeaders, paginatedResponse } from './PaginationHelper';


@Injectable({
  providedIn: 'root'
})
export class MessageService {
  baseUrl = environment.apiUrl;
  hubUrl = environment.hubsUrl;
  private http = inject(HttpClient);
  hubConnection?: HubConnection;
  messageThread = signal<Message[]>([]);
  paginatedResult = signal<PaginatedResult<Message[]>|null>(null);

  constructor() { }

  createHubConnection(user: User, otherUsername: string) {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(this.hubUrl + 'message?user=' + otherUsername, {
        accessTokenFactory: () => user.token
      })
      .withAutomaticReconnect()
      .build()

    this.hubConnection.start().catch(error => console.log(error));

    this.hubConnection.on('ReceiveMessageThread', messages => {
      this.messageThread.set(messages);
    })

    this.hubConnection.on('NewMessage', message => {
      this.messageThread.update(messages=>[...messages,message]);
    })

    // this.hubConnection.on('UpdatedGroup', (group: Group) => {
    //   if (group.connections.some(x => x.username === otherUsername)) {
    //     this.messageThread$.pipe(take(1)).subscribe(messages => {
    //       messages.forEach(message => {
    //         if (!message.dateRead) {
    //           message.dateRead = new Date(Date.now())
    //         }
    //       })
    //       this.messageThreadSource.next([...messages]);
    //     })
    //   }
    // })
  }

  stopHubConnection() {
    if (this.hubConnection?.state === HubConnectionState.Connected)
    this.hubConnection.stop().catch((error) => console.log(error));
  }

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

  async sendMessage(username: string, content: string) {
    return this.hubConnection?.invoke('SendMessage', {recipientUsername: username, content})
    .catch(error => console.log(error));
  }

  deleteMessage(id: number) {
    return this.http.delete(this.baseUrl + 'messages/' + id);
  }
}
