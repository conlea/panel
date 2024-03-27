import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../order.service";

@Component({
  selector: "app-deal-persons",
  templateUrl: "./deal-persons.component.html",
  styleUrls: ["./deal-persons.component.scss"],
})
export class DealPersonsComponent implements OnInit {
  personsList: any = [];
  idReportingPerson = "";
  seasons: string[] = ["Winter", "Spring", "Summer", "Autumn"];

  constructor(
    public dialogEvent: MatDialogRef<DealPersonsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    console.log(this.data.contacts);

    this.data.contacts.forEach((person, index) => {
      if (index == 0) {
        this.idReportingPerson = person.vid;
      }
      this.personsList.push({
        personHS_id: person.vid,
        firstName: person.properties.firstname?.value,
        lastName: person.properties.lastname?.value,
        email: person.properties.email?.value,
        isParticipant: true,
      });
    });
  }
  radioChange(value) {
    this.personsList.forEach((person) => {
      person.isParticipant = true;
    });
  }
  removePerson(person) {
    let personIndex = this.personsList.findIndex((x) => {
      return x.personHS_id == person.personHS_id;
    });
    if (personIndex >= 0) {
      this.personsList.splice(personIndex, 1);
    }
  }
  savePersons() {
    this.personsList.forEach((person) => {
      if (person.personHS_id == this.idReportingPerson) {
        person.isReportingPerson = true;
      } else {
        person.isReportingPerson = false;
      }
    });
    console.log(this.personsList);
    this.dialogEvent.close(this.personsList);
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
