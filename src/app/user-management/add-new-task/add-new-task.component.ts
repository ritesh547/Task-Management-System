import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { TaskService } from '../services/task.service';


@Component({
  selector: 'app-add-new-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-new-task.component.html',
  styleUrl: './add-new-task.component.css'
})
export class AddNewTaskComponent implements OnInit {
  users: any[] = [];
  taskForm: any;
  submitted = false;
  isId: any;
  constructor(private fb: FormBuilder, private router: Router,
    private userService: UserService,
    private taskService: TaskService,
    private ac: ActivatedRoute) { }

  ngOnInit(): void {
    this.taskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      assignedUserID: ['', Validators.required],  // User ID, this can be a select dropdown
      priority: ['', Validators.required],
      dueDate: ['', Validators.required],
    status: ['', Validators.required]
    });

    this.isId = this.ac.snapshot.paramMap.get('id');
    if (this.isId) {
      this.taskService.getTaskById(this.isId).subscribe((res: any) => {
        this.taskForm.setValue({
          title: res.title,
          description: res.description,
          assignedUserID: res.assignedUserID,
          priority: res.priority,
          dueDate: res.dueDate,
          status: res.status,
        })
      })
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users: any[]) => {
      this.users = users.filter((item: any, i: any) => item.role.toLowerCase() == 'user');
    });
  }

  get f() {
    return this.taskForm.controls;
  }

  onCancel() {
    this.router.navigate(['user/dashboard/task']);
  }

  submit() {
    this.submitted = true;
    if (this.f.invalid) {
      return
    } else {
      if (this.isId != null) {
        debugger
        const assignedUserName = this.users.find(user => user.id == this.taskForm.value.assignedUserID);
        this.taskForm.value.assignedUserName = assignedUserName.name;
        debugger
        this.taskService.updateTask(this.isId, this.taskForm.value).subscribe((res: any) => {
          this.router.navigate(['user/dashboard/task']);
        })
      } else {
        debugger
        const assignedUserName = this.users.find(user => user.id == this.taskForm.value.assignedUserID);
        this.taskForm.value.assignedUserName = assignedUserName.name;
        this.taskService.addTask(this.taskForm.value).subscribe((res: any) => {
          this.router.navigate(['user/dashboard/task']);
        })
      }
    }
  }

}
