import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TrainingDatesService } from '../../training-dates.service';

@Component({
  selector: 'app-add-cost-manual',
  templateUrl: './add-cost-manual.component.html',
  styleUrls: ['./add-cost-manual.component.scss']
})
export class AddCostManualComponent implements OnInit {

  formOptions: FormGroup;
  invoiceLoading = false;

  constructor(public dialogEvent: MatDialogRef<AddCostManualComponent>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService, private trainingDateDetails: TrainingDatesService) {
    this.formOptions = new FormGroup({
      active: new FormControl(1),
      trainingDate_id: new FormControl(data.trainingDate.id),
      cost_price: new FormControl("", Validators.required),
      cost_name: new FormControl("", Validators.required),
      isConfirmed: new FormControl(0)
    });
    if (data.cost) {
      this.formOptions.controls['cost_price'].setValue(this.data.cost.cost_price);
      this.formOptions.controls['cost_name'].setValue(this.data.cost.cost_name);
      this.formOptions.controls['isConfirmed'].setValue(this.data.cost.isConfirmed);
    }
  }

  ngOnInit(): void {
  }
  addCost() {
    if (this.formOptions.valid) {
      this.invoiceLoading = true;
      let newCost = this.formOptions.value;
      this.trainingDateDetails.addCostManual(newCost).subscribe(resp => {
        this.invoiceLoading = false;
        this.dialogEvent.close(resp);
      }, err => {
        this.invoiceLoading = false;
        this.toastr.error('Błąd podczas dodawania kosztu', 'Error')
      })
    }
  }
  editCost() {
    if (this.formOptions.valid) {
      this.invoiceLoading = true;
      let editCost = this.formOptions.value;
      this.trainingDateDetails.editCostManual(this.data.cost.id, editCost).subscribe(resp => {
        this.invoiceLoading = false;
        this.dialogEvent.close(resp);
      }, err => {
        this.invoiceLoading = false;
        this.toastr.error('Błąd podczas dodawania kosztu', 'Error')
      })
    }
  }

  exitDialog() {
    this.dialogEvent.close();
  }

}
