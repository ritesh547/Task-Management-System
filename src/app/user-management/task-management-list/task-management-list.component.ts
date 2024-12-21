import { Component, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-task-management-list',
  standalone: true,
  imports: [],
  templateUrl: './task-management-list.component.html',
  styleUrl: './task-management-list.component.css'
})
export class TaskManagementListComponent implements OnInit {
  tasks: any[] = [];
  isDisbled: boolean = false;
  isShow: boolean = false;
  isUser: boolean = false;
  isRole: any;
  selectedStatus: string = '';
  statusOptions = ['Pending', 'In Progress', 'Completed'
  ]
  useruserDetailObject: any | undefined;
  constructor(private taskService: TaskService, private router: Router,
    private userService: UserService
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

  onStatusChange(e: any) {
    this.selectedStatus = e.target.value;
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users: any[]) => {
      console.log('users', users);
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe((tasks: any[]) => {
      this.tasks = tasks;
      if (this.isRole == 'admin') {
        this.isDisbled = false;
        this.isShow = false;
        this.tasks = tasks;
      } else {
        debugger
        this.isDisbled = true;
        this.isShow = true;
        this.isUser = true;
        debugger
        console.log('this.tasks', this.tasks);
        this.tasks = tasks.filter((item: any, i: any) => this.useruserDetailObject.userId == item.assignedUserID);
      }

    });
  }

  createTask(): void {
    this.router.navigate(['user/dashboard/add-new-task']);
  }

  editTask(item: any): void {
    this.router.navigate(['user/dashboard/add-new-task', item.id]);
  }

  deleteTask(taskId: number): void {
    const confirmation = window.confirm('Are you sure you want to remove?');
    if (confirmation) {
      this.taskService.deleteTask(taskId).subscribe(() => {
        this.loadTasks();
      });
    }

  }

  updateStatus(item: any) {
    debugger
    let payload = {
      assignedUserID: this.useruserDetailObject.userId,
      title: item.title,
      description: item.description,
      assignedUserName: item.assignedUserName,
      priority: item.priority,
      dueDate: item.dueDate,
      status: this.selectedStatus // Initial status
    }
    debugger
    this.taskService.updateTask(item.id, payload).subscribe((res: any) => {
      this.router.navigate(['user/dashboard/task']);
    })

  }
}
