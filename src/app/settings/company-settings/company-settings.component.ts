import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SettingsService } from "../settings.service";
import * as customBuildPlaceholders from "../../../assets/ck-editor-placeholders/ckeditor";

@Component({
  selector: "app-company-settings",
  templateUrl: "./company-settings.component.html",
  styleUrls: ["./company-settings.component.scss"],
})
export class CompanySettingsComponent implements OnInit {
  public Editor = customBuildPlaceholders;
  public Editor2 = customBuildPlaceholders;

  public ckeConfig = {
    toolbar: [
      "heading",
      "|",
      "bold",
      "italic",
      "bulletedList",
      "numberedList",
      "link",
    ],
  };
  public placeholderConfig = {
    placeholderProps: {
      types: [
        "company_name",
        "invoice_number",
        "payer_name",
        "total_price",
        "invoice_date",
        "invoice_payment_to",
        "account_nr",
        "interest",
      ],
    },
  };
  public placeholdersConfirmedEmailTitle = {
    placeholderProps: {
      types: ["company_name", "event_name"],
    },
  };
  public placeholdersConfirmedEmail = {
    placeholderProps: {
      types: [
        "first_name",
        "company_name",
        "event_name",
        "event_details",
        "event_participants",
      ],
    },
  };

  formOptions: FormGroup;

  hideAPIKey: boolean = true;
  hideAPISignature: boolean = true;
  hideFakturowniaAPIKey: boolean = true;
  subscriptionList: any = [];
  textSubscriptionDO = "";
  idCompany: number;
  isLoadingCompany: boolean = true;
  companyDetails: any = {};

  constructor(
    private settingsService: SettingsService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) {
    this.idCompany = Number(this.route.snapshot.paramMap.get("id"));
  }

  ngOnInit(): void {
    this.isLoadingCompany = true;
    this.formOptions = new FormGroup({
      name: new FormControl("", Validators.required),
      urlReg: new FormControl("", Validators.required),
      payuClientId: new FormControl("", Validators.required),
      payuClientSecret: new FormControl("", Validators.required),
      paynowAPIKey: new FormControl(""),
      paynowAPIsignature: new FormControl(""),
      fakturowniaNameAccount: new FormControl(""),
      fakturowniaAPIKey: new FormControl(""),
      department_id: new FormControl(""),
      confirmEmail_id_pl: new FormControl(""),
      confirmEmail_id_en: new FormControl(""),
      sendgridConfirm_id_pl: new FormControl(""),
      sendgridConfirm_id_en: new FormControl(""),
      sendgridInvoice_id_pl: new FormControl(""),
      sendgridInvoice_id_en: new FormControl(""),
      sendgridGroupMail_id: new FormControl(""),
      active: new FormControl(0),
      consentPersonalData_pl: new FormControl("", Validators.required),
      consentPersonalData_en: new FormControl("", Validators.required),
      consentPersonalData_HS: new FormControl("", Validators.required),
      consentSalesAndMarketing_pl: new FormControl("", Validators.required),
      consentSalesAndMarketing_en: new FormControl("", Validators.required),
      consentSalesAndMarketing_HS: new FormControl("", Validators.required),
      title_confirmedRegSubject_pl: new FormControl("", Validators.required),
      confirmedRegSubject_pl: new FormControl("", Validators.required),
      title_confirmedRegSubject_en: new FormControl("", Validators.required),
      confirmedRegSubject_en: new FormControl("", Validators.required),
      title_vindication_partI_pl: new FormControl("", Validators.required),
      title_vindication_partI_en: new FormControl("", Validators.required),
      vindication_partI_pl: new FormControl("", Validators.required),
      vindication_partI_en: new FormControl("", Validators.required),
      title_vindication_partII_pl: new FormControl("", Validators.required),
      title_vindication_partII_en: new FormControl("", Validators.required),
      vindication_partII_pl: new FormControl("", Validators.required),
      vindication_partII_en: new FormControl("", Validators.required),
      title_vindication_partIII_pl: new FormControl("", Validators.required),
      title_vindication_partIII_en: new FormControl("", Validators.required),
      vindication_partIII_pl: new FormControl("", Validators.required),
      vindication_partIII_en: new FormControl("", Validators.required),
      title_vindication_partIV_pl: new FormControl("", Validators.required),
      title_vindication_partIV_en: new FormControl("", Validators.required),
      vindication_partIV_pl: new FormControl("", Validators.required),
      vindication_partIV_en: new FormControl("", Validators.required),
      title_vindication_partV_pl: new FormControl("", Validators.required),
      title_vindication_partV_en: new FormControl("", Validators.required),
      vindication_partV_pl: new FormControl("", Validators.required),
      vindication_partV_en: new FormControl("", Validators.required),
    });

    if (this.idCompany > 0) {
      this.settingsService.getCompanyDetails(this.idCompany).subscribe(
        (resp) => {
          this.isLoadingCompany = false;
          this.subscriptionList = resp.subscriptionsHS;
          this.companyDetails = resp.companyDetails;
          this.formOptions.patchValue(this.companyDetails);
        },
        (err) => {
          console.error(err);
        }
      );
    } else {
      this.settingsService.getCompanyParams().subscribe(
        (resp) => {
          this.isLoadingCompany = false;
          console.log(resp);

          this.subscriptionList = resp;
        },
        (err) => {
          this.isLoadingCompany = false;
          console.error(err);
        }
      );
    }
  }
  addNewCompany() {
    if (this.formOptions.valid) {
      this.isLoadingCompany = true;
      this.settingsService.addNewCompany(this.formOptions.value).subscribe(
        (resp) => {
          this.isLoadingCompany = false;
          this.companyDetails = resp;
          this.router.navigate([
            "settings",
            this.companyDetails.id,
            "company-details",
          ]);
          this.toastr.success("Dodano nową firmę", "Success");
        },
        (err) => {
          console.error(err);
          this.isLoadingCompany = false;
          this.toastr.error("Błąd podczas dodawania nowej firmy", "Error");
        }
      );
    }
  }
  updateCompany() {
    if (this.formOptions.valid) {
      this.isLoadingCompany = true;
      this.settingsService
        .updateCompany(this.idCompany, this.formOptions.value)
        .subscribe(
          (resp) => {
            this.isLoadingCompany = false;
            this.companyDetails = resp;
            this.toastr.success("Zapisano zmiany", "Success");
          },
          (err) => {
            console.error(err);
            this.isLoadingCompany = false;
            this.toastr.error("Błąd podczas edycji danych firmy", "Error");
          }
        );
    }
  }
  removeCompany() {
    this.isLoadingCompany = true;
    this.settingsService.removeCompany(this.idCompany).subscribe((resp) => {
      this.isLoadingCompany = false;
      this.router.navigate(["settings"]);
      this.toastr.success("Usunięto firmę", "Success");
    });
  }
}
