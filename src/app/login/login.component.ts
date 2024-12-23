import { CommonModule } from '@angular/common';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../user-management/services/user.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  public loginForm!: any;
  public submitted: boolean = false;
  public emailRegex: RegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  public passwordRegex: RegExp = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).{8,20}$/;
  public filteredUsers: any;
  public emailFilter: string = '';  // Holds the value for filtering by email
  public roleFilter: string = '';
  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly router: Router,
    private readonly userService: UserService,
    private readonly renderer: Renderer2
  ) {
  }

  ngOnInit() {
    this.formInIt();
    const token = localStorage.getItem('userDetails');
    const user = JSON.parse(token!);
    if (user) {
      this.router.navigate(['user/dashboard/'])
    }
  }

  public formInIt(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(this.emailRegex)]],
      password: ['', [Validators.required]]
    });
  }
  
  get f() {
    return this.loginForm.controls;
  }

  public onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      return;
    } else {
      this.userService.getUsers().subscribe((users: any[]) => {
        this.filteredUsers = users.filter(user => {
          const matchesEmail = user.email == this.loginForm.value.email;
          const matchesRole = user.role == this.loginForm.value.password;
          return matchesEmail && matchesRole;
        });
        if (this.filteredUsers.length > 0) {
          if (this.filteredUsers[0].status == 'Active') {
            const firstUserRole = this.filteredUsers[0].role.toLowerCase();
            localStorage.setItem('userDetails', JSON.stringify(
              {
                userId: this.filteredUsers[0].id,
                role: firstUserRole
              }
            ));
            this.router.navigate(['user']);
          } else {
            alert('user is inactive')
          }

        }
        else {
          alert('invalid email or password')
        }
      });
    }



  }
}
