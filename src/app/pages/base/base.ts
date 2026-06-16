import { Component } from '@angular/core';
import { NavBar } from '../../components/nav-bar/nav-bar';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-base',
  imports: [NavBar, RouterOutlet],
  templateUrl: './base.html',
  styleUrl: './base.scss',
})
export class Base {}
