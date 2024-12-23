import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-create-new-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-new-user.component.html',
  styleUrl: './create-new-user.component.css'
})
export class CreateNewUserComponent implements OnInit {
  public userForm: any;
  public isId: any;
  public submitted: boolean = false;
  constructor(
    private readonly fb: FormBuilder,
    private readonly userServices: UserService,
    private readonly router: Router,
    private readonly ac: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.formInIt();
    this.isId = this.ac.snapshot.paramMap.get('id');
    if (this.isId) {
      this.getUserById();
    }
  }

  public formInIt(): void {
    this.userForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('^[A-Za-z ]*$')]],  // Name validation (letters and spaces only)
      email: ['', [Validators.required, Validators.email]],                    // Email validation
      role: ['', [Validators.required]],                                         // Role validation
      status: ['', [Validators.required]]
    })
  }
  public getUserById(): void {
    this.userServices.getUserById(this.isId).subscribe((res: any) => {
      this.userForm.setValue({
        name: res.name,
        email: res.email,
        role: res.role,
        status: res.status,
      })
    })
  }

  get f() {
    return this.userForm.controls
  }

  public onCancel() {
    this.router.navigate(['user/dashboard/user-list']);
  }

  public submit() {
    this.submitted = true;
    if (this.userForm.invalid) {
      return
    } else {
      if (this.isId != null) {
        this.userServices.updateUser(this.isId, this.userForm.value).subscribe((res: any) => {
          this.router.navigate(['user/dashboard/user-list']);
        })
      } else {
        this.userServices.createUser(this.userForm.value).subscribe((res: any) => {
          this.router.navigate(['user/dashboard/user-list']);
        })
      }

    }
  }
}
