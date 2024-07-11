import { NgFor, NgIf } from '@angular/common';
import { Component, inject, NO_ERRORS_SCHEMA, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MembersService } from '../../services/members.service';
import { MemberCardComponent } from "../member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { Pagination } from '../../models/pagination';
import { UserParams } from '../../models/userParams';
import { AccountService } from '../../services/account.service';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

@Component({
    selector: 'app-member-list',
    standalone: true,
    templateUrl: './member-list.component.html',
    styleUrl: './member-list.component.css',
    imports: [NgFor, MemberCardComponent,NgIf,PaginationModule,FormsModule,ButtonsModule],
    schemas:[]
})
export class MemberListComponent implements OnInit{
  memberService = inject(MembersService);
  pagination?: Pagination;
  genderList = [{value:'male',display:'Male'},{value:'female',display:'Female'}]
  ngOnInit(): void {

    if(!this.memberService.paginatedResult()){
      this.resetFilters();
    }
  }

  getMembers(){
    this.memberService.getMembers();
  }

  resetFilters(){
    this.memberService.resetUserParams();
    this.getMembers();
  }

  pageChanged(event:any){
    if(this.memberService.userParams().pageNumber != event.page ){
      this.memberService.userParams().pageNumber = event.page;
      this.getMembers();
    }
  }

}
