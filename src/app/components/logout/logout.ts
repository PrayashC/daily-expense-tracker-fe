import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Modal } from '../modal/modal';

@Component({
  selector: 'app-logout',
  imports: [Modal],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
})
export class Logout {
  private readonly router = inject(Router);

  confirmLogout = signal(false);

  logout(): void {
    this.confirmLogout.set(true);
  }

  confirmLogoutAction(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['login']);
  }

  cancelLogout(): void {
    this.confirmLogout.set(false);
  }
}
