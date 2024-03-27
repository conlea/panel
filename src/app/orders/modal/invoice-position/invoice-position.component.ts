import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-invoice-position',
  templateUrl: './invoice-position.component.html',
  styleUrls: ['./invoice-position.component.scss']
})
export class InvoicePositionComponent implements OnInit {

  formOptions: FormGroup;

  constructor(public dialogEvent: MatDialogRef<InvoicePositionComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      order_id: new FormControl(this.data.order.id),
      countProduct: new FormControl(1, [Validators.required]),
      nameProduct: new FormControl("", [Validators.required]),
      priceProduct: new FormControl(0, [Validators.required]),
    })
    if (this.data.invoicePosition) {
      this.formOptions.addControl('id', new FormControl(this.data.invoicePosition.id));
      this.formOptions.controls['countProduct'].setValue(this.data.invoicePosition.countProduct);
      this.formOptions.controls['nameProduct'].setValue(this.data.invoicePosition.nameProduct);
      this.formOptions.controls['priceProduct'].setValue(this.data.invoicePosition.priceProduct);
    }
  }
  addNewPosition() {
    if (this.formOptions.valid) {
      this.dialogEvent.close(this.formOptions.value);
    }
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
