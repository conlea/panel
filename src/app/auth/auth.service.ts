import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { FormGroupDirective } from "@angular/forms";
import { catchError, map, mapTo, switchMap, tap } from "rxjs/operators";
import { AuthHttpService } from "./auth-http.service";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  User;
  tokenUser;
  isUser = new BehaviorSubject<boolean>(false);

  userData = new BehaviorSubject<any>({});
  drawers: any;
  status = false;
  loggedUser: string;
  private readonly JWT_TOKEN = "JWT_TOKEN";
  private readonly REFRESH_TOKEN = "REFRESH_TOKEN";

  private runningSubject: BehaviorSubject<boolean> = new BehaviorSubject(true);
  running = this.runningSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authHttp: AuthHttpService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.init();
  }
  private init() {
    if (this.isLoggedIn()) {
      this.isUser.next(this.isLoggedIn());
    }
  }

  login(login: string, password: string): Observable<any> {
    return this.http
      .post<any>("users/login", { login: login, password: password })
      .pipe(
        map((access) => {
          this.doLoginUser(access.userToSend, access.token);
          return access.token;
        }),
        catchError(this.handleError)
      );
  }
  private doLoginUser(user, token) {
    this.isUser.next(true);
    this.loggedUser = user;
    this.storeTokens(token);
    this.userData.next(user);
  }
  private storeTokens(token) {
    localStorage.setItem(this.JWT_TOKEN, token.token);
    localStorage.setItem(this.REFRESH_TOKEN, token.refreshToken);
  }
  logout(): Observable<any> {
    return this.http
      .post<any>("users/logout", { refreshToken: this.getRefreshToken() })
      .pipe(
        map(() => {
          this.doLogoutUser();
          return true;
        }),
        catchError(this.handleError)
      );
  }
  isLoggedIn(): boolean {
    return !!this.getJwtToken();
  }
  public doLogoutUser() {
    console.log("logOut");
    this.isUser.next(false);
    this.userData.next({});
    this.loggedUser = null;
    this.removeTokens();
    this.router.navigate(["/login"]);
  }
  private getRefreshToken() {
    return localStorage.getItem(this.REFRESH_TOKEN);
  }
  private removeTokens() {
    localStorage.removeItem(this.JWT_TOKEN);
    localStorage.removeItem(this.REFRESH_TOKEN);
    localStorage.removeItem("type");
    localStorage.removeItem("active_user");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("access_token");
  }
  private storeJwtToken(jwt: string) {
    localStorage.setItem(this.JWT_TOKEN, jwt);
  }
  getJwtToken() {
    return localStorage.getItem(this.JWT_TOKEN);
  }
  refreshToken() {
    return this.http
      .post<any>("users/refresh", { refreshToken: this.getRefreshToken() })
      .pipe(
        tap((resp) => {
          this.storeJwtToken(resp.token);
        }),
        catchError((err) => {
          this.router.navigate(["/login"]);
          this.doLogoutUser();
          this.toastr.warning("Sesja wygasła, zaloguj się ponownie", "Info");
          return err;
        })
      );
  }

  getUserByToken(): Observable<any> {
    return this.http.get<any>("users/getUserToken").pipe(
      map((user) => {
        this.userData.next(user);
        return user;
      }),
      catchError(this.handleError)
    );
  }

  userToken(): Observable<boolean> {
    if (this.getJwtToken()) {
      this.isUser.next(true);
    } else {
      this.isUser.next(false);
    }
    return this.isUser.asObservable();
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.message);
    return throwError(error);
  }
}
