import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-regulation',
  templateUrl: './regulation.component.html',
  styleUrls: ['./regulation.component.scss']
})
export class RegulationComponent implements OnInit {

  formOptions: FormGroup;

  constructor(public dialogEvent: MatDialogRef<RegulationComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      name: new FormControl('', Validators.required),
      link_pl: new FormControl('', Validators.required),
      link_en: new FormControl('', Validators.required),
      active: new FormControl(0)
    });
    if (this.data.regulation) {
      this.formOptions.controls['name'].setValue(this.data.regulation.name);
      this.formOptions.controls['link_pl'].setValue(this.data.regulation.link_pl);
      this.formOptions.controls['link_en'].setValue(this.data.regulation.link_en);
      this.formOptions.controls['active'].setValue(this.data.regulation.active);
    }

  }
  editRegulation() {
    if (this.formOptions.valid) {
      this.dialogEvent.close(this.formOptions.value);
    }
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
