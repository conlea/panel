import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TrainingDatesService } from '../../training-dates.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-add-training-ticket',
  templateUrl: './add-training-ticket.component.html',
  styleUrls: ['./add-training-ticket.component.scss']
})
export class AddTrainingTicketComponent implements OnInit {

  formOptionsTicket: FormGroup;
  isTicketLoading = false;
  ticketData: any = {};
  ticketAttr = [];
  arrayToDB = {};
  currencyList = [];

  @ViewChild('formDirective2')
  formDirective2: FormGroupDirective;

  constructor(private toastr: ToastrService, private trainingDateDetails: TrainingDatesService, public dialogEvent: MatDialogRef<AddTrainingTicketComponent>, @Inject(MAT_DIALOG_DATA) public data, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.ticketAttr = this.data.ticketAttr;
    this.currencyList = this.data.currency.split(',');

    // console.log(y);
    this.formOptionsTicket = new FormGroup({
      active: new FormControl(1),
      isPublic: new FormControl(1),
      trainingDates_id: new FormControl(this.data.trainingDateId),
      name_pl: new FormControl('', Validators.required),
      name_en: new FormControl('', Validators.required),
      date_start: new FormControl('', Validators.required),
      date_end: new FormControl('', Validators.required),
      rabat: new FormControl(0, Validators.required),
      useLimit: new FormControl('', Validators.required),
      isUse: new FormControl(0),
      payNow: new FormControl(0),
      ticket_attr: new FormControl('')
    });
    this.currencyList.forEach(currency => {
      this.formOptionsTicket.addControl('price_' + currency, new FormControl('', Validators.required));
      if (this.data.ticket) {
        this.formOptionsTicket.controls['price_' + currency].setValue(this.data.ticket['price_' + currency]);
      }
    });
    if (this.data.ticket) {
      this.ticketData = this.data.ticket;
      if (this.data.copy) {
        this.formOptionsTicket.controls['isUse'].setValue(0);
      } else {
        this.formOptionsTicket.controls['isUse'].setValue(this.ticketData.isUse);
      }
      this.formOptionsTicket.controls['active'].setValue(1);
      this.formOptionsTicket.controls['trainingDates_id'].setValue(this.ticketData.trainingDates_id);
      this.formOptionsTicket.controls['name_pl'].setValue(this.ticketData.name_pl);
      this.formOptionsTicket.controls['name_en'].setValue(this.ticketData.name_en);
      this.formOptionsTicket.controls['date_start'].setValue(this.ticketData.date_start);
      this.formOptionsTicket.controls['date_end'].setValue(this.ticketData.date_end);
      // this.formOptionsTicket.controls['price'].setValue(this.ticketData.price);
      // this.formOptionsTicket.controls['price_EUR'].setValue(this.ticketData.price_EUR);
      // this.formOptionsTicket.controls['price_USD'].setValue(this.ticketData.price_USD);
      // this.formOptionsTicket.controls['price_GBP'].setValue(this.ticketData.price_GBP);
      this.formOptionsTicket.controls['rabat'].setValue(this.ticketData.rabat);
      this.formOptionsTicket.controls['useLimit'].setValue(this.ticketData.useLimit);
      this.formOptionsTicket.controls['payNow'].setValue(this.ticketData.payNow);
      this.formOptionsTicket.controls['isPublic'].setValue(this.ticketData.isPublic);
    }

    if (this.ticketData.ticket_attr) {
      let dataAttr = JSON.parse(this.ticketData.ticket_attr);
      this.ticketAttr.forEach(attr => {
        this.formOptionsTicket.addControl(`attr_${attr.id}`, new FormControl(dataAttr[attr.id]));
      });
    } else {
      this.ticketAttr.forEach(attr => {
        this.formOptionsTicket.addControl(`attr_${attr.id}`, new FormControl(false));
      });
    }
  }
  addTicketTraining() {
    if (this.formOptionsTicket.valid) {
      this.arrayToDB = {};
      this.ticketAttr.forEach(attr => {
        this.arrayToDB[attr.id] = this.formOptionsTicket.get(`attr_${attr.id}`).value;
        this.formOptionsTicket.removeControl(`attr_${attr.id}`);
      });
      this.formOptionsTicket.controls['ticket_attr'].setValue(JSON.stringify(this.arrayToDB));
      let dataToSend = this.formOptionsTicket.value;
      dataToSend.date_start = this.datePipe.transform(this.formOptionsTicket.get('date_start').value, 'yyyy-MM-dd');
      dataToSend.date_end = this.datePipe.transform(this.formOptionsTicket.get('date_end').value, 'yyyy-MM-dd');
      dataToSend.isUse = 0;
      this.isTicketLoading = true;
      this.trainingDateDetails.addTicketTrainingDate(dataToSend).subscribe(resp => {
        this.isTicketLoading = false;
        this.dialogEvent.close(resp);
        this.toastr.success(`Dodano bilet ${resp.name_pl}`, 'Success');
      }, err => {
        this.isTicketLoading = false;
        this.toastr.error('Wystąpił błąd podczas dodawania biletu FM', 'Błąd');
      });
    } else {
      this.toastr.error('Uzupełnij wszystkie wymagane pola', 'Błąd');
    }
  }
  editTicketTraining() {
    if (this.formOptionsTicket.valid) {
      /////// zapis atrybutów do DB /////////
      this.arrayToDB = {};
      this.ticketAttr.forEach(attr => {
        this.arrayToDB[attr.id] = this.formOptionsTicket.get(`attr_${attr.id}`).value;
        this.formOptionsTicket.removeControl(`attr_${attr.id}`);
      });
      this.formOptionsTicket.controls['ticket_attr'].setValue(JSON.stringify(this.arrayToDB));
      /////// end zapis attrybutów do DB //////
      let dataToSend = this.formOptionsTicket.value;
      dataToSend.id = this.data.ticket.id;
      dataToSend.date_start = this.datePipe.transform(this.formOptionsTicket.get('date_start').value, 'yyyy-MM-dd');
      dataToSend.date_end = this.datePipe.transform(this.formOptionsTicket.get('date_end').value, 'yyyy-MM-dd');
      this.isTicketLoading = true;
      this.trainingDateDetails.updateTicketTrainingDate(dataToSend).subscribe(resp => {
        this.isTicketLoading = false;
        this.toastr.success('Zaktualizowano dane biletu', 'Success');
        this.dialogEvent.close(resp);
      }, err => {
        this.isTicketLoading = false;
        this.toastr.error('Błąd podczas edycji danych biletu', 'Błąd');
      });
    } else {
      this.toastr.error('Uzupełnij wszystkie wymagane pola', 'Błąd');
    }
  }
  removeTicket() {
    this.ticketData.active = 0;
    delete this.ticketData['userCreate'];
    delete this.ticketData['userEdit'];
    this.trainingDateDetails.updateTicketTrainingDate(this.ticketData).subscribe(resp => {
      this.isTicketLoading = false;
      this.toastr.success('Usuniętno bilet', 'Success');
      this.dialogEvent.close(resp);
    }, err => {
      this.isTicketLoading = false;
      this.toastr.error('Błąd podczas usuwania biletu', 'Błąd');
    });
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
