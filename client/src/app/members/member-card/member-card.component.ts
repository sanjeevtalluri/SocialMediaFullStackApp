
import { CommonModule, NgIf } from '@angular/common';
import { Component, computed, inject, input, Input, OnInit } from '@angular/core';
import { RouterLink} from '@angular/router';
import { Member } from '../../models/member';
import { LikesService } from '../../services/likes.service';

@Component({
  selector: 'app-member-card',
  standalone: true,
  imports: [RouterLink,NgIf],
  templateUrl: './member-card.component.html',
  styleUrl: './member-card.component.css'
})
export class MemberCardComponent{
  member = input.required<Member>();
  private likesService = inject(LikesService);
  hasLiked = computed(()=>this.likesService.likeIds().includes(this.member().id));
  constructor(){

  }
  toggleLike(){
    this.likesService.toggleLike(this.member().id).subscribe({
      next:()=>{
        if(this.hasLiked()){
          this.likesService.likeIds.update(ids=>ids.filter(x=>x != this.member().id));
        }
        else{
          this.likesService.likeIds.update(ids=>[...ids,this.member().id]);
        }
      }
    })
  }
}
