import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-logout',
  imports: [],
  templateUrl: './logout.html',
  styleUrl: './logout.scss',
})
export class Logout {
  private readonly router = inject(Router);

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    this.router.navigate(['login']);
  }
}
