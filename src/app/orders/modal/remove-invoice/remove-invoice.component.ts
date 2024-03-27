import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-invoice',
  templateUrl: './remove-invoice.component.html',
  styleUrls: ['./remove-invoice.component.scss']
})
export class RemoveInvoiceComponent implements OnInit {

  invoiceFV = false;

  constructor(public dialogEvent: MatDialogRef<RemoveInvoiceComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {

  }
  remove() {
    this.dialogEvent.close({ removeFromFakturownia: this.invoiceFV });
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
