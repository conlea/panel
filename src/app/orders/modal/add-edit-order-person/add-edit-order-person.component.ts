import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ToastrService } from "ngx-toastr";
import { OrderService } from "../../order.service";

@Component({
  selector: "app-add-edit-order-person",
  templateUrl: "./add-edit-order-person.component.html",
  styleUrls: ["./add-edit-order-person.component.scss"],
})
export class AddEditOrderPersonComponent implements OnInit {
  invoiceLoading = false;
  formOptions: FormGroup;
  training: any = {};
  tickets: any = {};
  order: any = {};
  trainingDate: any = {};
  personTicket: any = {};
  personChoiseId = "";
  filteredOptions;

  constructor(
    public dialogEvent: MatDialogRef<AddEditOrderPersonComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private orderService: OrderService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.tickets = this.data.tickets;
    this.training = this.data.training;
    this.order = this.data.order;
    this.trainingDate = this.data.trainingDate;
    this.personTicket = this.data.personTicket;

    this.formOptions = new FormGroup({
      ticketUse_id: new FormControl(""),
      take_exam: new FormControl(""),
      take_book: new FormControl(""),
      take_take2: new FormControl(""),
      getPerson: new FormControl(""),
    });

    if (this.personTicket) {
      this.formOptions.controls["ticketUse_id"].setValue(
        this.personTicket.ticketUse_id
      );
      this.formOptions.controls["take_exam"].setValue(
        this.personTicket.take_exam
      );
      this.formOptions.controls["take_book"].setValue(
        this.personTicket.take_book
      );
      this.formOptions.controls["take_take2"].setValue(
        this.personTicket.take_take2
      );
    }
    if (this.training.is_exam_required) {
      this.formOptions.controls["take_exam"].setValue(1);
      this.formOptions.get("take_exam").disable();
    }
    if (this.training.is_book_required) {
      this.formOptions.controls["take_book"].setValue(1);
      this.formOptions.get("take_book").disable();
    }
    if (
      (this.training.is_exam_available == 0 ||
        this.training.is_exam_available == null) &&
      (this.training.is_book_available == 0 ||
        this.training.is_book_available == null) &&
      (this.training.is_Take2_available == 0 ||
        this.training.is_Take2_available == null)
    ) {
      this.formOptions.controls["ticketUse_id"].setValidators([
        Validators.required,
      ]);
      this.formOptions.controls["ticketUse_id"].updateValueAndValidity();
    }
  }

  addNewPerson() {
    if (this.formOptions.valid) {
      let newPerson = this.formOptions.getRawValue();
      newPerson.order_id = this.order.id;
      newPerson.trainingDate_id = this.trainingDate.id;
      newPerson.isParticipant = 1;
      newPerson.isReportingPerson = 0;
      newPerson.participant_role = 1;
      if (this.personChoiseId) {
        newPerson.personHS_id = this.personChoiseId;
      }
      delete newPerson.getPerson;
      switch (this.order.status_id) {
        case 1:
          newPerson.status = "PROVISIONAL";
          break;
        case 2:
          newPerson.status = "CONFIRMED";
          break;
        case 3:
          newPerson.status = "CONFIRMED";
          break;
        case 4:
          newPerson.status = "CANCEL";
          break;
        default:
          newPerson.status = "PROVISIONAL";
          break;
      }
      this.dialogEvent.close(newPerson);
    }
  }
  editPersonTicket() {
    if (this.formOptions.valid) {
      let editTicketPerson = this.formOptions.getRawValue();
      editTicketPerson.id = this.personTicket.id;
      if (this.personChoiseId) {
        editTicketPerson.personHS_id = this.personChoiseId;
        editTicketPerson.order_id = this.order.id;
      }
      delete editTicketPerson.getPerson;
      this.dialogEvent.close(editTicketPerson);
    }
  }

  onSearchChange(event) {
    this.personChoiseId = "";
    if (event.length > 3) {
      this.orderService.findPersonFromHS(event).subscribe(
        (resp) => {
          this.filteredOptions = resp.contacts;
        },
        (err) => {
          this.filteredOptions = [];
        }
      );
    }
  }
  onEnter(newId) {
    this.personChoiseId = newId;
  }

  editPerson() {}
  exitDialog() {
    this.dialogEvent.close();
  }
}
