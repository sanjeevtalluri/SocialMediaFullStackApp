import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RegisterComponent } from "../register/register.component";

@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CommonModule, RegisterComponent]
})
export class HomeComponent implements OnInit {
  private http = inject(HttpClient);
  users:any = [];
  registerMode = false;

  ngOnInit(): void {
    this.getUsers();
  }
  registerToggle(){
    this.registerMode = !this.registerMode;
  }
  getUsers(){
    this.http.get('https://localhost:5001/api/users').subscribe({
      next:(users)=>{
        this.users = users;
        console.log(users);
      },
      error:(error)=>{
        console.log(error);
      },
      complete:()=>{
        console.log('completed');
      }
    });
  }

  cancelRegisterInHome($event:boolean){
    this.registerMode = false;
  }
}
