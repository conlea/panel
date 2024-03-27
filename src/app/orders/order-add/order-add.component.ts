import { ToastrService } from "ngx-toastr";
import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { OrderService } from "../order.service";
import { Router } from "@angular/router";
import {
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  tap,
} from "rxjs/operators";
import { DealPersonsComponent } from "../modal/deal-persons/deal-persons.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-order-add",
  templateUrl: "./order-add.component.html",
  styleUrls: ["./order-add.component.scss"],
})
export class OrderAddComponent implements OnInit {
  isLoadingDetails = true;
  isOpitonsLoading: boolean = false;
  newOrder = {
    isActive: 1,
    trainingDate_id: "",
    training_id: "",
    status_id: 1,
    currency: "PLN",
    method_id: "",
    place_id: "",
    idDiscountCode: null,
    priceTraining: 0,
    totalPrice: 0,
    wherePay: 1,
    getCompanyDataGus: 0,
    formLang: "pl",
    take_exam: 0,
    priceExam: 0,
    take_take2: 0,
    price_Take2_exam: 0,
    take_book: 0,
    price_book: 0,
    noNameTickets: 0,
    ticketID: "",
    discountUse: null,
    isCompanyPayer: 0,
    companyName: "",
    companyStreet: "",
    companyCity: "",
    companyPostCode: "",
    companyVatID: "",
    isPersonPayer: 0,
    personStreet: "",
    personCity: "",
    personPostCode: "",
    regulation_id: "",
    reg1: 0,
    reg1Content: "",
    reg2: 0,
    reg2Content: "",
    reg3: 0,
    reg3Content: "",

    rabat_code: null,
    participantInfo: "",
    dealsID: "",
    orderIDPayu: "",
    orderPayUStatus: "",
    OrderPayUTotalAmount: "",
    OrderPayMethod: "",
    orderPayDate: null,
    payuLink: "",
    createdby: "",
  };
  personList: any = [];
  formOptions: FormGroup;
  trainingList: any = [];
  trainingDateList: any = [];
  ticketList = [];
  activeTraining: any = {};
  activeTrainingDate: any = {};
  activeTicket: any = {};
  availableCurrency = [];
  activeCurrency = "PLN";
  // isParticipant: boolean = true;
  // isReportingPerson: boolean = true;
  orderPriceNetto = 0;
  orderPriceBrutto = 0;
  dealData: any = {};
  dealCompany: any = [];
  dealContacts: any = [];
  filteredOptions: any = [];
  productValue = "";

  searchPersonData: any = {};
  filteredContactOptions = [];
  filteredDealsOptions = [];

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {
    this.formOptions = new FormGroup({
      training_id: new FormControl("", Validators.required),
      trainingDate_id: new FormControl("", Validators.required),
      dealsID: new FormControl(""),
      ticketID: new FormControl("", Validators.required),
      take_exam: new FormControl(false),
      take_book: new FormControl(false),
      take_take2: new FormControl(false),
      isCompanyPayer: new FormControl(false, Validators.requiredTrue),
      isPersonPayer: new FormControl(false, Validators.requiredTrue),
      searchPersonInHS: new FormControl(""),

      companyVatID: new FormControl(""),
      companyName: new FormControl(""),
      companyStreet: new FormControl(""),
      companyCity: new FormControl(""),
      companyPostCode: new FormControl(""),
      personStreet: new FormControl(""),
      personCity: new FormControl(""),
      personPostCode: new FormControl(""),
      currency: new FormControl("PLN"),
      formLang: new FormControl("pl"),
      isParticipant: new FormControl(true),
      isReportingPerson: new FormControl({ value: true, disabled: true }),
      noNameTickets: new FormControl(0),
    });
    this.orderService.getProtuctList().subscribe(
      (resp) => {
        this.isLoadingDetails = false;
        this.trainingList = resp;
      },
      (err) => {
        console.error(err);
        this.isLoadingDetails = false;
      }
    );
  }

  ngOnInit(): void {
    // this.formOptions.controls["training_id"].valueChanges.subscribe((value) => {
    // this.isLoadingDetails = true;
    // this.formOptions.controls["trainingDate_id"].setValue("");
    // this.formOptions.controls["ticketID"].setValue("");
    // this.activeTraining = this.trainingList.find((x) => x.id == value);
    // this.ticketList = [];
    // if (this.activeTraining.is_exam_required) {
    //   this.formOptions.controls["take_exam"].setValue(true);
    //   this.formOptions.controls["take_exam"].disable();
    // } else {
    //   this.formOptions.controls["take_exam"].setValue(false);
    // }
    // if (this.activeTraining.is_book_required) {
    //   this.formOptions.controls["take_book"].setValue(true);
    //   this.formOptions.controls["take_book"].disable();
    // } else {
    //   this.formOptions.controls["take_book"].setValue(false);
    // }
    // this.formOptions.controls["take_take2"].setValue(false);
    // this.orderService.getTrainingDateByProduct(value).subscribe(
    //   (resp) => {
    //     this.isLoadingDetails = false;
    //     this.trainingDateList = resp;
    //   },
    //   (err) => {
    //     console.error(err);
    //     this.isLoadingDetails = false;
    //   }
    // );
    // });
    // this.formOptions.controls["trainingDate_id"].valueChanges.subscribe(
    //   (value) => {
    //   }
    // );
    this.formOptions.controls["ticketID"].valueChanges.subscribe((value) => {
      this.activeTicket = this.ticketList.find((x) => x.id == value);
      if (this.personList.length > 0) {
        this.summaryPrice();
      }
    });
    this.formOptions.controls["currency"].valueChanges.subscribe((value) => {
      this.activeCurrency = value;
      this.summaryPrice();
    });
    this.formOptions.controls["take_exam"].valueChanges.subscribe((value) => {
      this.newOrder.take_exam = value;
      this.summaryPrice();
    });
    this.formOptions.controls["take_book"].valueChanges.subscribe((value) => {
      this.newOrder.take_book = value;
      this.summaryPrice();
    });
    this.formOptions.controls["take_take2"].valueChanges.subscribe((value) => {
      this.newOrder.take_take2 = value;
      this.summaryPrice();
    });
    // this.formOptions.controls['isCompanyPayer'].valueChanges.subscribe(value => {
    //   this.changePayPerson();
    // });
    // this.formOptions.controls['isPersonPayer'].valueChanges.subscribe(value => {
    //   this.changePayPerson();
    // });
    this.formOptions.controls["noNameTickets"].valueChanges.subscribe(
      (value) => {
        this.summaryPrice();
      }
    );
    this.formOptions.controls["dealsID"].valueChanges
      .pipe(
        distinctUntilChanged(),
        debounceTime(1000),
        tap((v) => {
          this.isOpitonsLoading = true;
          this.filteredDealsOptions = [];
        })
      )
      .subscribe((dealName) => {
        if (dealName.length > 3) {
          this.orderService.findDealsFromHS(dealName).subscribe(
            (resp) => {
              console.log(resp);
              this.isOpitonsLoading = false;
              this.filteredDealsOptions = resp;
            },
            (err) => {
              this.filteredDealsOptions = [];
            }
          );
        } else {
          this.filteredDealsOptions = [];
          this.isOpitonsLoading = false;
        }
      });
  }
  changeNameTraining(value) {
    this.filteredOptions = this._filter(value);
  }
  private _filter(value): string[] {
    const filterValue = value.toLowerCase();
    this.formOptions.controls["training_id"].setValue("");
    this.formOptions.controls["trainingDate_id"].setValue("");
    this.formOptions.controls["ticketID"].setValue("");

    this.trainingDateList = [];
    this.ticketList = [];
    // let trainingListGetCode = this.trainingList.filter(
    //   (training) => training.kod.toLowerCase() == filterValue
    // );
    // if (trainingListGetCode.length > 0) {
    //   if (this.formOptions.get("idTermTraining").value != "") {
    //     // let oldTrainingID = this.formOptions.get('idTermTraining').value;
    //     let oldTrainingID = this.formOptions
    //       .get("idTermTraining")
    //       .value.split("-");
    //     this.formOptions.controls["idTermTraining"].setValue(
    //       `${oldTrainingID[0]}-${trainingListGetCode[0].kod}`
    //     );
    //   } else {
    //     this.formOptions.controls["idTermTraining"].setValue("");
    //   }
    // }
    return this.trainingList.filter(
      (training) =>
        `${training.kod} - ${training.name_pl}`
          .toLowerCase()
          .indexOf(filterValue) === 0
    );
  }
  getDefaultTicketTraining(value) {
    this.activeTraining = this.trainingList.find((x) => x.name_pl === value);
    if (this.activeTraining) {
      this.isLoadingDetails = true;
      this.formOptions.controls["training_id"].setValue(this.activeTraining.id);
      this.ticketList = [];
      if (this.activeTraining.is_exam_required) {
        this.formOptions.controls["take_exam"].setValue(true);
        this.formOptions.controls["take_exam"].disable();
      } else {
        this.formOptions.controls["take_exam"].setValue(false);
      }
      if (this.activeTraining.is_book_required) {
        this.formOptions.controls["take_book"].setValue(true);
        this.formOptions.controls["take_book"].disable();
      } else {
        this.formOptions.controls["take_book"].setValue(false);
      }
      this.formOptions.controls["take_take2"].setValue(false);

      this.orderService
        .getTrainingDateByProduct(this.activeTraining.id)
        .subscribe(
          (resp) => {
            this.isLoadingDetails = false;
            this.trainingDateList = resp;
          },
          (err) => {
            console.error(err);
            this.isLoadingDetails = false;
          }
        );
    }

    // this.defaultTickets = this.trainingList.find(
    //   (x) => x.name_pl === value
    // ).defaultTickets;

    // this.defaultTickets = this.trainingList.find(
    //   (x) => x.name_pl === value
    // ).defaultTickets;
  }

  changePayPerson() {
    this.formOptions.get("isPersonPayer").enable();
    this.formOptions.get("isCompanyPayer").enable();
    this.formOptions.controls["companyVatID"].setValue("");
    this.formOptions.controls["companyName"].setValue("");
    this.formOptions.controls["companyStreet"].setValue("");
    this.formOptions.controls["companyCity"].setValue("");
    this.formOptions.controls["companyPostCode"].setValue("");
    this.formOptions.controls["personStreet"].setValue("");
    this.formOptions.controls["personCity"].setValue("");
    this.formOptions.controls["personPostCode"].setValue("");

    if (this.formOptions.get("isCompanyPayer").value) {
      this.formOptions.get("isPersonPayer").disable();
      this.formOptions.controls["isPersonPayer"].clearValidators();
      this.formOptions.get("isPersonPayer").updateValueAndValidity();
      this.formOptions.controls["isCompanyPayer"].setValidators(
        Validators.requiredTrue
      );
      this.formOptions.get("isCompanyPayer").updateValueAndValidity();
      this.formOptions.controls["companyVatID"].setValidators(
        Validators.required
      );
      this.formOptions.get("companyVatID").updateValueAndValidity();
      this.formOptions.controls["companyName"].setValidators(
        Validators.required
      );
      this.formOptions.get("companyName").updateValueAndValidity();
      this.formOptions.controls["companyStreet"].setValidators(
        Validators.required
      );
      this.formOptions.get("companyStreet").updateValueAndValidity();
      this.formOptions.controls["companyCity"].setValidators(
        Validators.required
      );
      this.formOptions.get("companyCity").updateValueAndValidity();
      this.formOptions.controls["companyPostCode"].setValidators(
        Validators.required
      );
      this.formOptions.get("companyPostCode").updateValueAndValidity();
      this.formOptions.controls["personStreet"].clearValidators();
      this.formOptions.get("personStreet").updateValueAndValidity();
      this.formOptions.controls["personCity"].clearValidators();
      this.formOptions.get("personCity").updateValueAndValidity();
      this.formOptions.controls["personPostCode"].clearValidators();
      this.formOptions.get("personPostCode").updateValueAndValidity();
    }
    if (this.formOptions.get("isPersonPayer").value) {
      this.formOptions.get("isCompanyPayer").disable();
      this.formOptions.controls["isPersonPayer"].setValidators(
        Validators.requiredTrue
      );
      this.formOptions.get("isPersonPayer").updateValueAndValidity();
      this.formOptions.controls["isCompanyPayer"].clearValidators();
      this.formOptions.get("isCompanyPayer").updateValueAndValidity();
      this.formOptions.controls["companyVatID"].clearValidators();
      this.formOptions.get("companyVatID").updateValueAndValidity();
      this.formOptions.controls["companyName"].clearValidators();
      this.formOptions.get("companyName").updateValueAndValidity();
      this.formOptions.controls["companyStreet"].clearValidators();
      this.formOptions.get("companyStreet").updateValueAndValidity();
      this.formOptions.controls["companyCity"].clearValidators();
      this.formOptions.get("companyCity").updateValueAndValidity();
      this.formOptions.controls["companyPostCode"].clearValidators();
      this.formOptions.get("companyPostCode").updateValueAndValidity();
      this.formOptions.controls["personStreet"].setValidators(
        Validators.required
      );
      this.formOptions.get("personStreet").updateValueAndValidity();
      this.formOptions.controls["personCity"].setValidators(
        Validators.required
      );
      this.formOptions.get("personCity").updateValueAndValidity();
      this.formOptions.controls["personPostCode"].setValidators(
        Validators.required
      );
      this.formOptions.get("personPostCode").updateValueAndValidity();
    }
  }
  onSearchChange(event) {
    this.searchPersonData = null;
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
  onEnter(personHS) {
    this.searchPersonData = {
      personHS_id: personHS.vid,
      firstName: personHS.properties.firstname?.value,
      lastName: personHS.properties.lastname?.value,
      email: personHS.properties.email?.value,
    };
    // this.searchPersonData = newId;
  }
  dealChoise(dealChoice) {
    this.dealData = dealChoice;
    this.isLoadingDetails = true;
    this.orderService
      .getContactCompanyByDeal(this.dealData.id)
      .subscribe((resp) => {
        this.isLoadingDetails = false;
        this.dealCompany = resp.company;
        this.dealContacts = resp.contacts;
        if (this.dealCompany.properties) {
          this.formOptions.get("isCompanyPayer").value;
          this.formOptions.controls["isCompanyPayer"].setValue(true);
          this.formOptions.controls["isPersonPayer"].setValue(false);
          this.formOptions.controls["companyVatID"].setValue(
            this.dealCompany.properties.nip_vat_id
          );
          this.formOptions.controls["companyName"].setValue(
            this.dealCompany.properties.name
          );
          this.formOptions.controls["companyStreet"].setValue(
            this.dealCompany.properties.address
          );
          this.formOptions.controls["companyCity"].setValue(
            this.dealCompany.properties.city
          );
          this.formOptions.controls["companyPostCode"].setValue(
            this.dealCompany.properties.zip
          );

          this.formOptions.controls["personStreet"].setValue("");
          this.formOptions.controls["personCity"].setValue("");
          this.formOptions.controls["personPostCode"].setValue("");

          this.formOptions.get("isPersonPayer").disable();
          this.formOptions.controls["isPersonPayer"].clearValidators();
          this.formOptions.get("isPersonPayer").updateValueAndValidity();
          this.formOptions.controls["isCompanyPayer"].setValidators(
            Validators.requiredTrue
          );
          this.formOptions.get("isCompanyPayer").updateValueAndValidity();
          this.formOptions.controls["companyVatID"].setValidators(
            Validators.required
          );
          this.formOptions.get("companyVatID").updateValueAndValidity();
          this.formOptions.controls["companyName"].setValidators(
            Validators.required
          );
          this.formOptions.get("companyName").updateValueAndValidity();
          this.formOptions.controls["companyStreet"].setValidators(
            Validators.required
          );
          this.formOptions.get("companyStreet").updateValueAndValidity();
          this.formOptions.controls["companyCity"].setValidators(
            Validators.required
          );
          this.formOptions.get("companyCity").updateValueAndValidity();
          this.formOptions.controls["companyPostCode"].setValidators(
            Validators.required
          );
          this.formOptions.get("companyPostCode").updateValueAndValidity();
          this.formOptions.controls["personStreet"].clearValidators();
          this.formOptions.get("personStreet").updateValueAndValidity();
          this.formOptions.controls["personCity"].clearValidators();
          this.formOptions.get("personCity").updateValueAndValidity();
          this.formOptions.controls["personPostCode"].clearValidators();
          this.formOptions.get("personPostCode").updateValueAndValidity();
        }
        if (this.dealContacts) {
          if (this.dealContacts.length > 1) {
            const dealPersons = this.dialog.open(DealPersonsComponent, {
              maxWidth: "650px",
              minWidth: "600px",
              data: {
                header: "Wybierz osobę zgłaszającą",
                contacts: this.dealContacts,
              },
            });
            dealPersons.afterClosed().subscribe((getData) => {
              if (getData) {
                console.log(getData);
                getData.forEach((person) => {
                  this.searchPersonData = person;
                  this.addPersontoList();
                });

                this.toastr.success(
                  "Przypisano osoby do zgłoszenia",
                  "Success"
                );
              }
            });
          } else {
            this.dealContacts.forEach((contact) => {
              this.searchPersonData = {
                personHS_id: contact.vid,
                firstName: contact.properties.firstname?.value,
                lastName: contact.properties.lastname?.value,
                email: contact.properties.email?.value,
              };
              this.addPersontoList();
            });
          }
        }
      });
  }
  matAutocompileEvent(t) {
    console.log(t);
  }
  getGUSData() {
    console.log("gat company data");
    let companyNIP = this.formOptions.get("companyVatID").value;
    companyNIP = companyNIP.replaceAll(" ", "").replaceAll("-", "");

    this.isLoadingDetails = true;
    this.orderService.getCompanyDataGUS(companyNIP).subscribe(
      (resp) => {
        console.log(resp);
        this.isLoadingDetails = false;
        if (resp.errorCode) {
          this.toastr.warning(resp.errorMessagePl, "Brak danych");
          this.newOrder.getCompanyDataGus = 0;
        } else {
          this.newOrder.getCompanyDataGus = 1;
          this.formOptions.controls["companyName"].setValue(resp.name);
          this.formOptions.controls["companyStreet"].setValue(resp.street);
          this.formOptions.controls["companyCity"].setValue(resp.city);
          this.formOptions.controls["companyPostCode"].setValue(resp.postCode);
          this.toastr.success("Wprowadzono dane firmy z GUS", "Success");
        }
      },
      (err) => {
        this.isLoadingDetails = false;
        this.newOrder.getCompanyDataGus = 0;
        this.toastr.error("Błąd podczas pobierania danych z GUS", "Error");
      }
    );

    // if (this.form.companyVatID != "") {
    //   this.sendingLoader = true;
    //   await this.$axios.post(`/gus`, { nip: companyNIP }).then((resp) => {
    //     this.sendingLoader = false;
    //     if (resp.data.errorCode) {
    //       this.form.getCompanyDataGus = 0;
    //       this.$bvToast.toast(this.$i18n.t("kartaZgloszenia.companyNotFound"), {
    //         title: `Error`,
    //         toaster: "b-toaster-top-center",
    //         variant: "danger",
    //         solid: true,
    //       });
    //     } else {
    //       this.form.getCompanyDataGus = 1;
    //       this.form.companyName = resp.data.name;
    //       this.form.companyStreet = resp.data.street;
    //       this.form.companyCity = resp.data.city;
    //       this.form.companyPostCode = resp.data.postCode;
    //     }
    //   });
    // }
  }
  addPersontoList() {
    if (this.searchPersonData) {
      if (this.searchPersonData.isReportingPerson == undefined) {
        this.searchPersonData.isReportingPerson =
          this.formOptions.get("isReportingPerson").value;
      }
      if (this.searchPersonData.isParticipant == undefined) {
        this.searchPersonData.isParticipant =
          this.formOptions.get("isParticipant").value;
      }

      this.searchPersonData.take_exam = this.formOptions.get("take_exam").value;
      this.searchPersonData.take_book = this.formOptions.get("take_book").value;
      this.searchPersonData.take_take2 =
        this.formOptions.get("take_take2").value;

      this.personList.push(this.searchPersonData);
      if (this.personList.length == 1) {
        this.formOptions.controls["isParticipant"].setValue(true);
        this.formOptions.controls["isParticipant"].disable();
        this.formOptions.controls["isReportingPerson"].setValue(false);
        this.formOptions.controls["isReportingPerson"].disable();
      }
      this.filteredContactOptions = [];
      this.searchPersonData = {};

      console.log("remove input value");

      this.formOptions.controls["searchPersonInHS"].setValue("");

      this.onSearchChange("");
      this.summaryPrice();
    } else {
      this.toastr.error("Błąd", "Wybierz osobę z bazy HS");
    }
  }
  removePersonList(index) {
    this.personList.splice(index, 1);
    this.summaryPrice();
  }
  changeTrainingDate(trainigDate_id) {
    this.formOptions.controls["ticketID"].setValue("");
    this.activeTrainingDate = this.trainingDateList.find(
      (x) => x.id == trainigDate_id
    );
    // this.newOrder.reg1Content = this.activeTrainingDate.company.consentPersonalData_pl;
    // this.newOrder.reg2Content = this.activeTrainingDate.company.consentSalesAndMarketing_pl;
    this.availableCurrency = this.activeTrainingDate.currency.split(",");
    this.ticketList = this.activeTrainingDate.allTicket;

    // console.log(trainigDate_id);
    // console.log(this.activeTraining);
    // console.log(this.trainingDateList);
    // let activeTrainingDate = this.trainingDateList.find(
    //   (x) => x.id == trainigDate_id
    // );
    // console.log(activeTrainingDate);
    // this.isLoadingDetails = true;
  }
  clearDealsInput() {
    this.dealContacts = [];
    this.dealCompany = {};
    this.dealData = {};
    this.formOptions.controls["dealsID"].setValue("");
  }
  summaryPrice() {
    this.orderPriceNetto = 0;
    this.orderPriceBrutto = 0;
    this.personList.forEach((person) => {
      if (person.isParticipant) {
        this.orderPriceNetto +=
          this.activeTicket["price_" + this.activeCurrency];
        this.orderPriceBrutto +=
          this.activeTicket["price_" + this.activeCurrency] * 1.23;
        if (this.newOrder.take_exam) {
          this.orderPriceNetto +=
            this.activeTraining["price_exam_" + this.activeCurrency];
          this.orderPriceBrutto +=
            this.activeTraining["price_exam_" + this.activeCurrency] * 1.23;
        }
        if (this.newOrder.take_book) {
          this.orderPriceNetto +=
            this.activeTraining["price_book_" + this.activeCurrency];

          console.log(this.activeTraining);

          if (this.activeTraining.book_iso) {
            this.orderPriceBrutto +=
              this.activeTraining["price_book_" + this.activeCurrency] * 1.05;
          } else {
            this.orderPriceBrutto +=
              this.activeTraining["price_book_" + this.activeCurrency] * 1.23;
          }
        }

        if (this.newOrder.take_take2) {
          this.orderPriceNetto +=
            this.activeTraining["price_Take2_exam_" + this.activeCurrency];
          this.orderPriceBrutto +=
            this.activeTraining["price_Take2_exam_" + this.activeCurrency] *
            1.23;
        }
      }
    });
    if (this.formOptions.value.noNameTickets > 0) {
      this.orderPriceNetto +=
        this.activeTicket["price_" + this.activeCurrency] *
        this.formOptions.value.noNameTickets;
      this.orderPriceBrutto +=
        this.activeTicket["price_" + this.activeCurrency] *
        this.formOptions.value.noNameTickets *
        1.23;
      if (this.newOrder.take_exam > 0) {
        this.orderPriceNetto +=
          this.activeTraining["price_exam_" + this.activeCurrency] *
          this.formOptions.value.noNameTickets;
        this.orderPriceBrutto +=
          this.activeTraining["price_exam_" + this.activeCurrency] *
          this.formOptions.value.noNameTickets *
          1.23;
      }
      if (this.newOrder.take_book > 0) {
        this.orderPriceNetto +=
          this.activeTraining["price_book_" + this.activeCurrency] *
          this.formOptions.value.noNameTickets;
        if (this.activeTraining.book_iso) {
          this.orderPriceBrutto +=
            this.activeTraining["price_book_" + this.activeCurrency] *
            this.formOptions.value.noNameTickets *
            1.05;
        } else {
          this.orderPriceBrutto +=
            this.activeTraining["price_book_" + this.activeCurrency] *
            this.formOptions.value.noNameTickets *
            1.23;
        }
      }
      if (this.newOrder.take_take2 > 0) {
        this.orderPriceNetto +=
          this.activeTraining["price_Take2_exam_" + this.activeCurrency] *
          this.formOptions.value.noNameTickets;
        this.orderPriceBrutto +=
          this.activeTraining["price_Take2_exam_" + this.activeCurrency] *
          this.formOptions.value.noNameTickets *
          1.23;
      }
    }
    this.orderPriceNetto = Number(this.orderPriceNetto.toFixed(2));
    this.orderPriceBrutto = Number(this.orderPriceBrutto.toFixed(2));
  }

  saveNewOrder(formDirective: FormGroupDirective) {
    if (this.personList.length > 0) {
      if (formDirective.form.status == "VALID") {
        let reportingPerson = this.personList.find(
          (x) => x.isReportingPerson == true
        );
        let newOrderData = this.formOptions.getRawValue();
        newOrderData.isActive = 1;
        newOrderData.status_id = 1;
        newOrderData.place_id = this.activeTrainingDate.place_id;
        newOrderData.method_id = this.activeTrainingDate.metoda_id;
        newOrderData.idDiscountCode = null;
        newOrderData.training_id = this.activeTraining.id;
        newOrderData.priceTraining =
          this.activeTicket["price_" + this.activeCurrency];
        newOrderData.totalPrice = this.orderPriceBrutto;
        newOrderData.wherePay = 1;
        newOrderData.getCompanyDataGus = this.newOrder.getCompanyDataGus;
        newOrderData.priceExam =
          this.activeTraining["price_exam_" + this.activeCurrency];
        newOrderData.price_book =
          this.activeTraining["price_book_" + this.activeCurrency];
        newOrderData.price_Take2_exam =
          this.activeTraining["price_Take2_exam_" + this.activeCurrency];
        newOrderData.discountUse = 0;
        newOrderData.regulation_id = this.activeTrainingDate.regulation_id;
        newOrderData.reg1 = 0;
        newOrderData.reg1Content =
          this.activeTrainingDate.company[
            "consentPersonalData_" + this.formOptions.get("formLang").value
          ];
        newOrderData.reg2 = 0;
        newOrderData.reg2Content =
          this.activeTrainingDate.company[
            "consentSalesAndMarketing_" + this.formOptions.get("formLang").value
          ];
        newOrderData.reg3 = 0;
        newOrderData.reg3Content = "";
        newOrderData.rabat_code = null;
        newOrderData.participantInfo = "";
        newOrderData.dealsID = this.dealData.id;
        newOrderData.companyID = this.dealCompany.id;
        newOrderData.orderIDPayu = null;
        newOrderData.orderPayUStatus = "NEW";
        newOrderData.OrderPayUTotalAmount = 0;
        newOrderData.OrderPayMethod = null;
        newOrderData.orderPayDate = null;
        newOrderData.payuLink = "";
        newOrderData.reporting_person_HS_id = reportingPerson.personHS_id;
        delete newOrderData.isReportingPerson;
        delete newOrderData.isParticipant;
        delete newOrderData.searchPersonInHS;
        this.isLoadingDetails = true;
        this.orderService.saveNewOrder(newOrderData, this.personList).subscribe(
          (resp) => {
            console.log(resp);
            this.isLoadingDetails = false;
            this.router.navigate(["orders", resp.id, "details"]);
            this.toastr.success("Dodano nowe zgłoszenie", "Success");
          },
          (err) => {
            this.isLoadingDetails = false;
            this.toastr.error(
              "Błąd podczas dodawania nowego zgłoszenia",
              "Error"
            );
          }
        );
      } else {
        this.toastr.error("Wypełnij wszystkie wymagane pola", "Błąd");
      }
    } else {
      this.toastr.error("Dodaj minimum jedną osobe do zgłoszenia", "Błąd");
    }
  }
}
