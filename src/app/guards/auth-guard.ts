import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  let isLoggedin: boolean = !!localStorage.getItem('token');

  if (isLoggedin) {
    return true;
  } else {
    router.navigate(['login']);
    return false;
  }
};
