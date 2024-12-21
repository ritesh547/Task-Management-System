import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TaskManagementListComponent } from './task-management-list/task-management-list.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserManagementListComponent } from './user-mangement-list/user-management-list.component';
import { authGuard } from '../auth/auth.guard';
import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
import { AddNewTaskComponent } from './add-new-task/add-new-task.component';


const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },  // Default to dashboard
  {
    path: 'dashboard', component: DashboardComponent, children: [
      { path: '', redirectTo: 'task', pathMatch: 'full' },
      {
        path: 'task', component: TaskManagementListComponent,
        canActivate: [authGuard]
      },
      {
        path: 'user-list', component: UserManagementListComponent,
        canActivate: [authGuard]
      },
      {
        path: 'add-user', component: CreateNewUserComponent,
        canActivate: [authGuard]
      },
      {
        path: 'add-user/:id',
        component: CreateNewUserComponent,
        canActivate: [authGuard]
      },
      {
        path: 'add-new-task',
        component: AddNewTaskComponent,
        canActivate: [authGuard]
      },
      {
        path: 'add-new-task/:id',
        component: AddNewTaskComponent,
        canActivate: [authGuard]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
