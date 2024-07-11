import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import {
  Component,
  inject,
  OnInit,
  output,
} from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';
import { TextInputComponent } from "../forms/text-input/text-input.component";

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    imports: [ReactiveFormsModule, NgIf, JsonPipe, CommonModule, TextInputComponent]
})
export class RegisterComponent implements OnInit {
  cancelRegister = output<boolean>();
  model: any = {};
  registerForm!: FormGroup;

  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  //private fb = inject(FormBuilder);

  ngOnInit(): void {
    this.intitializeForm();
  }

  intitializeForm() {
    this.registerForm = new FormGroup({
      username: new FormControl ('', Validators.required),
      password: new FormControl (
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ),
      confirmPassword: new FormControl (
        '',
        [Validators.required, this.matchValues('password')],
      ),
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next:()=>{
        this.registerForm?.controls['confirmPassword'].updateValueAndValidity();
      }
    })
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value
        ? null
        : { isMatching: true };
    };
  }

  register() {
    this.accountService.register(this.model).subscribe({
      next: (user) => {
        console.log(user);
        this.cancel();
      },
      error: (err) => {
        console.log(err);
        this.toastr.error(err.error);
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }
}
