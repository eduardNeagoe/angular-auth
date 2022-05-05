import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  constructor(private authService: AuthService) { }

  logout(){
    this.authService.logout();
  }

  isLoggedIn(){
    return this.authService.isLoggedIn();
  }

  isAdmin(){
    return this.authService.currentUser.admin;
  }

  get userName(){
    return this.authService.currentUser.name;
  }
}
