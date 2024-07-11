import { CommonModule, JsonPipe, NgIf } from '@angular/common';
import { Component, inject, OnInit, output } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../services/account.service';
import { TextInputComponent } from '../forms/text-input/text-input.component';
import { DatePickerComponent } from "../forms/date-picker/date-picker.component";
import { Router } from '@angular/router';

@Component({
    selector: 'app-register',
    standalone: true,
    templateUrl: './register.component.html',
    styleUrl: './register.component.css',
    imports: [
        ReactiveFormsModule,
        NgIf,
        JsonPipe,
        CommonModule,
        TextInputComponent,
        DatePickerComponent
    ]
})
export class RegisterComponent implements OnInit {
  cancelRegister = output<boolean>();
  model: any = {};
  registerForm!: FormGroup;
  maxDate: Date = new Date();
  validationErrors:string[] = [];

  private accountService = inject(AccountService);
  private toastr = inject(ToastrService);
  private fb = inject(FormBuilder);
  private router = inject(Router);

  ngOnInit(): void {
    this.intitializeForm();
    this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
  }

  intitializeForm() {
    this.registerForm = this.fb.group({
      gender: ['male'],
      username: ['', Validators.required],
      knownAs: ['', Validators.required],
      dateOfBirth: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      password: [
        '',
        [Validators.required, Validators.minLength(4), Validators.maxLength(8)],
      ],
      confirmPassword: [
        '',
        [Validators.required, this.matchValues('password')],
      ],
    });
    this.registerForm.controls['password'].valueChanges.subscribe({
      next: () => {
        this.registerForm?.controls['confirmPassword'].updateValueAndValidity();
      },
    });
  }

  matchValues(matchTo: string): ValidatorFn {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.get(matchTo)?.value
        ? null
        : { isMatching: true };
    };
  }

  register() {
    const dob = this.getDateOnly(this.registerForm.get('dateOfBirth')?.value);
    this.registerForm.patchValue({
      dateOfBirth:dob
    })
    this.accountService.register(this.registerForm.value).subscribe({
      next: (user) => {
        console.log(user);
        this.router.navigateByUrl('/members');
      },
      error: (err) => {
        console.log(err);
        this.validationErrors = err;
      },
    });
  }

  cancel() {
    this.cancelRegister.emit(false);
  }

  getDateOnly(dob:string | undefined){
    if(!dob) return;
    return new Date(dob).toISOString().slice(0,10);
  }
}
