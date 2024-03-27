import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-ticket-attr',
  templateUrl: './ticket-attr.component.html',
  styleUrls: ['./ticket-attr.component.scss']
})
export class TicketAttrComponent implements OnInit {

  formOptions: FormGroup;

  constructor(public dialogEvent: MatDialogRef<TicketAttrComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      active: new FormControl(0),
      name_pl: new FormControl('', Validators.required),
      name_en: new FormControl('', Validators.required),
      description_pl: new FormControl(''),
      description_en: new FormControl(''),
      orderBy: new FormControl(0, Validators.required)
    });
    if (this.data.attr) {
      this.formOptions.controls['name_pl'].setValue(this.data.attr.name_pl);
      this.formOptions.controls['name_en'].setValue(this.data.attr.name_en);
      this.formOptions.controls['description_pl'].setValue(this.data.attr.description_pl);
      this.formOptions.controls['description_en'].setValue(this.data.attr.description_en);
      this.formOptions.controls['orderBy'].setValue(this.data.attr.orderBy);
      this.formOptions.controls['active'].setValue(this.data.attr.active);
    }
  }
  exitDialog() {
    this.dialogEvent.close();
  }
  editAttr() {
    if (this.formOptions.valid) {
      this.dialogEvent.close(this.formOptions.value);
    }
  }

}
