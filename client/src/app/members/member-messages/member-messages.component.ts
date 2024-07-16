import { NgFor, NgIf } from '@angular/common';
import { AfterViewChecked, Component, inject, input, OnInit, output, ViewChild } from '@angular/core';
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
export class MemberMessagesComponent implements OnInit,AfterViewChecked {
  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }
  ngOnInit(): void {

  }
  @ViewChild('messageForm') messageForm?: NgForm;
  @ViewChild('scrollme') scrollContainer?: any;
  username = input.required<string>();
  messageContent:string = "";
  messageService = inject(MessageService);

  

  sendMessage(){
    this.messageService.sendMessage(this.username(),this.messageContent).then(()=>{
      this.messageForm?.reset();
      this.scrollToBottom();
    })
  }

  private scrollToBottom(){
    if(this.scrollContainer){
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    }
  }
}
