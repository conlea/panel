import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class TrainingDatesService {
  constructor(private http: HttpClient) {}

  trainingDatesList(): Observable<any> {
    return this.http
      .get<any>("training-date")
      .pipe(catchError(this.handleError));
  }
  trainingDatesListActive() {
    return this.http
      .get<any>("training-date/active")
      .pipe(catchError(this.handleError));
  }
  trainingDatesListArchive() {
    return this.http
      .get<any>("training-date/archive")
      .pipe(catchError(this.handleError));
  }
  trainingDatesListAll(range, dateStart, dateEnd) {
    return this.http
      .get<any>(
        `training-date/all?range=${range}&datestart=${dateStart}&dateend=${dateEnd}`
      )
      .pipe(catchError(this.handleError));
  }
  trainingDateDetail(id: number): Observable<any> {
    return this.http
      .get<any>(`training-date/${id}`)
      .pipe(catchError(this.handleError));
  }
  trainingDateEdit(id: number): Observable<any> {
    return this.http
      .get<any>(`training-date/edit/${id}`)
      .pipe(catchError(this.handleError));
  }
  getParamsToAddTrainingDates(): Observable<any> {
    return this.http
      .get<any>(`training-date/getParams`)
      .pipe(catchError(this.handleError));
  }
  findPersonFromHS(nameHS: string) {
    return this.http
      .post<any>(`contact/find`, { name: nameHS })
      .pipe(catchError(this.handleError));
  }
  addNewTrainingDate(newTrainingDate, newTickets) {
    return this.http
      .post<any>(`training-date`, { newTrainingDate, newTickets })
      .pipe(catchError(this.handleError));
  }
  updateTrainingDate(id: number, trainingDate) {
    return this.http
      .put<any>(`training-date/${id}`, trainingDate)
      .pipe(catchError(this.handleError));
  }
  removeTrainingDate(id: number) {
    return this.http
      .delete<any>(`training-date/${id}`)
      .pipe(catchError(this.handleError));
  }
  addTicketTrainingDate(ticketData) {
    return this.http
      .post<any>(`training-date/ticket`, ticketData)
      .pipe(catchError(this.handleError));
  }
  updateTicketTrainingDate(ticketData) {
    return this.http
      .put<any>(`training-date/ticket/${ticketData.id}`, ticketData)
      .pipe(catchError(this.handleError));
  }
  updateParticipantTraining(id: number, participant) {
    return this.http
      .patch<any>(`training-date/participant/${id}`, participant)
      .pipe(catchError(this.handleError));
  }
  sendGroupMail(mailGroupData) {
    return this.http
      .post<any>(`training-date/send-group-mail`, mailGroupData)
      .pipe(catchError(this.handleError));
  }
  saveNewComment(newComment) {
    return this.http
      .post<any>(`training-date/add-comment`, newComment)
      .pipe(catchError(this.handleError));
  }
  editComment(comment) {
    return this.http
      .patch<any>(`training-date/edit-comment/${comment.id}`, comment)
      .pipe(catchError(this.handleError));
  }
  availablePerson(id, isAvailable) {
    return this.http
      .patch<any>(`training-date/availablePerson/${id}`, isAvailable)
      .pipe(catchError(this.handleError));
  }
  addCostManual(newCost) {
    return this.http
      .post<any>(`training-date/costs/addNewCost`, newCost)
      .pipe(catchError(this.handleError));
  }
  editCostManual(id: number, costToEdit) {
    return this.http
      .put<any>(`training-date/costs/editCost/${id}`, costToEdit)
      .pipe(catchError(this.handleError));
  }
  getCostTrainingDateById(idObj) {
    return this.http
      .post<any>(`training-date/costs/getCostById`, idObj)
      .pipe(catchError(this.handleError));
  }
  getAllCostsTrainingDate(trainingDate_id: number, company_id: number) {
    return this.http
      .post<any>(`training-date/costs/getAllCosts`, {
        trainingDate_id,
        company_id,
      })
      .pipe(catchError(this.handleError));
  }
  addNewCostTrainingDate(newCost) {
    return this.http
      .post<any>(`training-date/costs/addNewCost`, newCost)
      .pipe(catchError(this.handleError));
  }
  removeCost(id: number, trainingDate_id: number) {
    return this.http
      .patch<any>(`training-date/costs/remove/${id}`, { trainingDate_id })
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.message);
    return throwError(error);
  }
  public updateTicketsRank(tickets): Observable<any> {
    return this.http
      .post<any>(`training-date/updateTicketsRank`, tickets)
      .pipe(catchError(this.handleError));
  }
  // getFileParticipants(fileType, participants, headerArray) {
  //   return this.exportToCSV.exportColumnsToCSV(participants, 'filenamecsv.' + fileType, headerArray);
  // }
}
