import { DatePipe, NgIf } from '@angular/common';
import { AfterViewInit, Component, inject, Input, OnDestroy, OnInit, ViewChild, viewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { TabDirective, TabsetComponent, TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule, TimeagoPipe } from 'ngx-timeago';
import { Photo } from '../../models/photo';
import { MemberMessagesComponent } from "../member-messages/member-messages.component";
import { Message } from '../../models/Message';
import { MessageService } from '../../services/message.service';
import { PresenceService } from '../../services/presence.service';
import { AccountService } from '../../services/account.service';
import { HubConnection, HubConnectionState } from '@microsoft/signalr';



@Component({
    selector: 'app-member-detail',
    standalone: true,
    templateUrl: './member-detail.component.html',
    styleUrl: './member-detail.component.css',
    imports: [NgIf, TabsModule, TimeagoModule, DatePipe, MemberMessagesComponent]
})
export class MemberDetailComponent implements OnInit, OnDestroy {

  @ViewChild('memberTabs',{static:true}) memberTabs?: TabsetComponent;
  private messageService = inject(MessageService);
  private accountService = inject(AccountService);
  activeTab?:TabDirective;
  presenceService = inject(PresenceService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  member: Member = {} as Member;
  images: string[] = [];
  currentIndex = 0;

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.member = data['member'];
      if(this.member)
      this.images = this.member.photos.map((photo:Photo)=>{
        return photo.url;
      })
    })

    this.route.queryParams.subscribe({
      next:params=>{
        params['tab'] && this.selectedTab(params['tab']);
      }
    })
    this.route.paramMap.subscribe({
      next:()=>{
        this.onRouteParamsChange();
      }
    })
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
  ngOnDestroy(): void {
    this.messageService.stopHubConnection();
  }

  loadGalleryDetails() {
  }

  onTabActivated(data: TabDirective) {
    this.activeTab = data;
    this.router.navigate([],{
      relativeTo:this.route,
      queryParams:{tab:this.activeTab.heading},
      queryParamsHandling:'merge'
    })
    if (this.activeTab.heading === 'Messages' && this.member) {
      const user = this.accountService.currentUser();
      if(!user) return;
      this.messageService.createHubConnection(user,this.member.username);
    }
    else{
      this.messageService.stopHubConnection();
    }
  }

  onRouteParamsChange(){
    const user = this.accountService.currentUser();
    if(!user) return;
    if(this.messageService.hubConnection?.state == HubConnectionState.Connected && this.activeTab?.heading=="Messages"){
      this.messageService.hubConnection.stop().then(()=>{
        this.messageService.createHubConnection(user,this.member.username);
      })
    }
  }
  selectedTab(heading:string){
    if(this.memberTabs){
      const messageTab = this.memberTabs.tabs.find(x=>x.heading == heading);
      if(messageTab) messageTab.active = true;
    }
  }

}
