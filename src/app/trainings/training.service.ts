import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { catchError, map } from "rxjs/operators";
import { Observable, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class TrainingService {
  constructor(private http: HttpClient) {}

  activeTrainingList(): Observable<any> {
    return this.http
      .get<any>("training/active")
      .pipe(catchError(this.handleError));
  }
  archivedTrainingList(): Observable<any> {
    return this.http
      .get<any>("training/archived")
      .pipe(catchError(this.handleError));
  }
  getTraining(id: number) {
    return this.http
      .get<any>(`training/${id}`)
      .pipe(catchError(this.handleError));
  }
  getTrainingToAdd() {
    return this.http
      .get<any>(`training/getparams`)
      .pipe(catchError(this.handleError));
  }
  addTraining(training) {
    return this.http
      .post<any>(`training`, training)
      .pipe(catchError(this.handleError));
  }
  updateTraining(id: number, training) {
    return this.http
      .put<any>(`training/${id}`, training)
      .pipe(catchError(this.handleError));
  }
  removeTraining(id: number) {
    return this.http
      .delete<any>(`training/${id}`)
      .pipe(catchError(this.handleError));
  }
  addDefaultTicket(defaultTicket) {
    return this.http
      .post<any>(`training/default-ticket`, defaultTicket)
      .pipe(catchError(this.handleError));
  }
  editDefaultTicket(defaultTicket) {
    return this.http
      .put<any>(`training/default-ticket/${defaultTicket.id}`, defaultTicket)
      .pipe(catchError(this.handleError));
  }
  removeDefaultTicket(defaultTicketId, trainingID) {
    return this.http
      .delete<any>(`training/default-ticket/${defaultTicketId}/${trainingID}`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.message);
    return throwError(error);
  }
}
