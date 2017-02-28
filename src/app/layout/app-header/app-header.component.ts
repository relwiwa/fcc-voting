import { Component } from '@angular/core';

import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})

export class AppHeaderComponent {
  private navbarIn: boolean;

  constructor(private authService: AuthenticationService) {
    this.navbarIn = false;
  }

  toggleNavbarIn() {
    this.navbarIn = this.navbarIn === false ? true : false;
  }

  collapseNavbar(event, url) {
    this.navbarIn = false;
  }

}