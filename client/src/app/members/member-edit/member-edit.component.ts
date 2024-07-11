import { DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, HostListener, inject, OnInit, ViewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TimeagoModule } from 'ngx-timeago';
import { ToastrService } from 'ngx-toastr';
import { Member } from '../../models/member';
import { AccountService } from '../../services/account.service';
import { MembersService } from '../../services/members.service';
import { PhotoEditorComponent } from "../photo-editor/photo-editor.component";

@Component({
    selector: 'app-member-edit',
    standalone: true,
    templateUrl: './member-edit.component.html',
    styleUrl: './member-edit.component.css',
    imports: [FormsModule, NgIf, TabsModule, PhotoEditorComponent,DatePipe,TimeagoModule]
})
export class MemberEditComponent implements OnInit {
  @ViewChild('editForm') editForm?: NgForm;
  ngOnInit(): void {
    this.loadMember();
  }
  member!:Member;
  private accountService = inject(AccountService);
  private memberService = inject(MembersService);
  private toastr=inject(ToastrService);
  @HostListener('window:beforeunload', ['$event']) unloadNotification($event: any) {
    if (this.editForm?.dirty) {
      $event.returnValue = true;
    }
  }
  loadMember(){
    const user = this.accountService.currentUser();
    if(!user) return;
    this.memberService.getMember(user.username).subscribe({
      next:member=>{
        this.member = member;
      }
    })
  }

  updateMember(){
    this.memberService.updateMember(this.member).subscribe(() => {
      this.toastr.success('Profile updated successfully');
      this.editForm?.reset(this.member);
    })
  }

  onMemberChange(event:any){
    this.member = event;
  }
}
