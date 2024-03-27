import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-blank-modal",
  templateUrl: "./blank-modal.component.html",
  styleUrls: ["./blank-modal.component.scss"],
})
export class BlankModalComponent implements OnInit {
  constructor(
    public dialogEvent: MatDialogRef<BlankModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  ngOnInit(): void {
    console.log(this.data);
  }
  saveChanges() {
    this.dialogEvent.close();
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
