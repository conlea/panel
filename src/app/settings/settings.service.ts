import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class SettingsService {
  constructor(private http: HttpClient) {}

  adminList(): Observable<any> {
    return this.http.get<any>("users/list").pipe(catchError(this.handleError));
  }
  addNewAdmin(user): Observable<any> {
    return this.http
      .post<any>("users/addNewAdmin", user)
      .pipe(catchError(this.handleError));
  }
  adminUpdate(user): Observable<any> {
    return this.http
      .put<any>("users/updateAdmin", user)
      .pipe(catchError(this.handleError));
  }
  getSettings() {
    return this.http.get<any>("settings").pipe(catchError(this.handleError));
  }
  statusUpdate(id: number, status) {
    return this.http
      .put<any>(`settings/status/${id}`, status)
      .pipe(catchError(this.handleError));
  }
  addNewStatus(status) {
    return this.http
      .post<any>(`settings/status`, status)
      .pipe(catchError(this.handleError));
  }
  addNewlang(lang) {
    return this.http
      .post<any>(`settings/lang`, lang)
      .pipe(catchError(this.handleError));
  }
  updateLang(id: number, lang) {
    return this.http
      .put<any>(`settings/lang/${id}`, lang)
      .pipe(catchError(this.handleError));
  }
  addNewCurrency(currency) {
    return this.http
      .post<any>(`settings/currency`, currency)
      .pipe(catchError(this.handleError));
  }
  updateCurrency(id: number, currency) {
    return this.http
      .put<any>(`settings/currency/${id}`, currency)
      .pipe(catchError(this.handleError));
  }
  addNewAttr(newAttr) {
    return this.http
      .post<any>(`settings/ticket-attr`, newAttr)
      .pipe(catchError(this.handleError));
  }
  updateAttr(id: number, attr) {
    return this.http
      .put<any>(`settings/ticket-attr/${id}`, attr)
      .pipe(catchError(this.handleError));
  }
  companyList() {
    return this.http
      .get<any>(`settings/company`)
      .pipe(catchError(this.handleError));
  }
  addNewCompany(newCompany) {
    return this.http
      .post<any>(`settings/company`, newCompany)
      .pipe(catchError(this.handleError));
  }
  updateCompany(id: number, company) {
    return this.http
      .put<any>(`settings/company/${id}`, company)
      .pipe(catchError(this.handleError));
  }
  addNewEventType(newEventType) {
    return this.http
      .post<any>(`settings/event-type`, newEventType)
      .pipe(catchError(this.handleError));
  }
  updateEventType(id: number, eventType) {
    return this.http
      .put<any>(`settings/event-type/${id}`, eventType)
      .pipe(catchError(this.handleError));
  }
  addNewParticipantRole(newParticipantRole) {
    return this.http
      .post<any>(`settings/participant-role`, newParticipantRole)
      .pipe(catchError(this.handleError));
  }
  updateParticipantRole(id: number, participantRole) {
    return this.http
      .put<any>(`settings/participant-role/${id}`, participantRole)
      .pipe(catchError(this.handleError));
  }
  addNewOrderStatus(newOrderStatus) {
    return this.http
      .post<any>(`settings/order-status`, newOrderStatus)
      .pipe(catchError(this.handleError));
  }
  updateOrderStatus(id: number, orderStatus) {
    return this.http
      .put<any>(`settings/order-status/${id}`, orderStatus)
      .pipe(catchError(this.handleError));
  }
  addNewRegulation(newRegulation) {
    return this.http
      .post<any>(`settings/regulation`, newRegulation)
      .pipe(catchError(this.handleError));
  }
  updateRegulation(id: number, regulation) {
    return this.http
      .put<any>(`settings/regulation/${id}`, regulation)
      .pipe(catchError(this.handleError));
  }
  getCompanyDetails(id: number) {
    return this.http
      .get<any>(`settings/company/${id}`)
      .pipe(catchError(this.handleError));
  }
  getCompanyParams() {
    return this.http
      .get<any>(`settings/company/subscriptions`)
      .pipe(catchError(this.handleError));
  }
  removeCompany(id: number) {
    return this.http
      .delete<any>(`settings/company/${id}`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.message);
    return throwError(error);
  }
}
