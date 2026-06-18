import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { NameLogo } from '../../components/name-logo/name-logo';
import { Logout } from '../../components/logout/logout';
import { Subscription, filter } from 'rxjs';

@Component({
  selector: 'app-base',
  imports: [NavBar, RouterOutlet, NameLogo, Logout],
  templateUrl: './base.html',
  styleUrl: './base.scss',
})
export class Base implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private routerSub?: Subscription;

  isDashboard = signal(false);

  ngOnInit(): void {
    this.checkRoute(this.router.url);
    this.routerSub = this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.checkRoute(event.urlAfterRedirects);
      });
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }

  private checkRoute(url: string): void {
    this.isDashboard.set(url === '/dashboard');
  }
}
