import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-new-contact',
  templateUrl: './add-new-contact.component.html',
  styleUrls: ['./add-new-contact.component.scss']
})
export class AddNewContactComponent implements OnInit {

  formOptions: FormGroup;

  constructor(public dialogEvent: MatDialogRef<AddNewContactComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      email: new FormControl('', Validators.required),
      firstname: new FormControl(''),
      lastname: new FormControl(''),
      company: new FormControl(''),
      phone: new FormControl(''),
      address: new FormControl(''),
      city: new FormControl(''),
      zip: new FormControl(''),
    });
  }

  addNewPerson() {
    if (this.formOptions.valid) {
      this.dialogEvent.close(this.formOptions.value);
    }
  }

  exitDialog() {
    this.dialogEvent.close();
  }
}
