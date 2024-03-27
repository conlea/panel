import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-lang',
  templateUrl: './lang.component.html',
  styleUrls: ['./lang.component.scss']
})
export class LangComponent implements OnInit {

  formOptions: FormGroup;

  constructor(public dialogEvent: MatDialogRef<LangComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      name_pl: new FormControl('', Validators.required),
      name_en: new FormControl('', Validators.required),
      short_name: new FormControl('', Validators.required),
      active: new FormControl('')
    });
    if (this.data.lang) {
      this.formOptions.controls['name_pl'].setValue(this.data.lang.name_pl);
      this.formOptions.controls['name_en'].setValue(this.data.lang.name_en);
      this.formOptions.controls['short_name'].setValue(this.data.lang.short_name);
      this.formOptions.controls['active'].setValue(this.data.lang.active);
    }
  }

  exitDialog() {
    this.dialogEvent.close();
  }
  editStatus() {
    if (this.formOptions.valid) {
      this.dialogEvent.close(this.formOptions.value);
    }
  }
}
