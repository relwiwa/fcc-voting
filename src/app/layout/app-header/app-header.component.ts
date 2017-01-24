import { Component } from '@angular/core';

import { AuthenticationService } from '../../user/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html',
  styleUrls: ['./app-header.component.css']
})

export class AppHeaderComponent {
  private appTitle: string;

  constructor(private authService: AuthenticationService) {
    this.appTitle = 'Decisions, decisions';
  }

}
