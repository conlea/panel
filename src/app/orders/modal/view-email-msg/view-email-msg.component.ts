import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-email-msg',
  templateUrl: './view-email-msg.component.html',
  styleUrls: ['./view-email-msg.component.scss']
})
export class ViewEmailMsgComponent implements OnInit {

  title: string = "";
  content = "";
  mailFrom: string = "";
  mailTo: string = "";

  constructor(public dialogEvent: MatDialogRef<ViewEmailMsgComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    console.log(this.data.email);
    this.title = this.data.email.title;
    this.content = this.data.email.content;
    this.mailFrom = this.data.email.mailFrom;
    this.mailTo = this.data.email.mailTo;
  }

  exitDialog() {
    this.dialogEvent.close();
  }

}
