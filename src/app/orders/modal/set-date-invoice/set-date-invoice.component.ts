import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-set-date-invoice',
  templateUrl: './set-date-invoice.component.html',
  styleUrls: ['./set-date-invoice.component.scss']
})
export class SetDateInvoiceComponent implements OnInit {
  // selectdate: Date | null;
  selectdate = new Date();
  selectedMonth = new Date();
  invoice = null;

  constructor(public dialogEvent: MatDialogRef<SetDateInvoiceComponent>, @Inject(MAT_DIALOG_DATA) public data) { }
  ngOnInit(): void {
    if (this.data.invoice) {
      this.invoice = this.data.invoice;
      this.selectdate.setDate(new Date(this.invoice.payment_to).getDate());
      this.selectdate.setMonth(new Date(this.invoice.payment_to).getMonth());
      this.selectedMonth.setMonth(new Date(this.invoice.payment_to).getMonth());
    } else {
      this.selectdate.setDate(this.selectdate.getDate() + 14);
      this.selectedMonth.setMonth(this.selectdate.getMonth());
    }

  }
  getFirstDayOfWeek(): number {
    return 1;
  }
  changeDate(ev) {
    this.selectdate = ev;
  }
  saveDate() {
    this.dialogEvent.close(this.selectdate);
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
