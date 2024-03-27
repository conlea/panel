import { DatePipe } from "@angular/common";
import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { TrainingService } from "../../training.service";

@Component({
  selector: "app-add-edit-default-tickets",
  templateUrl: "./add-edit-default-tickets.component.html",
  styleUrls: ["./add-edit-default-tickets.component.scss"],
})
export class AddEditDefaultTicketsComponent implements OnInit {
  formOptionsTicket: FormGroup;
  isTicketLoading = false;
  ticketData: any = {};
  ticketAttr = [];
  arrayToDB = {};
  currencyList = [];

  constructor(
    private trainingService: TrainingService,
    private toastr: ToastrService,
    public dialogEvent: MatDialogRef<AddEditDefaultTicketsComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.ticketAttr = this.data.ticketAttr;
    this.currencyList = this.data.currency;
    this.ticketData = this.data.ticket;

    this.formOptionsTicket = new FormGroup({
      active: new FormControl(1),
      isPublic: new FormControl(1),
      training_id: new FormControl(this.data.training_id),
      name_pl: new FormControl("", Validators.required),
      name_en: new FormControl("", Validators.required),
      // valid_from: new FormControl("", Validators.required),
      // valid_until: new FormControl("", Validators.required),
      // date_start: new FormControl("", Validators.required),
      // date_end: new FormControl("", Validators.required),
      rabat: new FormControl(0, Validators.required),
      useLimit: new FormControl("", Validators.required),
      payNow: new FormControl(0),
      ticket_attr: new FormControl(""),
    });
    this.currencyList.forEach((currency) => {
      this.formOptionsTicket.addControl(
        "price_" + currency.name,
        new FormControl("", Validators.required)
      );
      if (this.data.ticket) {
        this.formOptionsTicket.controls["price_" + currency.name].setValue(
          this.data.ticket["price_" + currency.name]
        );
      }
    });

    if (this.data.ticket) {
      this.formOptionsTicket.controls["active"].setValue(1);
      this.formOptionsTicket.controls["training_id"].setValue(
        this.ticketData.training_id
      );
      this.formOptionsTicket.controls["name_pl"].setValue(
        this.ticketData.name_pl
      );
      this.formOptionsTicket.controls["name_en"].setValue(
        this.ticketData.name_en
      );
      // this.formOptionsTicket.controls["valid_from"].setValue(
      //   this.ticketData.valid_from
      // );
      // this.formOptionsTicket.controls["valid_until"].setValue(
      //   this.ticketData.valid_until
      // );
      this.formOptionsTicket.controls["rabat"].setValue(this.ticketData.rabat);
      this.formOptionsTicket.controls["useLimit"].setValue(
        this.ticketData.useLimit
      );
      this.formOptionsTicket.controls["payNow"].setValue(
        this.ticketData.payNow
      );
      this.formOptionsTicket.controls["isPublic"].setValue(
        this.ticketData.isPublic
      );

      if (this.ticketData.ticket_attr) {
        let dataAttr = JSON.parse(this.ticketData.ticket_attr);
        this.ticketAttr.forEach((attr) => {
          this.formOptionsTicket.addControl(
            `attr_${attr.id}`,
            new FormControl(dataAttr[attr.id])
          );
        });
      }
    } else {
      this.ticketAttr.forEach((attr) => {
        this.formOptionsTicket.addControl(
          `attr_${attr.id}`,
          new FormControl(false)
        );
      });
    }
  }
  addDefaultTicketTraining() {
    if (this.formOptionsTicket.valid) {
      this.arrayToDB = {};
      this.ticketAttr.forEach((attr) => {
        this.arrayToDB[attr.id] = this.formOptionsTicket.get(
          `attr_${attr.id}`
        ).value;
        this.formOptionsTicket.removeControl(`attr_${attr.id}`);
      });
      this.formOptionsTicket.controls["ticket_attr"].setValue(
        JSON.stringify(this.arrayToDB)
      );
      let newDefaultTicket = this.formOptionsTicket.value;
      newDefaultTicket.training_id = this.data.trainingId;

      this.isTicketLoading = true;
      this.trainingService.addDefaultTicket(newDefaultTicket).subscribe(
        (resp) => {
          this.isTicketLoading = false;
          this.dialogEvent.close(resp);
          this.toastr.success(`Dodano nowy domyślny pakiet`, "Success");
        },
        (err) => {
          console.log(err);
          this.isTicketLoading = false;
          this.toastr.error(
            "Wystąpił błąd podczas dodawania domyślnego biletu",
            "Błąd"
          );
        }
      );
    } else {
      this.toastr.error("Uzupełnij wszystkie wymagane pola", "Błąd");
    }
  }
  editDefaultTicketTraining() {
    if (this.formOptionsTicket.valid) {
      /////// zapis atrybutów do DB /////////
      this.arrayToDB = {};
      this.ticketAttr.forEach((attr) => {
        this.arrayToDB[attr.id] = this.formOptionsTicket.get(
          `attr_${attr.id}`
        ).value;
        this.formOptionsTicket.removeControl(`attr_${attr.id}`);
      });
      this.formOptionsTicket.controls["ticket_attr"].setValue(
        JSON.stringify(this.arrayToDB)
      );
      /////// end zapis attrybutów do DB //////
      let defaultTicket = this.formOptionsTicket.value;
      defaultTicket.id = this.data.ticket.id;
      this.isTicketLoading = true;
      this.trainingService.editDefaultTicket(defaultTicket).subscribe(
        (resp) => {
          this.isTicketLoading = false;
          console.log(resp);
          this.toastr.success("Zaktualizowano dane pakietu", "Success");
          this.dialogEvent.close(resp);
        },
        (err) => {
          this.isTicketLoading = false;
          this.toastr.error("Błąd podczas edycji domyślnego pakietu", "Błąd");
        }
      );
    } else {
      this.toastr.error("Uzupełnij wszystkie wymagane pola", "Błąd");
    }
  }
  removeDefaultTicket() {
    this.isTicketLoading = true;
    this.trainingService
      .removeDefaultTicket(this.data.ticket.id, this.ticketData.training_id)
      .subscribe(
        (resp) => {
          this.isTicketLoading = false;
          this.toastr.success("Usunięto pakiet", "Success");
          this.dialogEvent.close(resp);
        },
        (err) => {
          this.isTicketLoading = false;
          this.toastr.error("Błąd podczas usuwania domyślnego pakietu", "Błąd");
        }
      );
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
