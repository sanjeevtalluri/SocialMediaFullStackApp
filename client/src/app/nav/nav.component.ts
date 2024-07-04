
import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormsModule,} from '@angular/forms';
import { AccountService } from '../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule,CommonModule,BsDropdownModule,RouterLink,RouterLinkActive],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  model: any = {}
  accountService = inject(AccountService);
  private router = inject(Router);
  private toastr = inject(ToastrService);
  login(){
    console.log(this.model);
    this.accountService.login(this.model).subscribe({
      next: (response)=>{
        this.router.navigateByUrl('/members');
        console.log(response);
      },
      error:(err)=>{
        console.log(err);
        this.toastr.error(err.error);
      }
    })
  }

  logout(){
    this.accountService.logout();
    this.router.navigateByUrl('/');
  }
}
