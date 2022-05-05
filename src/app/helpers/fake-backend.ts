import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, mergeMap, materialize, dematerialize } from 'rxjs/operators';
import { Credentials } from '../services/auth.service';

//non-admin
// let jwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkVkdWFyZCIsImFkbWluIjpmYWxzZX0.93KRY-lOIHMaDl-vM6_3Oe_JMA0u_f6JtA8-RQ0bbwU';

//admin
let jwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkVkdWFyZCIsImFkbWluIjp0cnVlfQ.a4F8yH-8II7x9KTBYQr9ZQProqcgwHFzGN2W1oE1N2Q';

@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const { url, method, headers, body } = req;
        const credentials: Credentials = JSON.parse(body);

        // wrap in delayed observable to simulate server api call
        return of(null)
            .pipe(mergeMap(handleRoute))
            .pipe(materialize()) // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
            .pipe(delay(500))
            .pipe(dematerialize());

        function handleRoute() {
            switch (true) {
                case url.endsWith('/api/authenticate') && method === 'POST':
                    return authenticate();
                case url.endsWith('/api/orders') && method === 'GET':
                    return getOrders();
                default:
                    // pass through any reqs not handled above
                    return next.handle(req);
            }
        }

        function authenticate() {
            if (!(credentials.email === 'ed@dev.com' && credentials.password === '123')) {
                return error('Username or password is incorrect');
            }
            return ok({ token: jwtToken })
        }

        function getOrders() {
            if (isLoggedIn()) {
                return ok([1, 2, 3]);
            }
            return unauthorized();
        }

        function ok(body: any) {
            let response = new HttpResponse({ status: 200, body });
            return of(response)
        }

        function error(message: any) {
            return throwError({ status: 400, error: { message } });
        }

        function unauthorized() {
            return throwError({ status: 401, error: { message: 'Unauthorised' } });
        }

        function isLoggedIn() {
            return headers.get('Authorization') === 'Bearer ' + jwtToken;
        }
    }
}

export const fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};