import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-user-management-list',
  standalone: true,
  imports: [],
  templateUrl: './user-management-list.component.html',
  styleUrl: './user-management-list.component.css'
})
export class UserManagementListComponent implements OnInit {
  public users: any[] = [];
  public useruserDetailObject: any | undefined;
  public isUser: string = '';
  public isRole: any;
  public isDisbled: boolean = false;
  constructor(
    private readonly userService: UserService,
    private readonly router: Router) { }

  ngOnInit(): void {
    const userDetails = localStorage.getItem('userDetails');
    this.useruserDetailObject = JSON.parse(userDetails!);
    if (this.useruserDetailObject) {
      this.isRole = this.useruserDetailObject.role
    }
    this.loadUsers();
  }

  public loadUsers(): void {
    this.userService.getUsers().subscribe((users: any[]) => {
      if (this.isRole == 'admin') {
        this.isDisbled = false;
        this.users = users;
      } else {
        this.isDisbled = true;
        this.users = users.filter((item: any, i: any) => this.useruserDetailObject.userId == item.id);
      }
    });
  }

  public createUser(): void {
    this.router.navigate(['user/dashboard/add-user']);
  }

  public editUser(user: any): void {
    this.router.navigate(['user/dashboard/add-user', user.id]);
  }

  public deleteUser(userId: number): void {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this.userService.deleteUser(userId).subscribe(() => {
          this.loadUsers();
        });
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });

  }
}
