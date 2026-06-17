import { Component } from '@angular/core';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { RouterOutlet } from '@angular/router';
import { NameLogo } from '../../components/name-logo/name-logo';
import { Logout } from '../../components/logout/logout';

@Component({
  selector: 'app-base',
  imports: [NavBar, RouterOutlet, NameLogo, Logout],
  templateUrl: './base.html',
  styleUrl: './base.scss',
})
export class Base {}
