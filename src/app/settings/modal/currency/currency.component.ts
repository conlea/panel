import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss']
})
export class CurrencyComponent implements OnInit {

  formOptions: FormGroup;

  constructor(public dialogEvent: MatDialogRef<CurrencyComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      name: new FormControl('', Validators.required),
      active: new FormControl(0)
    });
    if (this.data.currency) {
      this.formOptions.controls['name'].setValue(this.data.currency.name);
      this.formOptions.controls['active'].setValue(this.data.currency.active);
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
