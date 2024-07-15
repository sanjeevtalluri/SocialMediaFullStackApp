import { NgFor, NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { Member } from '../models/member';
import { LikesService } from '../services/likes.service';
import { MemberCardComponent } from "../members/member-card/member-card.component";
import { PaginationModule } from 'ngx-bootstrap/pagination';

@Component({
    selector: 'app-lists',
    standalone: true,
    templateUrl: './lists.component.html',
    styleUrl: './lists.component.css',
    imports: [FormsModule, ButtonsModule, NgFor, MemberCardComponent,PaginationModule,NgIf]
})
export class ListsComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
    this.likesService.paginatedResult.set(null);
  }
  ngOnInit(): void {
    this.loadLikes();
  }
  likesService = inject(LikesService);
  members:Member[] = [];
  predicate:string = "liked";
  pageNumber = 1;
  pageSize = 6;

  loadLikes(){
    this.likesService.getLikes(this.predicate,this.pageNumber,this.pageSize);
  }

  getTitle(){
    switch(this.predicate){
      case 'liked': return 'Members you like';
      case 'likedBy': return 'Members who you liked';
      default: return 'Mutual';
    }
  }

  pageChanged(event:any){
    if(this.pageNumber != event.page){
      this.pageNumber = event.page;
      this.loadLikes();
    }
  }
}
