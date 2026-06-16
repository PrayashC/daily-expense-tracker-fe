import { Routes } from '@angular/router';
import { UserEntryPage } from './user-entry-page/user-entry-page';
import { Login } from './login/login';
import { Signup } from './signup/signup';
import { Base } from './base/base';
import { authGuard } from '../guards/auth-guard';
import { Dashboard } from './base/dashboard/dashboard';
import { Expenses } from './base/expenses/expenses';

export const pagesRoutes: Routes = [
  {
    path: '',
    component: UserEntryPage,
    children: [
      { path: 'login', component: Login },
      { path: 'signup', component: Signup },
    ],
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: Base,
    children: [
      { path: '', component: Dashboard },
      { path: 'expenses', component: Expenses },
    ],
  },
];
