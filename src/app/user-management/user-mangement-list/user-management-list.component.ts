import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-user-management-list',
  standalone: true,
  imports: [],
  templateUrl: './user-management-list.component.html',
  styleUrl: './user-management-list.component.css'
})
export class UserManagementListComponent implements OnInit {
  users: any[] = [];
  useruserDetailObject: any | undefined;
  isUser: string = '';
  isRole: any;
  isDisbled: boolean = false;
  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    const userDetails = localStorage.getItem('userDetails');
    this.useruserDetailObject = JSON.parse(userDetails!);
    if (this.useruserDetailObject) {
      this.isRole = this.useruserDetailObject.role
    }
    this.loadUsers();
  }

  loadUsers(): void {
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

  createUser(): void {
    this.router.navigate(['user/dashboard/add-user']);
  }

  editUser(user: any): void {
    this.router.navigate(['user/dashboard/add-user', user.id]);
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe(() => {
      this.loadUsers();
    });
  }
}
