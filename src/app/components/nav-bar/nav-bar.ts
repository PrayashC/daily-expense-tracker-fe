import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NameLogo } from '../name-logo/name-logo';
import { Logout } from '../logout/logout';

@Component({
  selector: 'app-nav-bar',
  imports: [RouterLink, RouterLinkActive, NameLogo, Logout],
  templateUrl: './nav-bar.html',
  styleUrl: './nav-bar.scss',
})
export class NavBar {
  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'fa-solid fa-house', exact: true },
    { label: 'Expenses', route: '/dashboard/expenses', icon: 'fa-regular fa-file-lines' },
    { label: 'Reports', route: '/dashboard/reports', icon: 'fa-solid fa-chart-line' },
  ];
}
