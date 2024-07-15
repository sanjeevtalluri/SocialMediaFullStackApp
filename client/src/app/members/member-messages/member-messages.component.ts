import { NgFor, NgIf } from '@angular/common';
import { Component, inject, input, OnInit, output, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
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
  @ViewChild('messageForm') messageForm?: NgForm;
  username = input.required<string>();
  messages = input.required<Message[]>();
  messageContent:string = "";
  updateMessages = output<Message>();
  private messageService = inject(MessageService);

  

  sendMessage(){
    this.messageService.sendMessage(this.username(),this.messageContent).subscribe({
      next:(message)=>{
        this.updateMessages.emit(message);
        this.messageForm?.reset();
      }
    })
  }
}
