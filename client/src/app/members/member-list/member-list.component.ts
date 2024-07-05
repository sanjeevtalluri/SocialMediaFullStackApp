import { NgFor } from '@angular/common';
import { Component, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";

@Component({
    selector: 'app-member-list',
    standalone: true,
    templateUrl: './member-list.component.html',
    styleUrl: './member-list.component.css',
    imports: [NgFor, MemberCardComponent],
    schemas:[NO_ERRORS_SCHEMA]
})
export class MemberListComponent implements OnInit{
  private memberService = inject(MembersService);
  members:Member[] = [];
  ngOnInit(): void {
    this.getMembers();
  }

  getMembers(){
    this.memberService.getMembers().subscribe({
      next: members=>{
        this.members = members;
      }
    })
  }

}
