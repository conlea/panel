import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-set-columns',
  templateUrl: './set-columns.component.html',
  styleUrls: ['./set-columns.component.scss']
})
export class SetColumnsComponent implements OnInit {

  columnsList = [];
  hiddenElementCount = 0;

  constructor(public dialogEvent: MatDialogRef<SetColumnsComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.columnsList = [];
    this.columnsList = this.data.columns;
    console.log(this.columnsList);
    this.columnsList.forEach(element => {
      if (!element.showToEdit) {
        this.hiddenElementCount += 1;
      }
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnsList, (this.hiddenElementCount + event.previousIndex), (this.hiddenElementCount + event.currentIndex));
  }
  saveColumns() {
    this.dialogEvent.close(this.data.columns);
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}


