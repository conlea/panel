import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { map, catchError } from "rxjs/operators";
import { UserData } from "./contact-list/contact-list.component";

@Injectable({
  providedIn: "root",
})
export class ContactService {
  constructor(private http: HttpClient) {}

  contactList(): Observable<any> {
    return this.http.get<any>("contact").pipe(
      map((resp) => {
        let contacts = [];
        resp.contacts.forEach((user) => {
          let mail = "";
          if (!user.properties.firstname) {
            user.properties.firstname = { value: "" };
          }
          if (!user.properties.lastname) {
            user.properties.lastname = { value: "" };
          }
          if (!user.properties.company) {
            user.properties.company = { value: "" };
          }
          if (!user.properties.phone) {
            user.properties.phone = { value: "" };
          }
          // console.log(user['identity-profiles'][0]['identities'].length);
          user["identity-profiles"][0]["identities"].forEach((identities) => {
            if (identities.type == "EMAIL") {
              mail = identities.value;
            }
          });
          contacts.push({
            id: user.vid,
            firstname: user.properties.firstname.value,
            lastname: user.properties.lastname.value,
            company: user.properties.company.value,
            email: mail,
            phone: user.properties.phone.value,
          });
        });
        return contacts;
      }),
      catchError(catchError(this.handleError))
    );
  }
  addNewContact(newContact) {
    return this.http
      .post<any>("contact/addContact", newContact)
      .pipe(catchError(this.handleError));
  }
  findPersonFromHS(nameHS: string) {
    return this.http.post<any>(`contact/find`, { name: nameHS }).pipe(
      map((resp) => {
        let contacts = [];
        resp.contacts.forEach((user) => {
          let mail = "";
          if (!user.properties.firstname) {
            user.properties.firstname = { value: "" };
          }
          if (!user.properties.lastname) {
            user.properties.lastname = { value: "" };
          }
          if (!user.properties.company) {
            user.properties.company = { value: "" };
          }
          if (!user.properties.phone) {
            user.properties.phone = { value: "" };
          }
          // console.log(user['identity-profiles'][0]['identities'].length);
          user["identity-profiles"][0]["identities"].forEach((identities) => {
            if (identities.type == "EMAIL") {
              mail = identities.value;
            }
          });
          contacts.push({
            id: user.vid,
            firstname: user.properties.firstname.value,
            lastname: user.properties.lastname.value,
            company: user.properties.company.value,
            email: mail,
            phone: user.properties.phone.value,
          });
        });
        return contacts;
      }),
      catchError(catchError(this.handleError))
    );
  }
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error.message);
    return throwError(error);
  }
}
