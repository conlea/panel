import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { TrainingDatesService } from '../../training-dates.service';

@Component({
  selector: 'app-add-cost-invoice-by-id',
  templateUrl: './add-cost-invoice-by-id.component.html',
  styleUrls: ['./add-cost-invoice-by-id.component.scss']
})
export class AddCostInvoiceByIdComponent implements OnInit {

  formOptions: FormGroup;
  invoiceLoading = false;

  constructor(public dialogEvent: MatDialogRef<AddCostInvoiceByIdComponent>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService, private trainingDateDetails: TrainingDatesService) {
    this.formOptions = new FormGroup({
      idCost: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
  }
  addCost() {
    this.invoiceLoading = true;
    if (this.formOptions.valid) {
      this.trainingDateDetails.getCostTrainingDateById({ trainingDate_id: this.data.trainingDate.id, company_id: this.data.company.id, cost_id: this.formOptions.get('idCost').value, }).subscribe(resp => {
        this.invoiceLoading = false;
        this.toastr.success('Dodano nowy koszt wydarzenia', 'Success')
        this.dialogEvent.close(resp);
      }, err => {
        this.invoiceLoading = false;
        this.toastr.error('Błąd podczas dodawania kosztu do wydarznia', 'Error')
      })
    }

  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
