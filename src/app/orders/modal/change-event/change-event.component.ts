import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../order.service';

@Component({
  selector: 'app-change-event',
  templateUrl: './change-event.component.html',
  styleUrls: ['./change-event.component.scss']
})
export class ChangeEventComponent implements OnInit {

  formOptions: FormGroup;
  eventLoading = true;
  activeTrainingDate: any = {};
  activeEventList: any = [];
  productName: string = "";

  constructor(public dialogEvent: MatDialogRef<ChangeEventComponent>, @Inject(MAT_DIALOG_DATA) public data, private orderService: OrderService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.activeTrainingDate = this.data.activeTrainingDate;
    this.productName = this.data.productName;
    this.eventLoading = true;
    this.formOptions = new FormGroup({
      trainingDate_id: new FormControl(this.activeTrainingDate.id, Validators.required)
    });
    this.orderService.getTrainingDateByProduct(this.activeTrainingDate.product_id).subscribe(resp => {
      this.activeEventList = resp;
      this.eventLoading = false;
    }, err => {
      console.log(err);
      this.eventLoading = false;
    })
  }
  changeEventTerm() {
    if (this.formOptions.valid) {
      this.dialogEvent.close(this.formOptions.value);
    }
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
