import { Component } from '@angular/core';

import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})

export class AppHeaderComponent {
  navbarIn: boolean;

  constructor(public authService: AuthenticationService) {
    this.navbarIn = false;
  }

  toggleNavbarIn() {
    this.navbarIn = this.navbarIn === false ? true : false;
  }

  collapseNavbar() {
    this.navbarIn = false;
  }

}