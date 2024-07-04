
import { CommonModule } from '@angular/common';
import { Component, inject, Inject } from '@angular/core';
import { FormsModule,} from '@angular/forms';
import { AccountService } from '../services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [FormsModule,CommonModule,BsDropdownModule],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  model: any = {}
  accountService = inject(AccountService);
  login(){
    console.log(this.model);
    this.accountService.login(this.model).subscribe({
      next: (response)=>{
        console.log(response);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  logout(){
    this.accountService.logout();
  }
}
