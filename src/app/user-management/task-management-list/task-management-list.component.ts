import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-task-management-list',
  standalone: true,
  imports: [],
  templateUrl: './task-management-list.component.html',
  styleUrl: './task-management-list.component.css'
})
export class TaskManagementListComponent implements OnInit {
  public tasks: any[] = [];
  public isDisbled: boolean = false;
  public isShow: boolean = false;
  public isUser: boolean = false;
  public isRole: any;
  public selectedStatus: string = '';
  public statusOptions = ['Pending', 'In Progress', 'Completed'];
  public useruserDetailObject: any | undefined;

  constructor(
    private readonly taskService: TaskService,
    private readonly router: Router,
    private readonly userService: UserService
  ) { }

  ngOnInit(): void {
    const userDetails = localStorage.getItem('userDetails');
    this.useruserDetailObject = JSON.parse(userDetails!);
    if (this.useruserDetailObject) {
      this.isRole = this.useruserDetailObject.role
    }
    this.loadTasks();
    this.loadUsers();
  }

  public onStatusChange(e: any) {
    this.selectedStatus = e.target.value;
  }

  public loadUsers(): void {
    this.userService.getUsers().subscribe((users: any[]) => {
      // console.log('users', users);
    });
  }

  public loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks: any[]) => {
      this.tasks = tasks;
      if (this.isRole == 'admin') {
        this.isDisbled = false;
        this.isShow = false;
        this.tasks = tasks;
      } else {
        this.isDisbled = true;
        this.isShow = true;
        this.isUser = true;
        this.tasks = tasks.filter((item: any, i: any) => this.useruserDetailObject.userId == item.assignedUserID);
      }

    });
  }

  public createTask(): void {
    this.router.navigate(['user/dashboard/add-new-task']);
  }

  public editTask(item: any): void {
    this.router.navigate(['user/dashboard/add-new-task', item.id]);
  }

  public deleteTask(taskId: number): void {
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
        this.taskService.deleteTask(taskId).subscribe(() => {
          this.loadTasks();
        });
        Swal.fire({
          title: "Deleted!",
          text: "Your file has been deleted.",
          icon: "success"
        });
      }
    });
  }

  public updateStatus(item: any) {
    let payload = {
      assignedUserID: this.useruserDetailObject.userId,
      title: item.title,
      description: item.description,
      assignedUserName: item.assignedUserName,
      priority: item.priority,
      dueDate: item.dueDate,
      status: this.selectedStatus
    }
    this.taskService.updateTask(item.id, payload).subscribe((res: any) => {
      this.router.navigate(['user/dashboard/task']);
      this.loadTasks();
    })

  }
}
