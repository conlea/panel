import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-costs',
  templateUrl: './edit-costs.component.html',
  styleUrls: ['./edit-costs.component.scss']
})
export class EditCostsComponent implements OnInit {

  constructor(public dialogEvent: MatDialogRef<EditCostsComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  formOptions: FormGroup;
  availableDoscountCode: any = [];
  personSaveInOrder = 0;
  training: any = {};

  ngOnInit(): void {
    this.availableDoscountCode = this.data.availableDoscountCode;
    this.training = this.data.training;
    this.personSaveInOrder = this.data.trainingPerson - this.data.order.noNameTickets;
    this.formOptions = new FormGroup({
      take_exam: new FormControl(this.data.order.take_exam),
      priceExam: new FormControl(this.data.order.priceExam),
      take_book: new FormControl(this.data.order.take_book),
      price_book: new FormControl(this.data.order.price_book),
      take_take2: new FormControl(this.data.order.take_take2),
      price_Take2_exam: new FormControl(this.data.order.price_Take2_exam),
      priceTraining: new FormControl(this.data.order.priceTraining),
      totalPrice: new FormControl({ value: this.data.order.totalPrice, disabled: true }),
      noNameTickets: new FormControl(this.data.order.noNameTickets),
      idDiscountCode: new FormControl(this.data.order.idDiscountCode),
    });
    if (!this.data.order.take_exam) {
      this.formOptions.get('priceExam').disable();
    }
    if (!this.data.order.take_book) {
      this.formOptions.get('price_book').disable();
    }
    if (!this.data.order.take_take2) {
      this.formOptions.get('price_Take2_exam').disable();
    }
  }
  priceChanged() {
    console.log('change');
    let totalPrice = 0;
    let priceTraining = this.formOptions.get('priceTraining').value;
    let priceExam = this.formOptions.get('priceExam').value;
    let priceBook = this.formOptions.get('price_book').value;
    let priceTake2 = this.formOptions.get('price_Take2_exam').value;
    let personToSum = this.personSaveInOrder + this.formOptions.get('noNameTickets').value;

    if (this.formOptions.get('idDiscountCode').value) {
      let selectDiscount = this.availableDoscountCode.find(x => x.id == this.formOptions.get('idDiscountCode').value);
      if (selectDiscount.product == 'training') {
        if (selectDiscount.type == 'percent') {
          priceTraining = (priceTraining - (priceTraining * selectDiscount.code_value / 100)) * personToSum;
        } else {
          priceTraining = priceTraining * personToSum - selectDiscount.code_value;
        }
      }

      if (selectDiscount.product == 'exam') {
        if (selectDiscount.type == 'percent') {
          priceExam = priceExam - (priceExam * selectDiscount.code_value / 100);
        } else {
          priceExam = priceExam * personToSum - selectDiscount.code_value;
        }
      }
      if (selectDiscount.product == 'book') {
        if (selectDiscount.type == 'percent') {
          priceBook = priceBook - (priceBook * selectDiscount.code_value / 100);
        } else {
          priceBook = priceBook * personToSum - selectDiscount.code_value;
        }
      }
    } else {
      priceTraining = (priceTraining * personToSum * 1.23);
    }

    totalPrice = priceTraining;
    // console.log(this.formOptions.get('take_exam').value);
    if (this.formOptions.get('take_exam').value) {
      this.formOptions.get('priceExam').enable();
      totalPrice += (priceExam * personToSum * 1.23);
    } else {
      this.formOptions.get('priceExam').disable();
    }
    if (this.formOptions.get('take_book').value) {
      this.formOptions.get('price_book').enable();
      if (this.training.book_iso != '') {
        totalPrice += (priceBook * personToSum * 1.05);
      } else {
        totalPrice += (priceBook * personToSum * 1.23);
      }
    } else {
      this.formOptions.get('price_book').disable();
    }
    if (this.formOptions.get('take_take2').value) {
      this.formOptions.get('price_Take2_exam').enable();
      totalPrice += (priceTake2 * personToSum * 1.23);
    } else {
      this.formOptions.get('price_Take2_exam').disable();
    }
    console.log(totalPrice);
    this.formOptions.controls['totalPrice'].setValue(totalPrice);
  }
  editCosts() {
    let dataPrice = this.formOptions.value;
    dataPrice.totalPrice = this.formOptions.get('totalPrice').value;
    if (dataPrice.take_exam) {
      dataPrice.take_exam = 1;
    } else {
      dataPrice.take_exam = 0;
    }
    if (dataPrice.take_book) {
      dataPrice.take_book = 1;
    } else {
      dataPrice.take_book = 0;
    }
    if (dataPrice.take_take2) {
      dataPrice.take_take2 = 1;
    } else {
      dataPrice.take_take2 = 0;
    }
    this.dialogEvent.close(dataPrice);
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
