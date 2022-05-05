import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class OrderService {

  constructor(private http: HttpClient) {
  }

  getOrders() {
    let token = localStorage.getItem('token');

    let headers = new HttpHeaders().append('Authorization', 'Bearer ' + token);

    return this.http.get('/api/orders',  { headers: headers });
  }
}
