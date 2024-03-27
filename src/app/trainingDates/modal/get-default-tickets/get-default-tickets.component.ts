import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-get-default-tickets",
  templateUrl: "./get-default-tickets.component.html",
  styleUrls: ["./get-default-tickets.component.scss"],
})
export class GetDefaultTicketsComponent implements OnInit {
  defaultTickets: any = [];
  addDefaultTickets: boolean = false;
  formOptionsTicket: FormGroup;
  newTraining: any = {};
  dateNow = new Date();
  dateMax = new Date();

  constructor(
    public dialogEvent: MatDialogRef<GetDefaultTicketsComponent>,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.newTraining = this.data.newTraining;
    console.log(this.newTraining);

    this.dateMax = new Date(this.newTraining.datestart);
    this.dateMax.setDate(this.dateMax.getDate() - 1);
    this.defaultTickets = this.data.defaultTicketsList;
    this.formOptionsTicket = new FormGroup({});
    this.defaultTickets.forEach((ticket, index) => {
      delete ticket["training_id"];
      this.formOptionsTicket.addControl(
        "date_start_" + ticket.id,
        new FormControl("", Validators.required)
      );
      this.formOptionsTicket.addControl(
        "date_end_" + ticket.id,
        new FormControl("", Validators.required)
      );
    });
  }

  getDefaultTickets() {
    this.addDefaultTickets = true;
    this.data.header = "Uzupełnij daty ważności dla poszczególnych pakietów";
  }
  removeDefaultTicket(index, id) {
    this.formOptionsTicket.removeControl("date_start_" + id);
    this.formOptionsTicket.removeControl("date_end_" + id);
    this.defaultTickets.splice(index, 1);
  }
  saveDefaultTicketsDate() {
    console.log(this.formOptionsTicket);

    if (this.formOptionsTicket.valid) {
      this.defaultTickets.forEach((ticket, index) => {
        ticket.date_start = this.datePipe.transform(
          this.formOptionsTicket.controls["date_start_" + ticket.id].value,
          "yyyy-MM-dd"
        );
        ticket.date_end = this.datePipe.transform(
          this.formOptionsTicket.controls["date_end_" + ticket.id].value,
          "yyyy-MM-dd"
        );
        delete ticket["id"];
      });
      this.dialogEvent.close(this.defaultTickets);
    } else {
      this.toastr.error("Wypełnij wszystkie wymagane pola", "Błąd");
    }
  }
  getBack() {
    this.data.header = "Czy dodać domyślne pakiety cenowe";
    this.addDefaultTickets = false;
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
