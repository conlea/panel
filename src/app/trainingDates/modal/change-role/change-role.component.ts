import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-change-role',
  templateUrl: './change-role.component.html',
  styleUrls: ['./change-role.component.scss']
})
export class ChangeRoleComponent implements OnInit {
  variable: boolean[] = []
  constructor(public dialogEvent: MatDialogRef<ChangeRoleComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    console.log(this.data);

    this.data.person.participant_role.forEach(roleP => {
      this.variable[roleP] = true;
    });
  }
  saveParticipantRole() {
    console.log(this.variable);
    this.variable.forEach((rol, index) => {
      if (!rol) {
        delete this.variable[index];
      }
    });
    let keyNr = Object.keys(this.variable).map(Number);

    this.dialogEvent.close(keyNr);
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
