import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DiscountService {
  constructor(private http: HttpClient) {}
  activeDiscountList() {
    return this.http
      .get<any>("code-discount")
      .pipe(catchError(this.handleError));
  }
  archiveDiscountList() {
    return this.http
      .get<any>("code-discount/archive")
      .pipe(catchError(this.handleError));
  }
  allDiscountList() {
    return this.http
      .get<any>("code-discount/all")
      .pipe(catchError(this.handleError));
  }
  addDiscount(sendData) {
    return this.http
      .post<any>("code-discount", sendData)
      .pipe(catchError(this.handleError));
  }
  editDiscount(sendData) {
    return this.http
      .put<any>(`code-discount/${sendData.id}`, sendData)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.message);
    return throwError(error);
  }
}
