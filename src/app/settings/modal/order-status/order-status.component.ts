import { Color } from '@angular-material-components/color-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {

  formOptions: FormGroup;

  constructor(public dialogEvent: MatDialogRef<OrderStatusComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      name: new FormControl('', Validators.required),
      color_status: new FormControl('', Validators.required),
    });
    if (this.data.editStatusOrder) {
      let color: any;
      if (this.data.editStatusOrder.color_status) {
        let colorObj = JSON.parse(this.data.editStatusOrder.color_status);
        color = new Color(colorObj.r, colorObj.g, colorObj.b, colorObj.a);
      }
      this.formOptions.controls['name'].setValue(this.data.editStatusOrder.name);
      this.formOptions.controls['color_status'].setValue(color);
    }
  }
  editStatusOrder() {
    if (this.formOptions.valid) {
      this.formOptions.controls['color_status'].setValue(JSON.stringify(this.formOptions.value.color_status));
      this.dialogEvent.close(this.formOptions.value);
    }
  }
  exitDialog() {
    this.dialogEvent.close();
  }


}
