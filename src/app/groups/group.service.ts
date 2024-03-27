import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class GroupService {
  constructor(private http: HttpClient) {}

  groupList() {
    return this.http.get<any>("group").pipe(catchError(this.handleError));
  }
  groupAdd(group) {
    return this.http
      .post<any>(`group`, group)
      .pipe(catchError(this.handleError));
  }
  groupUpdate(id: number, group) {
    return this.http
      .put<any>(`group/${id}`, group)
      .pipe(catchError(this.handleError));
  }
  groupRemove(id) {
    return this.http
      .delete<any>(`group/${id}`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.message);
    return throwError(error);
  }
}
