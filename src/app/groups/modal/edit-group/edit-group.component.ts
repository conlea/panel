import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-group',
  templateUrl: './edit-group.component.html',
  styleUrls: ['./edit-group.component.scss']
})
export class EditGroupComponent implements OnInit {

  formOptions: FormGroup;

  constructor(public dialogEvent: MatDialogRef<EditGroupComponent>, @Inject(MAT_DIALOG_DATA) public data) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      name_pl: new FormControl('', Validators.required),
      name_en: new FormControl('', Validators.required),
      anchor_pl: new FormControl(''),
      anchor_en: new FormControl(''),
      is_hide: new FormControl(''),
      rank: new FormControl('', Validators.required),
      parent: new FormControl('', Validators.required),
    });
    if (this.data.group) {
      this.formOptions.controls['name_pl'].setValue(this.data.group.name_pl);
      this.formOptions.controls['name_en'].setValue(this.data.group.name_en);
      this.formOptions.controls['anchor_pl'].setValue(this.data.group.anchor_pl);
      this.formOptions.controls['anchor_en'].setValue(this.data.group.anchor_en);
      this.formOptions.controls['is_hide'].setValue(this.data.group.is_hide);
      this.formOptions.controls['rank'].setValue(this.data.group.rank);
      this.formOptions.controls['parent'].setValue(this.data.group.parent);
      // czy posiada children \|/
      if (this.data.hasParent) {
        this.formOptions.controls['parent'].disable();
      }
    }
  }
  removeGroup() {
    this.dialogEvent.close('remove');
  }
  editGroup() {
    this.dialogEvent.close(this.formOptions.value);
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
