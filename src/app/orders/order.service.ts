import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import {
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
} from "rxjs/operators";
import { OrderListInterface } from "./order-list/order-list.interface";

@Injectable({
  providedIn: "root",
})
export class OrderService {
  constructor(private http: HttpClient) {}

  public orderList(): Observable<OrderListInterface[]> {
    return this.http
      .get<OrderListInterface[]>("orders")
      .pipe(catchError(this.handleError));
  }
  public orderArchiwList(): Observable<any> {
    return this.http
      .get<any>("orders/archiw")
      .pipe(catchError(this.handleError));
  }
  orderAllList(): Observable<any> {
    return this.http.get<any>("orders/all").pipe(catchError(this.handleError));
  }

  public archiveOrderList(orders: OrderListInterface[]): Observable<any> {
    return this.http
      .post<any>(`orders/archive-order-list`, orders)
      .pipe(catchError(this.handleError));
  }

  public removeOrderList(orders: OrderListInterface[]): Observable<any> {
    return this.http
      .post<any>(`orders/remove-order-list`, orders)
      .pipe(catchError(this.handleError));
  }

  orderDetail(id: number): Observable<any> {
    return this.http
      .get<any>(`orders/${id}`)
      .pipe(catchError(this.handleError));
  }
  orderUpdate(id: number, order) {
    return this.http
      .put<any>(`orders/${id}`, order)
      .pipe(catchError(this.handleError));
  }
  generateNewPayULink(id, payUData) {
    return this.http
      .put<any>(`orders/payu/${id}`, payUData)
      .pipe(catchError(this.handleError));
  }
  updateOrderPayUData(id, orderData) {
    return this.http
      .put<any>(`orders/update/${id}`, orderData)
      .pipe(catchError(this.handleError));
  }
  removeOrder(id: number) {
    return this.http
      .delete<any>(`orders/${id}`)
      .pipe(catchError(this.handleError));
  }
  findPersonFromHS(nameHS: string) {
    return this.http
      .post<any>(`contact/find`, { name: nameHS })
      .pipe(catchError(this.handleError));
  }
  findDealsFromHS(dealName: string) {
    return this.http.post<any>(`orders/getDealsList`, { text: dealName }).pipe(
      map((resp) => {
        return resp.results;
      }),
      catchError(this.handleError)
    );
  }
  getContactCompanyByDeal(dealID) {
    return this.http
      .get<any>(`orders/deal-contact-company/${dealID}`)
      .pipe(catchError(this.handleError));
  }
  addPersonToNoNameTicket(personData) {
    return this.http
      .post<any>("orders/addpersontononameticket", personData)
      .pipe(catchError(this.handleError));
  }
  addNewPersonToOrder(newPerson) {
    return this.http
      .post<any>("orders/addnewpersontoorder", newPerson)
      .pipe(catchError(this.handleError));
  }
  editPersonTicketInOrder(editPerson) {
    return this.http
      .put<any>(`orders/editTicketPersonInOrder/${editPerson.id}`, editPerson)
      .pipe(catchError(this.handleError));
  }
  generateInvioce(details) {
    return this.http
      .post<any>("orders/invoice", details)
      .pipe(catchError(this.handleError));
  }
  transformInvoiceToVat(dataInvoice) {
    return this.http
      .post<any>(`orders/invoice/transform`, dataInvoice)
      .pipe(catchError(this.handleError));
  }
  updateInvoice(details, invoice_id) {
    return this.http
      .patch<any>(`orders/invoice/${invoice_id}`, details)
      .pipe(catchError(this.handleError));
  }
  updateInvoiceDate(toUpdate) {
    return this.http
      .post<any>(`orders/invoice/date`, toUpdate)
      .pipe(catchError(this.handleError));
  }
  getInvoiceById(id, company, order) {
    return this.http
      .get<any>(`orders/invoice/${company.id}/${order.id}/${id}`)
      .pipe(catchError(this.handleError));
  }
  removeInvoice(objInvoice) {
    return this.http
      .put<any>(`orders/invoice/${objInvoice.invoice_id}`, objInvoice)
      .pipe(catchError(this.handleError));
  }
  updateOrderPerson(idPerson, obj) {
    return this.http
      .put<any>(`orders/personUpdate/${idPerson}`, obj)
      .pipe(catchError(this.handleError));
  }
  sendInvoice(obj) {
    return this.http
      .post<any>(`orders/invoice/send`, obj)
      .pipe(catchError(this.handleError));
  }
  // lista serwisów dla pobierania parametrów przy dodawaniu zamówienia
  getProtuctList() {
    return this.http
      .get<any>(`training/active`)
      .pipe(catchError(this.handleError));
  }
  getTrainingDateByProduct(id) {
    return this.http
      .get<any>(`training-date/activelist/${id}`)
      .pipe(catchError(this.handleError));
  }
  saveNewOrder(newOrder, participants) {
    return this.http
      .post<any>(`orders/save/order`, { newOrder, participants })
      .pipe(catchError(this.handleError));
  }
  getCompanyDataGUS(nip) {
    return this.http
      .post<any>(`gus`, { nip })
      .pipe(catchError(this.handleError));
  }
  saveNewInvoicePosition(newPosition) {
    return this.http
      .post<any>(`orders/invoice-positions`, newPosition)
      .pipe(catchError(this.handleError));
  }
  editInvoicePosition(editPosition) {
    return this.http
      .put<any>(`orders/invoice-positions/${editPosition.id}`, editPosition)
      .pipe(catchError(this.handleError));
  }
  addNewNoteInOrder(newNote) {
    return this.http
      .post<any>(`orders/add-note`, newNote)
      .pipe(catchError(this.handleError));
  }
  editNoteInOrder(noteToEdit) {
    return this.http
      .patch<any>(`orders/edit-note/${noteToEdit.id}`, noteToEdit)
      .pipe(catchError(this.handleError));
  }
  searchDeals(dataToSearch) {
    return this.http
      .post<any>(`orders/search-deals`, dataToSearch)
      .pipe(catchError(this.handleError));
  }
  refreshMailNotification(notificationId: string) {
    return this.http
      .get<any>(`orders/refresh-mail-notification/${notificationId}`)
      .pipe(catchError(this.handleError));
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.message);
    return throwError(error);
  }
}
