import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-admin-edit",
  templateUrl: "./admin-edit.component.html",
  styleUrls: ["./admin-edit.component.scss"],
})
export class AdminEditComponent implements OnInit {
  constructor(
    public dialogEvent: MatDialogRef<AdminEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data
  ) {}

  formOptions: FormGroup;
  showBtnPass = false;
  userData: any = {};
  ngOnInit(): void {
    // this.logUser = this.authService.userData.getValue();

    this.formOptions = new FormGroup({
      id: new FormControl(""),
      first_name: new FormControl("", Validators.required),
      last_name: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required),
      active: new FormControl(""),
      role: new FormControl(""),
    });

    if (this.data.user) {
      this.formOptions.controls["id"].setValue(this.data.user.id);
      this.formOptions.controls["first_name"].setValue(
        this.data.user.first_name
      );
      this.formOptions.controls["last_name"].setValue(this.data.user.last_name);
      this.formOptions.controls["email"].setValue(this.data.user.email);
      this.formOptions.controls["active"].setValue(this.data.user.active);
      this.formOptions.controls["role"].setValue(this.data.user.role);
      this.formOptions.controls["password"].disable();
      this.showBtnPass = true;
    }
  }
  changePass() {
    this.showBtnPass = false;
    this.formOptions.controls["password"].enable();
    this.formOptions.addControl(
      "password",
      new FormControl("", Validators.required)
    );
  }
  exitDialog() {
    this.dialogEvent.close();
  }
  editAdmin() {
    if (this.formOptions.value.active > 0 || this.formOptions.value.active) {
      this.formOptions.value.active = 1;
    } else {
      this.formOptions.value.active = 0;
    }
    this.dialogEvent.close(this.formOptions.value);
  }
  removeUser() {
    this.data.user.deleted = 1;
    this.dialogEvent.close(this.data.user);
  }
}
