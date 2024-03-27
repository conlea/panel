import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Color } from '@angular-material-components/color-picker';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.scss']
})
export class StatusComponent implements OnInit {

  formOptions: FormGroup;

  constructor(public dialogEvent: MatDialogRef<StatusComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      name_pl: new FormControl('', Validators.required),
      name_en: new FormControl('', Validators.required),
      color_status: new FormControl('', Validators.required),
      active: new FormControl('')
    });
    if (this.data.status) {
      let color: any;
      if (this.data.status.color_status) {
        let colorObj = JSON.parse(this.data.status.color_status);
        color = new Color(colorObj.r, colorObj.g, colorObj.b, colorObj.a);
      }
      this.formOptions.controls['name_pl'].setValue(this.data.status.name_pl);
      this.formOptions.controls['name_en'].setValue(this.data.status.name_en);
      this.formOptions.controls['color_status'].setValue(color);
      this.formOptions.controls['active'].setValue(this.data.status.active);
    }
  }
  exitDialog() {
    this.dialogEvent.close();
  }
  editStatus() {
    if (this.formOptions.valid) {
      this.formOptions.controls['color_status'].setValue(JSON.stringify(this.formOptions.value.color_status));
      this.dialogEvent.close(this.formOptions.value);
    }
  }

}
