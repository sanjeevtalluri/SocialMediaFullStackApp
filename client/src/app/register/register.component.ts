import { Component, EventEmitter, inject, OnInit, output, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../services/account.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  cancelRegister = output<boolean>();
  model: any = {};

  private accountService= inject(AccountService);

  ngOnInit(): void {
  }

  register() {
    this.accountService.register(this.model).subscribe({
      next:(user)=>{
        console.log(user);
        this.cancel();
      },
      error:(err)=>{
        console.log(err);
      }
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
