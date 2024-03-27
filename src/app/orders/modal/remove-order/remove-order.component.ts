import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-order',
  templateUrl: './remove-order.component.html',
  styleUrls: ['./remove-order.component.scss']
})
export class RemoveOrderComponent implements OnInit {

  constructor(public dialogEvent: MatDialogRef<RemoveOrderComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }
  remove() {
    this.dialogEvent.close(true);
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
