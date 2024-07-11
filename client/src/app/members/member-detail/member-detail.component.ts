import { DatePipe, NgIf } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule, TimeagoPipe } from 'ngx-timeago';
import { Photo } from '../../models/photo';



@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [NgIf, TabsModule,TimeagoModule, DatePipe],
  templateUrl: './member-detail.component.html',
  styleUrl: './member-detail.component.css',
})
export class MemberDetailComponent implements OnInit {
  ngOnInit(): void {
    this.loadMember();
  }
  private memberService = inject(MembersService);
  private route = inject(ActivatedRoute);
  member?: Member;
  images: string[] = [];
  currentIndex = 0;

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }
  loadMember() {
    const username = this.route.snapshot.paramMap.get('username');
    if (!username) {
      return;
    }
    this.memberService.getMember(username).subscribe({
      next: (member) => {
        this.member = member;
        this.images = member.photos.map((photo:Photo)=>{
          return photo.url;
        })
      },
    });
  }

  loadGalleryDetails() {
  }
}
