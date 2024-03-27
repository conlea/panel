import { DatePipe } from "@angular/common";
import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { DateAdapter } from "@angular/material/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxMaterialTimepickerTheme } from "ngx-material-timepicker";
import { ToastrService } from "ngx-toastr";
import { map, startWith } from "rxjs/operators";
import { TrainingDatesService } from "../training-dates.service";
import { OrderService } from "src/app/orders/order.service";
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { BottomSheetComponent } from "../modal/bottom-sheet/bottom-sheet.component";
import { BlankModalComponent } from "../modal/blank-modal/blank-modal.component";
import { GetDefaultTicketsComponent } from "../modal/get-default-tickets/get-default-tickets.component";

@Component({
  selector: "app-training-dates-edit",
  templateUrl: "./training-dates-edit.component.html",
  styleUrls: ["./training-dates-edit.component.scss"],
})
export class TrainingDatesEditComponent implements OnInit {
  formLink = "";
  formOptions: FormGroup;
  isTrainingDateLoading = true;
  isParticipantLoad = true;
  idTrainingDate: number;
  trainingDateDetail: any = [];
  trainingList: any = [];
  allPlaces = [];
  allMethods = [];
  allStatuses = [];
  allCurrency = [];
  allLangs = [];
  allCompanies = [];
  allEventTypes = [];
  allTrainers = [];
  trainers = [];
  regulationsList = [];
  usersPanel: any = [];
  personContact_id: number = null;
  filteredOptions;
  defaultTickets: any = [];

  filteredContactOptions = [];

  copyParams = 0;

  constructor(
    private bottomSheet: MatBottomSheet,
    private trainingDateService: TrainingDatesService,
    private orderService: OrderService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private dateAdapter: DateAdapter<Date>,
    private datePipe: DatePipe
  ) {}

  darkTheme: NgxMaterialTimepickerTheme = {
    container: {
      bodyBackgroundColor: "#424242",
      buttonColor: "#fff",
    },
    dial: {
      dialBackgroundColor: "#555",
    },
    clockFace: {
      clockFaceBackgroundColor: "#555",
      clockHandColor: "#9fbd90",
      clockFaceTimeInactiveColor: "#fff",
    },
  };
  ngOnInit(): void {
    this.isTrainingDateLoading = true;
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };
    this.idTrainingDate = Number(this.route.snapshot.paramMap.get("id"));

    this.formOptions = new FormGroup({
      product_id: new FormControl("", Validators.required),
      event_type: new FormControl("", Validators.required),
      contactPerson: new FormControl("", Validators.minLength(4)),
      company_id: new FormControl("", Validators.required),
      regulation_id: new FormControl("", Validators.required),
      place_id: new FormControl("", Validators.required),
      metoda_id: new FormControl("", Validators.required),
      maxPerson: new FormControl(""),
      currency: new FormControl("", Validators.required),
      status_id: new FormControl("", Validators.required),
      salesOwner_id: new FormControl(""),
      eventOwner_id: new FormControl(""),
      lang: new FormControl("", Validators.required),
      datestart: new FormControl("", Validators.required),
      dateend: new FormControl("", Validators.required),
      timeStart: new FormControl(""),
      timeEnd: new FormControl(""),
      trainer_id: new FormControl(""),
      trainer_confirmed: new FormControl(0),
      idTermTraining: new FormControl(
        { value: "", disabled: true },
        Validators.required
      ),
      activeRegister: new FormControl(true),
      short_register: new FormControl(false),
      personContact_confirmed: new FormControl(false),
    });
    if (this.idTrainingDate > 0) {
      this.trainingDateService.trainingDateEdit(this.idTrainingDate).subscribe(
        (resp) => {
          this.isTrainingDateLoading = false;
          this.isParticipantLoad = false;
          this.trainingDateDetail = resp.trainingDate;
          this.trainingList = resp.trainingList;
          this.allPlaces = resp.places;
          this.allMethods = resp.methods;
          this.allStatuses = resp.status;
          this.allCurrency = resp.currency;
          this.allLangs = resp.langs;
          this.allCompanies = resp.companies;
          this.allEventTypes = resp.eventType;
          this.regulationsList = resp.regulationsList;
          this.allTrainers = resp.trainers;
          this.usersPanel = resp.users;

          let timeStart = "";
          let timeEnd = "";

          this.trainers = this.allTrainers.filter((x) => {
            return x.trainings_id.includes(this.trainingDateDetail.product_id);
          });

          if (this.trainingDateDetail.timeStart) {
            let timeStartSplit = this.trainingDateDetail.timeStart.split(":");
            timeStart = `${timeStartSplit[0]}:${timeStartSplit[1]}`;
          }
          if (this.trainingDateDetail.timeEnd) {
            let timeEndSplit = this.trainingDateDetail.timeEnd.split(":");
            timeEnd = `${timeEndSplit[0]}:${timeEndSplit[1]}`;
          }
          let obj = this.allCompanies.find(
            (c) => c.id === this.trainingDateDetail.company_id
          );
          this.formLink = obj.urlReg;

          let trainingName = this.trainingList.find(
            (x) => x.id === this.trainingDateDetail.product_id
          );
          this.formOptions.controls["product_id"].setValue(
            trainingName.name_pl
          );
          this.formOptions.controls["event_type"].setValue(
            this.trainingDateDetail.event_type
          );
          this.formOptions.controls["company_id"].setValue(
            this.trainingDateDetail.company_id
          );
          this.formOptions.controls["trainer_id"].setValue(
            this.trainingDateDetail.trainer_id
          );
          this.formOptions.controls["trainer_confirmed"].setValue(
            this.trainingDateDetail.trainer_confirmed
          );
          this.formOptions.controls["regulation_id"].setValue(
            this.trainingDateDetail.regulation_id
          );
          this.formOptions.controls["place_id"].setValue(
            this.trainingDateDetail.place_id
          );
          this.formOptions.controls["metoda_id"].setValue(
            this.trainingDateDetail.metoda_id
          );
          this.formOptions.controls["maxPerson"].setValue(
            this.trainingDateDetail.maxperson
          );
          this.formOptions.controls["currency"].setValue(
            this.trainingDateDetail.currency.toUpperCase().split(",")
          );
          this.formOptions.controls["status_id"].setValue(
            this.trainingDateDetail.status_id
          );
          this.formOptions.controls["salesOwner_id"].setValue(
            this.trainingDateDetail.salesOwner_id
          );
          this.formOptions.controls["eventOwner_id"].setValue(
            this.trainingDateDetail.eventOwner_id
          );
          this.formOptions.controls["lang"].setValue(
            this.trainingDateDetail.lang.toUpperCase()
          );
          this.formOptions.controls["datestart"].setValue(
            this.trainingDateDetail.datestart
          );
          this.formOptions.controls["dateend"].setValue(
            this.trainingDateDetail.dateend
          );
          this.formOptions.controls["timeStart"].setValue(timeStart);
          this.formOptions.controls["timeEnd"].setValue(timeEnd);
          this.formOptions.controls["idTermTraining"].setValue(
            this.trainingDateDetail.idTermTraining
          );
          this.formOptions.controls["activeRegister"].setValue(
            this.trainingDateDetail.activeRegister
          );
          this.formOptions.controls["short_register"].setValue(
            this.trainingDateDetail.short_register
          );
          if (this.trainingDateDetail.personContact_id) {
            this.personContact_id = this.trainingDateDetail.personContact_id;
            this.formOptions.controls["contactPerson"].setValue(
              this.trainingDateDetail.contactPersonHS.firstname.value +
                " " +
                this.trainingDateDetail.contactPersonHS.lastname.value
            );
            this.formOptions.controls["personContact_confirmed"].setValue(
              this.trainingDateDetail.personContact_confirmed
            );
          }
        },
        (err) => {
          console.error(err);
          this.isTrainingDateLoading = false;
          this.isParticipantLoad = false;
          this.toastr.error(
            "Nie udało się pobrać szczegółów terminu szkolenia",
            "Błąd"
          );
        }
      );
    } else {
      this.trainingDateService.getParamsToAddTrainingDates().subscribe(
        (resp) => {
          this.isTrainingDateLoading = false;
          this.isParticipantLoad = false;
          this.trainingDateDetail.active = 1;
          this.trainingList = resp.trainingList;
          this.allPlaces = resp.places;
          this.allMethods = resp.methods;
          this.allStatuses = resp.status;
          this.allCurrency = resp.currency;
          this.allLangs = resp.langs;
          this.allCompanies = resp.companies;
          this.allEventTypes = resp.eventType;
          this.regulationsList = resp.regulationsList;
          this.allTrainers = resp.trainers;
          this.usersPanel = resp.users;
          this.formOptions.controls["idTermTraining"].setValue("");
        },
        (err) => {
          console.error(err);
          this.isTrainingDateLoading = false;
          this.isParticipantLoad = false;
          this.toastr.error(
            "Nie udało się pobrać parametrów dla nowego terminu szkolenia",
            "Błąd"
          );
        }
      );
    }
    /// gdy kopiujemy termin szkolenia \|/
    this.route.queryParams.subscribe((params) => {
      this.copyParams = params["copy"];
    });
    if (this.copyParams > 0) {
      this.isTrainingDateLoading = true;
      this.trainingDateService
        .trainingDateDetail(this.copyParams)
        .subscribe((resp) => {
          this.isTrainingDateLoading = false;
          let trainingName = this.trainingList.find(
            (x) => x.id === resp.trainingDate.product_id
          );
          this.formOptions.controls["product_id"].setValue(
            trainingName.name_pl
          );
          this.formOptions.controls["event_type"].setValue(
            resp.trainingDate.event_type
          );
          this.formOptions.controls["company_id"].setValue(
            resp.trainingDate.company_id
          );
          this.formOptions.controls["regulation_id"].setValue(
            resp.trainingDate.regulation_id
          );
          this.formOptions.controls["place_id"].setValue(
            resp.trainingDate.place_id
          );
          this.formOptions.controls["metoda_id"].setValue(
            resp.trainingDate.metoda_id
          );
          this.formOptions.controls["maxPerson"].setValue(
            resp.trainingDate.maxperson
          );
          this.formOptions.controls["currency"].setValue(
            resp.trainingDate.currency
          );
          this.formOptions.controls["status_id"].setValue(
            resp.trainingDate.status_id
          );
          this.formOptions.controls["lang"].setValue(
            resp.trainingDate.lang.toUpperCase()
          );
          this.formOptions.controls["activeRegister"].setValue(
            resp.trainingDate.activeRegister
          );
          this.formOptions.controls["short_register"].setValue(
            resp.trainingDate.short_register
          );
          this.formOptions.controls["idTermTraining"].setValue("");
        });
    }
    this.filteredOptions = this.formOptions.get("product_id").valueChanges.pipe(
      startWith(""),
      map((value) => this._filter(value))
    );
  }

  private _filter(value): string[] {
    const filterValue = value.toLowerCase();
    let trainingListGetCode = this.trainingList.filter(
      (training) => training.name_pl.toLowerCase() == filterValue
    );
    // console.log(filterValue);
    // console.log(trainingListGetCode);

    if (trainingListGetCode.length > 0) {
      if (this.formOptions.get("idTermTraining").value != "") {
        // let oldTrainingID = this.formOptions.get('idTermTraining').value;
        let oldTrainingID = this.formOptions
          .get("idTermTraining")
          .value.split("-");
        this.formOptions.controls["idTermTraining"].setValue(
          `${oldTrainingID[0]}-${trainingListGetCode[0].kod}`
        );
      } else {
        this.formOptions.controls["idTermTraining"].setValue("");
      }
    }
    return this.trainingList.filter(
      (training) =>
        `${training.kod} - ${training.name_pl}`
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
  }
  updateTrainingDate(formDirective: FormGroupDirective) {
    if (this.formOptions.valid) {
      let checkTrainingName = formDirective.form.value;
      let trainingID = this.trainingList.find(
        (x) => x.name_pl === checkTrainingName.product_id
      );
      if (trainingID) {
        if (this.idTrainingDate > 0) {
          this.trainingDateDetail = formDirective.form.getRawValue();
          this.trainingDateDetail.personContact_id = this.personContact_id;
          delete this.trainingDateDetail["contactPerson"];

          if (this.trainingDateDetail.eventOwner_id === undefined) {
            this.trainingDateDetail.eventOwner_id = null;
          }
          if (this.trainingDateDetail.salesOwner_id === undefined) {
            this.trainingDateDetail.salesOwner_id = null;
          }
          if (this.trainingDateDetail.trainer_id === undefined) {
            this.trainingDateDetail.trainer_id = null;
          }
          this.trainingDateDetail.product_id = trainingID.id;
          this.trainingDateDetail.datestart = this.datePipe.transform(
            this.formOptions.get("datestart").value,
            "yyyy-MM-dd"
          );
          this.trainingDateDetail.dateend = this.datePipe.transform(
            this.formOptions.get("dateend").value,
            "yyyy-MM-dd"
          );
          this.trainingDateDetail.currency =
            this.trainingDateDetail.currency.toString();

          this.isTrainingDateLoading = true;
          this.trainingDateService
            .updateTrainingDate(this.idTrainingDate, this.trainingDateDetail)
            .subscribe(
              (resp) => {
                this.isTrainingDateLoading = false;
                this.trainingDateDetail = resp;
                this.router.navigate(["training-dates", resp.id, "details"]);
                this.toastr.success(
                  "Poprawnie zaktualizowano termin szkolenia",
                  "Success"
                );
              },
              (err) => {
                console.error(err);
                this.isTrainingDateLoading = false;
                this.toastr.error("Wystąpił błąd podczas zapisywania", "Błąd");
              }
            );
        } else {
          this.getMoreDataNewTrainingDate(formDirective);
        }
      } else {
        this.toastr.error("Nie znaleziono szkolenia o podanej nazwie", "Błąd");
      }
    }
  }
  getMoreDataNewTrainingDate(formDirective: FormGroupDirective) {
    let checkTrainingName = formDirective.form.value;
    let trainingID = this.trainingList.find(
      (x) => x.name_pl === checkTrainingName.product_id
    );
    this.trainingDateDetail = formDirective.form.getRawValue();
    this.trainingDateDetail.code = trainingID.kod;
    this.trainingDateDetail.personContact_id = this.personContact_id;
    delete this.trainingDateDetail["contactPerson"];

    if (this.trainingDateDetail.eventOwner_id === undefined) {
      this.trainingDateDetail.eventOwner_id = null;
    }
    if (this.trainingDateDetail.salesOwner_id === undefined) {
      this.trainingDateDetail.salesOwner_id = null;
    }
    this.trainingDateDetail.product_id = trainingID.id;
    this.trainingDateDetail.datestart = this.datePipe.transform(
      this.formOptions.get("datestart").value,
      "yyyy-MM-dd"
    );
    this.trainingDateDetail.dateend = this.datePipe.transform(
      this.formOptions.get("dateend").value,
      "yyyy-MM-dd"
    );
    this.trainingDateDetail.currency =
      this.trainingDateDetail.currency.toString();

    if (this.defaultTickets.length > 0) {
      const defaultTicketsModal = this.dialog.open(GetDefaultTicketsComponent, {
        maxWidth: "850px",
        minWidth: "600px",
        data: {
          header: "Czy dodać domyślne pakiety cenowe?",
          trainingID: trainingID.id,
          trainingName: checkTrainingName.product_id,
          defaultTicketsList: this.defaultTickets,
          newTraining: this.trainingDateDetail,
        },
      });
      defaultTicketsModal.afterClosed().subscribe((respData) => {
        if (respData) {
          this.saveNewTrainingDate(this.trainingDateDetail, respData);
        } else {
          // console.log(this.trainingDateDetail);
          this.saveNewTrainingDate(this.trainingDateDetail, []);
        }
      });
    } else {
      this.saveNewTrainingDate(this.trainingDateDetail, []);
    }
  }
  saveNewTrainingDate(trainingDateDetail, newTickets) {
    this.isTrainingDateLoading = true;
    this.trainingDateService
      .addNewTrainingDate(trainingDateDetail, newTickets)
      .subscribe(
        (resp) => {
          this.isTrainingDateLoading = false;
          if (resp.newid) {
            this.trainingDateDetail.active = 1;
            let changeTerm = this.formOptions.get("idTermTraining").value;
            let oldId = changeTerm.split("-");
            this.formOptions.controls["idTermTraining"].setValue(
              `${resp.newid}-${oldId[1]}`
            );
            this.toastr.warning(
              "Zmieniono id teminu szkolenia, zapisz szkolenie ponownie",
              "Alert"
            );
          } else {
            this.router.navigate(["training-dates", resp.id, "details"]);
            this.toastr.success("Poprawnie dodano termin szkolenia", "Success");
          }
        },
        (err) => {
          console.error(err);
          this.isTrainingDateLoading = false;
          this.trainingDateDetail = [];
        }
      );
  }

  removeDataTraining(idTrainingD) {
    this.isTrainingDateLoading = true;
    this.trainingDateService.removeTrainingDate(idTrainingD).subscribe(
      (resp) => {
        this.isTrainingDateLoading = false;
        this.router.navigate(["training-dates"]);
        this.toastr.success("Usunięto termin szkolenia", "Success");
      },
      (err) => {
        console.error(err);
        this.isTrainingDateLoading = false;
        this.toastr.error(
          "Wystąpił błąd podczas usuwania terminu szkolenia",
          "Błąd"
        );
      }
    );
  }

  onSearchChange(event) {
    this.personContact_id = null;
    if (event.length > 3) {
      this.orderService.findPersonFromHS(event).subscribe(
        (resp) => {
          this.filteredContactOptions = resp.contacts;
        },
        (err) => {
          this.filteredContactOptions = [];
        }
      );
    }
  }
  getDefaultTicketTraining(value) {
    let training = this.trainingList.find((x) => x.name_pl === value);
    this.defaultTickets = training.defaultTickets;
    // this.defaultTickets = this.trainingList.find(
    //   (x) => x.name_pl === value
    // ).defaultTickets;
    this.formOptions.controls["trainer_id"].setValue("");
    this.formOptions.controls["trainer_confirmed"].setValue(0);
    this.trainers = this.allTrainers.filter((x) => {
      return x.trainings_id.includes(training.id);
    });
  }

  onEnter(newId) {
    this.personContact_id = newId;
  }

  // ????
  createArrayColumns(oldColumns): string[] {
    let newArray = [];
    oldColumns.forEach((column) => {
      if (column.checked) {
        newArray.push(column.name);
      }
    });
    return newArray;
  }

  changeCompany(event) {
    let obj = this.allCompanies.find((c) => c.id === event.value);
    this.formLink = obj.urlReg;
  }
  changeEventType(event) {
    console.log(event);
    this.personContact_id = null;
    this.formOptions.controls["contactPerson"].setValue("");
    this.formOptions.controls["personContact_confirmed"].setValue(false);
    if (event.value == 2) {
      const bottomSheetRef = this.bottomSheet.open(BottomSheetComponent);
      bottomSheetRef.afterDismissed().subscribe((dataFromChild) => {
        if (dataFromChild) {
          this.formOptions.controls["company_id"].setValue(1);
          this.formOptions.controls["regulation_id"].setValue(1);
          this.formOptions.controls["status_id"].setValue(1);
          this.formOptions.controls["place_id"].setValue(6);
          this.formOptions.controls["metoda_id"].setValue(2);
          this.formOptions.controls["currency"].setValue(["PLN"]);
          this.formOptions.controls["timeStart"].setValue("09:00");
          this.formOptions.controls["timeEnd"].setValue("13:30");
        }
      });
    }
  }
}
