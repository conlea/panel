import { Color } from '@angular-material-components/color-picker';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-rule-user',
  templateUrl: './rule-user.component.html',
  styleUrls: ['./rule-user.component.scss']
})
export class RuleUserComponent implements OnInit {

  formOptions: FormGroup;

  constructor(public dialogEvent: MatDialogRef<RuleUserComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      name: new FormControl('', Validators.required),
      color_status: new FormControl('', Validators.required),
    });

    if (this.data.participantRole) {
      let color: any;
      if (this.data.participantRole.color_status) {
        let colorObj = JSON.parse(this.data.participantRole.color_status);
        color = new Color(colorObj.r, colorObj.g, colorObj.b, colorObj.a);
      }
      this.formOptions.controls['name'].setValue(this.data.participantRole.name);
      this.formOptions.controls['color_status'].setValue(color);
    }
  }
  editRole() {
    if (this.formOptions.valid) {
      this.formOptions.controls['color_status'].setValue(JSON.stringify(this.formOptions.value.color_status));
      this.dialogEvent.close(this.formOptions.value);
    }
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
