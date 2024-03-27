import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-vindication-email',
  templateUrl: './vindication-email.component.html',
  styleUrls: ['./vindication-email.component.scss']
})
export class VindicationEmailComponent implements OnInit {

  formOptions: FormGroup;


  constructor(public dialogEvent: MatDialogRef<VindicationEmailComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      newEmail: new FormControl(this.data.emailToChange, [Validators.required, Validators.email]),
    })
  }
  ngAfterViewInit(): void {
  }
  saveDate() {
    this.dialogEvent.close(this.formOptions.value.newEmail);
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
