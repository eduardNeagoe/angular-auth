import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(private http: HttpClient) {
  }

  login(credentials: Credentials) {
    return this.http.post('/api/authenticate',
      JSON.stringify(credentials))
      .pipe(
        map((response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);
            return true;
          }
          return false;
        })
      );
  }

  logout() {
    localStorage.removeItem('token');
  }

  isLoggedIn() {
    
    let token = localStorage.getItem('token')

    let jwtHelper = new JwtHelperService();

    return token && !jwtHelper.isTokenExpired(token);
  }

  get currentUser(){
    let token = localStorage.getItem('token');
    return token && new JwtHelperService().decodeToken(token);
  }
}

export interface Credentials {
  email: string;
  password: string;
}

