import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-change-data-dv',
  templateUrl: './change-data-dv.component.html',
  styleUrls: ['./change-data-dv.component.scss']
})
export class ChangeDataDVComponent implements OnInit {

  formOptions: FormGroup;
  payerIs = 0;

  constructor(public dialogEvent: MatDialogRef<ChangeDataDVComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    if (this.data.order.isCompanyPayer > 0) {
      this.payerIs = 1;
    }
    if (this.data.order.isPersonPayer > 0) {
      this.payerIs = 0;
    }
    this.formOptions = new FormGroup({
      payer: new FormControl(this.payerIs),
      companyName: new FormControl(this.data.order.companyName),
      companyStreet: new FormControl(this.data.order.companyStreet),
      companyCity: new FormControl(this.data.order.companyCity),
      companyPostCode: new FormControl(this.data.order.companyPostCode),
      companyVatID: new FormControl(this.data.order.companyVatID),

      personStreet: new FormControl(this.data.order.personStreet),
      personCity: new FormControl(this.data.order.personCity),
      personPostCode: new FormControl(this.data.order.personPostCode)
    });
  }
  changePayer() {
    if (this.formOptions.get('payer').value > 0) {
      this.payerIs = 1;
    } else {
      this.payerIs = 0;
    }
  }
  editData() {
    let dataToUpdate = this.formOptions.value;
    if (this.formOptions.get('payer').value > 0) { // gdzy jest firma
      dataToUpdate.isCompanyPayer = 1;
      dataToUpdate.isPersonPayer = 0;
    }
    if (this.formOptions.get('payer').value == 0) { // gdy jest os fizyczna
      dataToUpdate.isCompanyPayer = 0;
      dataToUpdate.isPersonPayer = 1;
    }
    delete dataToUpdate.payer;
    this.dialogEvent.close(dataToUpdate);
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
