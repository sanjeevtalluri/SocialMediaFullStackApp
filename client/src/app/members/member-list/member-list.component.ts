import { NgFor, NgIf } from '@angular/common';
import { Component, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Pagination } from '../../models/pagination';

@Component({
    selector: 'app-member-list',
    standalone: true,
    templateUrl: './member-list.component.html',
    styleUrl: './member-list.component.css',
    imports: [NgFor, MemberCardComponent,NgIf,PaginationModule],
    schemas:[]
})
export class MemberListComponent implements OnInit{
  memberService = inject(MembersService);
  pageNumber = 1;
  pageSize = 5;
  pagination?: Pagination;
  ngOnInit(): void {
    if(!this.memberService.paginatedResult())
    this.getMembers();
    console.log(this.memberService.paginatedResult()?.items);
  }

  getMembers(){
    this.memberService.getMembers(this.pageNumber,this.pageSize);
  }

  pageChanged(event:any){
    if(this.pageNumber != event.page){
      this.pageNumber = event.page;
      this.getMembers();
    }
  }

}
