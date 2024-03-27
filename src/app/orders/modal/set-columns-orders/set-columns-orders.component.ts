import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-set-columns",
  templateUrl: "./set-columns-orders.component.html",
  styleUrls: ["./set-columns-orders.component.scss"],
})
export class SetColumnsOrdersComponent implements OnInit {
  columnsList = [];
  hiddenElementCount = 0;
  blockCheckbox = true;

  constructor(
    public dialogEvent: MatDialogRef<SetColumnsOrdersComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    this.columnsList = [];
    this.columnsList = this.data.columns;
    this.columnsList.forEach((element) => {
      if (!element.showToEdit) {
        this.hiddenElementCount += 1;
      }
    });
    this.checkCount();
  }
  checkCount() {
    let checkCount = 0;
    this.columnsList.forEach((column) => {
      if (column.checked) {
        checkCount += 1;
        if (checkCount > 7) {
          this.blockCheckbox = true;
        } else {
          this.blockCheckbox = false;
        }
      }
    });
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(
      this.columnsList,
      this.hiddenElementCount + event.previousIndex,
      this.hiddenElementCount + event.currentIndex
    );
  }
  saveColumns() {
    this.dialogEvent.close(this.data.columns);
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
