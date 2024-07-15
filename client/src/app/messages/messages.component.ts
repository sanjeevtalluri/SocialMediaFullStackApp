import { NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from '../models/Message';
import { MessageService } from '../services/message.service';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [NgFor,ButtonsModule,FormsModule,NgIf,TimeagoModule,TitleCasePipe,RouterLink,PaginationModule],
  templateUrl: './messages.component.html',
  styleUrl: './messages.component.css'
})
export class MessagesComponent implements OnInit {

  messageService = inject(MessageService);
  container = 'Inbox';
  pageNo = 1;
  pageSize = 5;

  ngOnInit(): void {
    this.loadMessages();
  }

  loadMessages(){
    this.messageService.getMessages(this.pageNo,this.pageSize,this.container);
  }
  pageChanged(event:any){
    if(this.pageNo != event.page){
      this.pageNo = event.page;
      this.loadMessages();
    }
  }

  deleteMessage(id:number){

  }

  getRoute(message:Message){
    if(this.container === "Outbox"){
      return `/members/${message.recipientUsername}`;
    }
    else{
      return `/members/${message.senderUsername}`;
    }
  }
}
