import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { tap, catchError, map, switchMap, filter, take } from 'rxjs/operators';


const UrlApi = environment.APIEndpoint;

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  private isRefreshing = true;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (this.authService.getJwtToken()) {
      req = this.addToken(req, this.authService.getJwtToken());
    }
    const clonedReq = req.clone({
      url: UrlApi + `${req.url}`
    });

    return next.handle(clonedReq).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // if (this.authService.getJwtToken()) {
        if (false) {
          return this.handle401Error(clonedReq, next);
        } else {
          this.toastr.warning('Sesja wygasła, zaloguj się ponownie', 'Info');
          this.authService.doLogoutUser();
          this.router.navigate(['/login']);
        }
      } else {
        return throwError(error);
      }
    }));
  }
  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    })
  }
  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);
      return this.authService.refreshToken().pipe(switchMap((token: any) => {
        this.isRefreshing = false;
        this.refreshTokenSubject.next(token.token);
        return next.handle(this.addToken(request, token.token));
      }))
    } else {
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    }
  }
}
