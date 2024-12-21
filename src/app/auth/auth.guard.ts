import { inject } from '@angular/core';
import { CanActivateFn, Router, } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('userDetails');
  const user = JSON.parse(token!);
  
  if(user.role == 'admin' || user.role == 'user') {
    if (route.data['roles'] && route.data['roles'].indexOf(user.userInfo.role) === -1) {
      router.navigate(['user/dashboard/tasks']);
      return false;
  }
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
