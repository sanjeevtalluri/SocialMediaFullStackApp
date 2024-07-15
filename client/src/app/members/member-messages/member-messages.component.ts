import { NgFor, NgIf } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TimeagoModule } from 'ngx-timeago';
import { Message } from '../../models/Message';
import { MessageService } from '../../services/message.service';

@Component({
  selector: 'app-member-messages',
  standalone: true,
  imports: [NgFor,NgIf,TimeagoModule,FormsModule],
  templateUrl: './member-messages.component.html',
  styleUrl: './member-messages.component.css'
})
export class MemberMessagesComponent implements OnInit {
  ngOnInit(): void {

  }
  username = input.required<string>();
  messages = input.required<Message[]>();
  messageContent:string = "";
  private messageService = inject(MessageService);

  

  sendMessage(){

  }
}
