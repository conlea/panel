import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { Trainer } from "./model/trainer";

@Injectable({
  providedIn: "root",
})
export class TrainerService {
  constructor(private http: HttpClient) {}
  trainerList(): Observable<Trainer[]> {
    return this.http.get<any>("trainers").pipe(catchError(this.handleError));
  }
  getTrainer(id: number): Observable<Trainer> {
    return this.http
      .get<any>(`trainers/details/${id}`)
      .pipe(catchError(this.handleError));
  }
  editTrainer(id: number) {
    return this.http
      .get<any>(`trainers/edit/${id}`)
      .pipe(catchError(this.handleError));
  }
  getParamsTrainer(): Observable<any> {
    return this.http
      .get<any>("trainers/getParams")
      .pipe(catchError(this.handleError));
  }

  createNewTrainer(newTrainer): Observable<Trainer> {
    return this.http
      .post<any>("trainers", newTrainer)
      .pipe(catchError(this.handleError));
  }
  updateTrainer(trainerUpdate): Observable<Trainer> {
    return this.http
      .patch<any>(`trainers/${trainerUpdate.id}`, trainerUpdate)
      .pipe(catchError(this.handleError));
  }
  sendTrainerImg(fileImg) {
    return this.http
      .post<any>("trainers/getFile", fileImg)
      .pipe(catchError(this.handleError));
  }
  removeTrainer(id: number) {
    return this.http
      .delete<any>(`trainers2/${id}`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.message);
    return throwError(error);
  }
}
