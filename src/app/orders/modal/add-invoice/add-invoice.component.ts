import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../order.service';

@Component({
  selector: 'app-add-invoice',
  templateUrl: './add-invoice.component.html',
  styleUrls: ['./add-invoice.component.scss']
})
export class AddInvoiceComponent implements OnInit {

  formOptions: FormGroup;
  invoiceLoading = false;

  constructor(public dialogEvent: MatDialogRef<AddInvoiceComponent>, @Inject(MAT_DIALOG_DATA) public data, private orderService: OrderService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      idInvoice: new FormControl('', Validators.required)
    });
  }
  addInvoice() {
    this.invoiceLoading = true;
    this.formOptions.get('idInvoice').value;
    this.orderService.getInvoiceById(this.formOptions.get('idInvoice').value, this.data.company, this.data.order).subscribe(resp => {
      this.invoiceLoading = false;
      console.log(resp);
      if (resp.message) {
        this.toastr.error('Brak faktury o podanym ID', 'Error');
      } else {
        this.dialogEvent.close(resp);
      }
    }, err => {
      this.invoiceLoading = false;
      this.toastr.error('Brak faktury o podanym ID', 'Error')
    })
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
