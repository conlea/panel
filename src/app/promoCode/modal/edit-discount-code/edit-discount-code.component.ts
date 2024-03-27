import { DiscountService } from './../../discount.service';
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit-discount-code',
  templateUrl: './edit-discount-code.component.html',
  styleUrls: ['./edit-discount-code.component.scss']
})
export class EditDiscountCodeComponent implements OnInit {

  formOptions: FormGroup;
  discountData: any = {};
  isDiscountLoading = false;
  trainingDateActive: any = [];
  trainingList: any = [];
  places: any = [];

  constructor(private toastr: ToastrService, public DiscountService: DiscountService, public dialogEvent: MatDialogRef<EditDiscountCodeComponent>, @Inject(MAT_DIALOG_DATA) public data, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.trainingDateActive = this.data.trainingDateActive;
    this.trainingList = this.data.trainingList;
    this.places = this.data.places;
    this.formOptions = new FormGroup({
      id: new FormControl(''),
      code_name: new FormControl('', [Validators.required, Validators.maxLength(25), Validators.pattern('^[a-zA-Z0-9*#*_*-*+]+$')]),
      code_value: new FormControl('0', [Validators.required, Validators.min(1)]),
      type: new FormControl('', Validators.required),
      date_start: new FormControl('', Validators.required),
      date_end: new FormControl('', Validators.required),
      useLimit: new FormControl('0', [Validators.required, Validators.min(1)]),
      product: new FormControl('', Validators.required),
      trainingDate_id: new FormControl(''),
      training_id: new FormControl(''),
      place_id: new FormControl(''),
      isUse: new FormControl(''),
      active: new FormControl(false)
    });

    if (this.data.editDiscount) {
      this.discountData = this.data.editDiscount;
      this.formOptions.controls['id'].setValue(this.discountData.id);
      this.formOptions.controls['code_name'].setValue(this.discountData.code_name);
      this.formOptions.controls['code_value'].setValue(this.discountData.code_value);
      this.formOptions.controls['type'].setValue(this.discountData.type);
      this.formOptions.controls['date_start'].setValue(this.discountData.date_start);
      this.formOptions.controls['date_end'].setValue(this.discountData.date_end);
      this.formOptions.controls['useLimit'].setValue(this.discountData.useLimit);
      this.formOptions.controls['product'].setValue(this.discountData.product);
      this.formOptions.controls['trainingDate_id'].setValue(this.discountData.trainingDate_id);
      this.formOptions.controls['training_id'].setValue(this.discountData.training_id);
      this.formOptions.controls['place_id'].setValue(this.discountData.place_id);
      this.formOptions.controls['isUse'].setValue(this.discountData.isUse);
      this.formOptions.controls['active'].setValue(this.discountData.active);
    }
  }
  changeType(event) {
    this.formOptions.removeControl('code_value');
    if (event.value == 'percent') {
      this.formOptions.addControl('code_value', new FormControl('', [Validators.required, Validators.min(1), Validators.max(100)]));
    } else {
      this.formOptions.addControl('code_value', new FormControl('', [Validators.required, Validators.min(1)]));
    }
  }
  changeTrainingDate(event) {
    console.log('zmiana terminu szkolenia');
  }
  addNewDiscount() {
    if (this.formOptions.valid) {
      let dataToSend = this.formOptions.value;
      dataToSend.date_start = this.datePipe.transform(this.formOptions.get('date_start').value, 'yyyy-MM-dd');
      dataToSend.date_end = this.datePipe.transform(this.formOptions.get('date_end').value, 'yyyy-MM-dd');
      dataToSend.isUse = 0;
      this.isDiscountLoading = true;
      this.DiscountService.addDiscount(dataToSend).subscribe(resp => {
        this.isDiscountLoading = false;
        this.dialogEvent.close(resp);
        this.toastr.success(`Dodano nowy kod rabatowy`, 'Success');
      }, err => {
        this.isDiscountLoading = false;
        this.toastr.error('Wystąpił błąd podczas dodawania kodu rabatowego', 'Błąd');
      });
    } else {
      this.toastr.error('Uzupełnij wszystkie wymagane pola', 'Błąd');
    }
  }
  editDiscount() {
    if (this.formOptions.valid) {
      let dataToSend = this.formOptions.value;
      dataToSend.date_start = this.datePipe.transform(this.formOptions.get('date_start').value, 'yyyy-MM-dd');
      dataToSend.date_end = this.datePipe.transform(this.formOptions.get('date_end').value, 'yyyy-MM-dd');
      // delete dataToSend['userCreate'];
      // delete dataToSend['userEdit'];
      this.isDiscountLoading = true;
      this.DiscountService.editDiscount(dataToSend).subscribe(resp => {
        this.isDiscountLoading = false;
        this.dialogEvent.close(resp);
        this.toastr.success(`Zapisano kod rabatowy`, 'Success');
      }, err => {
        console.error(err);
        this.isDiscountLoading = false;
        this.toastr.error('Wystąpił błąd podczas edycji kodu rabatowego', 'Błąd');
      });
    } else {
      this.toastr.error('Uzupełnij wszystkie wymagane pola', 'Błąd');
    }
  }
  removeDiscount() {
    let dataToSend = this.formOptions.value;
    this.DiscountService.editDiscount({ id: dataToSend.id, active: 0 }).subscribe(resp => {
      this.isDiscountLoading = false;
      this.dialogEvent.close(resp);
      this.toastr.success(`Zapisano kod rabatowy`, 'Success');
    }, err => {
      console.error(err);
      this.isDiscountLoading = false;
      this.toastr.error('Wystąpił błąd podczas edycji kodu rabatowego', 'Błąd');
    });
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
