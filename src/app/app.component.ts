import { SettingsService } from "./settings/settings.service";
import { Router } from "@angular/router";
import {
  Component,
  OnInit,
  ViewEncapsulation,
  ViewChild,
  ChangeDetectorRef,
} from "@angular/core";
import { AuthService } from "./auth/auth.service";
import { AuthGuardsService } from "./auth/auth-guards.service";
import { MatDrawer } from "@angular/material/sidenav";
import { faPercentage } from "@fortawesome/free-solid-svg-icons";
import { ToastrService } from "ngx-toastr";
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from "@angular/animations";
import { MatDialog } from "@angular/material/dialog";
import { AdminEditComponent } from "./settings/modal/admin-edit/admin-edit.component";
import { faUserNinja } from "@fortawesome/free-solid-svg-icons";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  user = false;
  userNinja = faUserNinja;
  statusNavConlea = false;
  statusNavLMIT = false;
  isLmitB = false;
  percentage = faPercentage;
  yearNow = new Date().getFullYear();
  userData: any = {};
  companyList: any = [];
  isUser: boolean = false;
  public sideNavState: boolean = false;
  public linkText: boolean = false;
  private subscription = new Subscription();

  @ViewChild("drawersConlea") drawers: MatDrawer;

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private router: Router,
    private toastr: ToastrService,
    private authGuards: AuthGuardsService,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.authService.getUserByToken().subscribe();
    this.subscription = this.authService.userData.subscribe((user) => {
      this.userData = user;
    });

    this.subscription = this.authService.isUser.subscribe((isUser) => {
      this.isUser = isUser;
      console.log(isUser);
      this.changeDetector.detectChanges();
      if (isUser) {
        this.statusNavConlea = this.drawers.opened;
        if (!this.drawers.opened) {
          this.drawers.open();
        }
        // this.getUserData();
      }
    });
  }

  getUserData() {
    if (
      this.authService.isLoggedIn() &&
      Object.keys(this.userData).length == 0
    ) {
      // this.authService.getUserByToken().subscribe((resp) => {
      //   this.userData = resp;
      // });
    }
  }
  navToggleConlea() {
    this.drawers.toggle();
    this.statusNavConlea = this.drawers.opened;
  }
  showMoreNav() {
    this.sideNavState = !this.sideNavState;
    setTimeout(() => {
      this.linkText = this.sideNavState;
    }, 200);
  }
  logout() {
    this.statusNavConlea = false;
    this.statusNavLMIT = false;
    this.drawers.close();
    this.authService.logout().subscribe(
      (logout) => {
        this.toastr.success("Poprawnie wylogowano z panelu", "Success");
      },
      (err) => {
        console.log(err);
        this.toastr.error("Błąd", "Error");
      }
    );
  }
  openNavConlea() {}
  openNavLmit() {
    this.statusNavConlea = false;
    this.drawers.close();
  }
  editProfile() {
    const editAdminUser = this.dialog.open(AdminEditComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: "Edytuj Profil", user: this.userData },
    });
    editAdminUser.afterClosed().subscribe(
      (editUser) => {
        if (editUser) {
          this.settingsService.adminUpdate(editUser).subscribe(
            (resp) => {
              if (editUser.deleted > 0) {
                this.toastr.success("Usunięto użytkownika", "Success");
              } else {
                this.toastr.success("User has been update", "Success");
              }
            },
            (err) => {
              console.error(err);
              this.toastr.error("Błąd podczas edycji profilu", "Error");
            }
          );
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }
  changeNavB(nav) {
    if ((nav = "lmit")) {
      this.isLmitB = true;
    } else {
      this.isLmitB = false;
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
