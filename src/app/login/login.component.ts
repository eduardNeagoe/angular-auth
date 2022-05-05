import { Component } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService, Credentials } from './../services/auth.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  invalidLogin?: boolean;

  constructor(
    private router: Router,
    private authService: AuthService,
    private route: ActivatedRoute) { }

  signIn(credentials: Credentials) {
    this.authService.login(credentials)
      .subscribe(result => {
        if (result){
          let returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
          this.router.navigate([returnUrl || '/']);
        }
        else {
          this.invalidLogin = true;
        }
      });
  }
}
