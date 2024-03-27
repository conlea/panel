import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class MethodService {
  constructor(private http: HttpClient) {}

  methodList(): Observable<any> {
    return this.http.get<any>("methods").pipe(catchError(this.handleError));
  }
  getMethodID(id: number): Observable<any> {
    return this.http
      .get<any>(`methods/${id}`)
      .pipe(catchError(this.handleError));
  }
  getMethodParams() {
    return this.http
      .get<any>(`methods/getparams`)
      .pipe(catchError(this.handleError));
  }
  addMethod(method) {
    return this.http
      .post<any>(`methods`, method)
      .pipe(catchError(this.handleError));
  }
  updateMethod(id: number, method): Observable<any> {
    return this.http
      .put<any>(`methods/${id}`, method)
      .pipe(catchError(this.handleError));
  }
  removeMethod(id: number) {
    return this.http
      .delete<any>(`methods/${id}`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.message);
    return throwError(error);
  }
}
