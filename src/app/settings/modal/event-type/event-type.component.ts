import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-event-type',
  templateUrl: './event-type.component.html',
  styleUrls: ['./event-type.component.scss']
})
export class EventTypeComponent implements OnInit {

  formOptions: FormGroup;

  constructor(public dialogEvent: MatDialogRef<EventTypeComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      name_pl: new FormControl('', Validators.required),
      name_en: new FormControl('', Validators.required),
      active: new FormControl(1)
    });
    if (this.data.eventT) {
      this.formOptions.controls['name_pl'].setValue(this.data.eventT.name_pl);
      this.formOptions.controls['name_en'].setValue(this.data.eventT.name_en);
      this.formOptions.controls['active'].setValue(this.data.eventT.active);
    }
  }
  editEventType() {
    if (this.formOptions.valid) {
      this.dialogEvent.close(this.formOptions.value);
    }
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
