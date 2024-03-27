import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class PleceService {
  constructor(private http: HttpClient) {}
  placeList(): Observable<any> {
    return this.http.get<any>("places").pipe(catchError(this.handleError));
  }
  getPlaceId(id: number) {
    return this.http
      .get<any>(`places/${id}`)
      .pipe(catchError(this.handleError));
  }
  addNewPlace(place) {
    return this.http
      .post<any>(`places`, place)
      .pipe(catchError(this.handleError));
  }
  updatePlace(id: number, place) {
    return this.http
      .put<any>(`places/${id}`, place)
      .pipe(catchError(this.handleError));
  }
  removePlace(id: number) {
    return this.http
      .delete<any>(`places/${id}`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.message);
    return throwError(error);
  }
}
