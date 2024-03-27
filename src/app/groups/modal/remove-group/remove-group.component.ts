import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-remove-group',
  templateUrl: './remove-group.component.html',
  styleUrls: ['./remove-group.component.scss']
})
export class RemoveGroupComponent implements OnInit {

  constructor(public dialogEvent: MatDialogRef<RemoveGroupComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
  }
  exitDialog() {
    this.dialogEvent.close();
  }
  removeGroup() {
    this.dialogEvent.close(true);
  }
}
