import { NgFor } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { RolesModalComponent } from '../../modals/roles-modal/roles-modal.component';
import { User } from '../../models/user';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [NgFor],
  templateUrl: './admin-management.component.html',
  styleUrl: './admin-management.component.css'
})
export class AdminManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private modalService = inject(BsModalService);
  users:User[] = [];
  bsModalRef?: BsModalRef;
  ngOnInit(): void {
    this.getUsersWihRoles();
  }

  getUsersWihRoles(){
    this.adminService.getUsersWithRoles().subscribe({
      next:response=>{
        this.users = response;
      }
    })
  }
  openRolesModal(user: User) {
    const config = {
      class: 'modal-dialog-centered',
      initialState: {
        title:'User roles',
        username:user.username,
        selectedRoles:[...user.roles],
        availableRoles: ['Admin','Moderator','Member'],
        users:this.users,
        rolesUpdated:false
      }
    }
    this.bsModalRef = this.modalService.show(RolesModalComponent, config);
    this.bsModalRef.onHide?.subscribe({
      next:()=>{
        if(this.bsModalRef?.content && this.bsModalRef.content.rolesUpdated){
          const selectedRoles = this.bsModalRef.content.selectedRoles;
          this.adminService.updateUserRoles(user.username,selectedRoles).subscribe({
            next:roles=>{
              user.roles = roles;
            }
          })
        }
      }
    })
    // this.bsModalRef.content.updateSelectedRoles.subscribe(values => {
    //   const rolesToUpdate = {
    //     roles: [...values.filter(el => el.checked === true).map(el => el.name)]
    //   };
    //   if (rolesToUpdate) {
    //     this.adminService.updateUserRoles(user.username, rolesToUpdate.roles).subscribe(() => {
    //       user.roles = [...rolesToUpdate.roles]
    //     })
    //   }
    // })
  }

}
