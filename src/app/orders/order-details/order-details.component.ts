import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { environment } from "src/environments/environment";
import { OrderService } from "../order.service";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { EditCostsComponent } from "../modal/edit-costs/edit-costs.component";
import { RemoveOrderComponent } from "../modal/remove-order/remove-order.component";
import { ChangeDataDVComponent } from "../modal/change-data-dv/change-data-dv.component";
import { PayLinkGenerateComponent } from "../modal/pay-link-generate/pay-link-generate.component";
import { NoNameTicketAddPersonComponent } from "../modal/no-name-ticket-add-person/no-name-ticket-add-person.component";
import { AddInvoiceComponent } from "../modal/add-invoice/add-invoice.component";
import { RemoveInvoiceComponent } from "../modal/remove-invoice/remove-invoice.component";
import { SetDateInvoiceComponent } from "../modal/set-date-invoice/set-date-invoice.component";
import { DatePipe } from "@angular/common";
import { DateAdapter } from "@angular/material/core";
import { ViewEmailMsgComponent } from "../modal/view-email-msg/view-email-msg.component";
import { VindicationEmailComponent } from "../modal/vindication-email/vindication-email.component";
import { InvoicePositionComponent } from "../modal/invoice-position/invoice-position.component";
import { ChangeEventComponent } from "../modal/change-event/change-event.component";
import { AuthService } from "src/app/auth/auth.service";
import { MatTableDataSource } from "@angular/material/table";
import { AddEditOrderPersonComponent } from "../modal/add-edit-order-person/add-edit-order-person.component";

@Component({
  selector: "app-order-details",
  templateUrl: "./order-details.component.html",
  styleUrls: ["./order-details.component.scss"],
})
export class OrderDetailsComponent implements OnInit {
  HSId = environment.HSId;

  formOptions: FormGroup;
  idOrder: number;
  orderLoading = true;
  personList: any = [];
  personReporting: any = [];
  order: any = [];
  orderTraining: any = [];
  orderTrainingDate: any = [];
  orderAvailableTickets: any = [];
  orderMethod: any = [];
  orderPlace: any = [];
  orderStatus: any = [];
  orderCompany: any = {};
  orderVindication: any = [];
  invoicePositions: any = [];
  discountDetails: any = {};
  invoices: any = [];
  orderHistory: any = [];
  orderTicket: any = [];
  orderNotes: any = [];
  availableDoscountCode: any = [];
  HubSpotId = environment.HSId;
  formNonameTicketsConlea = environment.formNonameTicketsConlea;
  formNonameTicketsLmit = environment.formNonameTicketsLmit;
  trainingUsers = 0;
  countBook = 0;
  countExam = 0;
  countTake2 = 0;
  isCostLoading = false;
  personListLoading = false;
  personIDs = [];
  pageLoading = false;
  dateNow = new Date();
  statusID = 0;
  selectedStatus: any = {};
  reportingPerson: any = {};
  noteError: boolean = false;
  newNoteContent: any = {};
  tabNoteToEdit = [];
  userData: any = {};
  noteToShow: number = 3;
  noteUnresolved = 0;
  selectedDiscountOrder = "";
  isInvoiceVAT = false;
  public historyListLoading: boolean = false;

  usersListSource: MatTableDataSource<any>;
  usersListColumns = ["person", "contact", "ticket", "additives", "action"];

  constructor(
    private orderService: OrderService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private router: Router,
    private toastr: ToastrService,
    private dateAdapter: DateAdapter<Date>,
    private authService: AuthService,
    private datePipe: DatePipe,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dateAdapter.getFirstDayOfWeek = () => {
      return 1;
    };
    this.orderLoading = true;

    this.authService.userData.subscribe((userData) => {
      this.userData = userData;
    });
    this.idOrder = Number(this.route.snapshot.paramMap.get("id"));

    this.formOptions = new FormGroup({
      status_id: new FormControl("", Validators.required),
    });
    if (this.idOrder > 0) {
      this.orderService.orderDetail(this.idOrder).subscribe(
        (resp) => {
          this.trainingUsers = 0;
          this.personReporting = [];
          this.orderLoading = false;
          this.order = resp.order;
          this.orderTraining = resp.orderTraining;
          this.orderTrainingDate = resp.orderTrainingDate;
          this.orderMethod = resp.orderMethod;
          this.orderPlace = resp.orderPlace;
          this.personList = resp.orderPersonList;
          this.orderCompany = resp.company;
          this.discountDetails = resp.discount;
          this.invoices = resp.invoices;
          this.orderTicket = resp.orderTicket;
          this.orderStatus = resp.statusList;
          this.orderNotes = resp.orderNotes;
          this.invoicePositions = resp.invoicePositions;
          this.availableDoscountCode = resp.availableDoscountCode;
          this.orderHistory = resp.orderHistory;
          this.orderVindication = resp.vindicationList;
          this.statusID = this.order.status_id;
          this.reportingPerson = resp.reportingPerson;
          this.orderAvailableTickets = resp.orderAvailableTickets;

          // this.reportingPerson = this.personList.find(person => person.isReportingPerson == 1);

          if (this.invoices.length > 0) {
            this.invoices.forEach((invoice) => {
              if (!this.isInvoiceVAT) {
                if (invoice.kind === "proforma") {
                  this.isInvoiceVAT = true;
                }
              }
            });
          }
          // ile notatek nierozwiązanych
          this.checkAndSortNote();

          this.convertPersonList(this.personList);

          this.changeDetector.detectChanges();
          this.usersListSource = new MatTableDataSource(this.personList);
          // this.usersListSource.paginator = this.paginatorOrderHistoryList;

          if (!this.order.vindication_email) {
            if (this.reportingPerson) {
              this.order.vindication_email = this.reportingPerson.email;
            } else {
              this.order.vindication_email = "";
            }
          }
          this.selectedStatus = this.orderStatus.find(
            (status) => status.id === this.order.status_id
          );
        },
        (err) => {
          console.error(err);
          this.orderLoading = false;
          this.toastr.error(
            "Nie udało się pobrać szczegółów terminu szkolenia",
            "Błąd"
          );
        }
      );
    }
  }
  convertPersonList(perosnList) {
    if (perosnList) {
      this.trainingUsers = 0;
      this.countBook = 0;
      this.countExam = 0;
      this.countTake2 = 0;

      let isNoNameTicketinPersonList = this.personList.filter(
        (person) => person.personHS_id == 0
      );
      if (isNoNameTicketinPersonList.length) {
        this.order.noNameTickets = isNoNameTicketinPersonList.length;
      }

      if (isNoNameTicketinPersonList) {
        this.order.noNameTickets = 0;
      }
      this.personList.forEach((person) => {
        if (person.id) {
          this.personIDs.push(person.id);
        }
        if (person.take_book) {
          this.countBook += 1;
        }
        if (person.take_exam) {
          this.countExam += 1;
        }
        if (person.take_take2) {
          this.countTake2 += 1;
        }
        this.trainingUsers += 1;
      });
    }
  }
  updateOrder(formDirective: FormGroupDirective) {}
  calculateDiff(date: string) {
    if (date) {
      let d2: Date = new Date();
      let d1 = Date.parse(date); //time in milliseconds
      let timeDiff = d2.getTime() - d1;
      let diff = timeDiff / (1000 * 3600 * 24);
      return Math.floor(diff);
    } else {
      return date;
    }
  }
  calculateNoteDateDiff(date: string) {
    let d2: Date = new Date();
    let d11: Date = new Date(date);
    d2.setHours(0, 0, 0, 0);
    d11.setHours(0, 0, 0, 0);
    let d1 = Date.parse(d11.toString()); //time in milliseconds
    var timeDiff = d2.getTime() - d1;
    var diff = timeDiff / (1000 * 3600 * 24);
    if (Math.floor(diff) > 0) {
      if (Math.floor(diff) == 1) {
        return Math.floor(diff) + " dzień temu";
      } else {
        return Math.floor(diff) + " dni temu";
      }
    } else {
      return this.datePipe.transform(date, "HH:mm");
    }
  }
  checkAndSortNote() {
    this.noteUnresolved = 0;
    if (this.orderNotes.length > 0) {
      this.orderNotes.forEach((note) => {
        if (note.is_task && note.task_done == 0) {
          this.noteUnresolved += 1;
        }
      });
    }
  }
  removeOrder(id: number) {
    const removeOrder = this.dialog.open(RemoveOrderComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: "Czy na pewno chcesz usunąć zamówienie???" },
    });
    removeOrder.afterClosed().subscribe((remove) => {
      if (remove) {
        this.orderService.removeOrder(id).subscribe(
          (resp) => {
            this.router.navigate(["orders"]);
            this.toastr.success("Poprawnie usunięto zgłoszenie", "Success");
          },
          (err) => {
            this.toastr.error("Błąd podczas usuwania zgłoszenia", "Error");
          }
        );
      }
    });
  }
  editOrderCosts() {
    const editCosts = this.dialog.open(EditCostsComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Edytuj koszty zamówienia",
        order: this.order,
        trainingPerson: this.trainingUsers,
        training: this.orderTraining,
        availableDoscountCode: this.availableDoscountCode,
      },
    });
    editCosts.afterClosed().subscribe((getCosts) => {
      if (getCosts) {
        this.isCostLoading = true;
        delete getCosts["userEdit"];
        delete getCosts["updated_at"];
        this.orderService.orderUpdate(this.order.id, getCosts).subscribe(
          (resp) => {
            this.isCostLoading = false;
            this.order = resp.order;
            this.orderHistory = resp.orderHistory;
            this.trainingUsers =
              this.order.noNameTickets +
              this.personList.length -
              this.personReporting.length;
            this.toastr.success("Zaktualizowano koszty zamówienia", "Success");
          },
          (err) => {
            console.error(err);
            this.isCostLoading = false;
            this.toastr.error(
              "Błąd podczas edycji kosztów zamówienia",
              "Error"
            );
          }
        );
      }
    });
  }
  editOrderFV() {
    const editDataFV = this.dialog.open(ChangeDataDVComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: "Edytuj dane do FV", order: this.order },
    });
    editDataFV.afterClosed().subscribe((getData) => {
      if (getData) {
        this.orderService.orderUpdate(this.order.id, getData).subscribe(
          (resp) => {
            this.order = resp.order;
            this.orderHistory = resp.orderHistory;
            this.toastr.success("Zaktualizowano Dane do FV", "Success");
          },
          (err) => {
            console.error(err);
            this.toastr.error("Błąd podczas edycji danych do FV", "Error");
          }
        );
      }
    });
  }
  editPayData() {
    let productToPay = [];
    let totalPriceVAT =
      this.order.priceTraining * 1.23 * 100 * this.trainingUsers;
    if (this.order.take_exam > 0) {
      totalPriceVAT += this.order.priceExam * 1.23 * 100 * this.trainingUsers;
    }
    if (this.order.take_book > 0) {
      if (this.orderTraining.book_iso) {
        totalPriceVAT +=
          this.order.price_book * 1.05 * 100 * this.trainingUsers;
      } else {
        totalPriceVAT +=
          this.order.price_book * 1.23 * 100 * this.trainingUsers;
      }
    }
    if (this.order.take_take2 > 0) {
      totalPriceVAT +=
        this.order.price_Take2_exam * 1.23 * 100 * this.trainingUsers;
    }

    let dataToPayU = {
      company_id: this.orderTrainingDate.company_id,
      amount: totalPriceVAT,
      currency: this.order.currency,
      externalId: `${this.orderTraining.kod}/${this.order.id}`,
      description: this.orderTraining.name_pl,
      continueUrl: `${this.orderCompany.urlReg}${this.orderTrainingDate.id}?id=${this.order.id}`,
      buyer: {
        email: this.reportingPerson.email,
        firstName: this.reportingPerson.firstname,
        lastName: this.reportingPerson.lastname,
        phone: {
          prefix: "+48",
          number: this.reportingPerson.phone.replace("+48", ""),
        },
      },
    };
    const editPayData = this.dialog.open(PayLinkGenerateComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: "Edytuj Płatność", order: this.order, payu: dataToPayU },
    });
    editPayData.afterClosed().subscribe((newOrderData) => {
      if (newOrderData) {
        this.order = newOrderData.newOrder;
        this.orderHistory = newOrderData.orderHistory;
      }
    });
  }
  saveStatus() {
    this.selectedStatus = this.orderStatus.find(
      (status) => status.id == this.statusID
    );
    let dataToSend = {
      id: this.order.id,
      status_id: this.statusID,
      pesronIDs: this.personIDs,
    };
    this.orderService.orderUpdate(this.order.id, dataToSend).subscribe(
      (resp) => {
        this.order = resp.order;
        this.orderHistory = resp.orderHistory;
        this.toastr.success("Zaktualizowano status zamówienia", "Success");
      },
      (err) => {
        console.error(err);
        this.toastr.error("Błąd podczas edycji statusu zamówienia", "Error");
      }
    );
  }
  addPersonToNoNameTicket(ticketToUpdate) {
    const addPersonToTicket = this.dialog.open(NoNameTicketAddPersonComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: "Przypisz osobę do biletu" },
    });
    addPersonToTicket.afterClosed().subscribe((idPerson) => {
      if (idPerson) {
        this.personListLoading = true;
        if (ticketToUpdate.id) {
          ticketToUpdate.personHS_id = idPerson;
        } else {
          ticketToUpdate = {
            trainingDate_id: this.orderTrainingDate.id,
            order_id: this.order.id,
            ticketUse_id: this.order.ticketID,
            personHS_id: idPerson,
            isParticipant: 1,
            isReportingPerson: 0,
            status: "",
          };
          switch (this.order.status_id) {
            case 1:
              ticketToUpdate.status = "PROVISIONAL";
              break;
            case 2:
              ticketToUpdate.status = "CONFIRMED";
              break;
            case 3:
              ticketToUpdate.status = "CONFIRMED";
              break;
            case 4:
              ticketToUpdate.status = "CANCEL";
              break;
            default:
              ticketToUpdate.status = "PROVISIONAL";
              break;
          }
        }
        this.orderService.addPersonToNoNameTicket(ticketToUpdate).subscribe(
          (resp) => {
            this.order = resp.order;
            this.personList = resp.orderPersonList;
            this.convertPersonList(this.personList);
            this.changeDetector.detectChanges();
            this.usersListSource = new MatTableDataSource(this.personList);
            this.personListLoading = false;
            this.toastr.success("Przypisano osobę do biletu", "Success");
          },
          (err) => {
            console.log(err);
            this.personListLoading = false;
            this.toastr.error(
              "Błąd podczas przypisywania osoby do biletu",
              "Error"
            );
          }
        );
      }
    });
  }
  addOrderInvoice(kind) {
    let details = {
      kind,
      order_id: this.order.id,
      payment_to: "",
    };

    const addNewInvoice = this.dialog.open(SetDateInvoiceComponent, {
      maxWidth: "380px",
      minWidth: "380px",
      data: {
        header: "Ustaw termin płatności",
        company: this.orderCompany,
        order: this.order,
      },
    });
    addNewInvoice.afterClosed().subscribe((getData) => {
      console.log(getData);
      if (getData) {
        // YYYY - MM - DD
        details.payment_to = this.datePipe.transform(getData, "yyyy-MM-dd");
        this.pageLoading = true;
        this.orderService.generateInvioce(details).subscribe(
          (resp) => {
            this.pageLoading = false;
            this.invoices = resp.invoices;
            this.invoices.forEach((invoice) => {
              if (!this.isInvoiceVAT) {
                if ((invoice.kind = "proforma")) {
                  this.isInvoiceVAT = true;
                }
              }
            });
            this.orderHistory = resp.orderHistory;
            this.toastr.success(`Dodano nową fakturę ${kind}`, "Success");
          },
          (err) => {
            console.error(err);
            this.pageLoading = false;
            this.toastr.error("Błąd podczas generowania faktury", "Error");
          }
        );
      }
    });
  }
  updateInvoice(invoice_id, kind) {
    let details = {
      kind,
      order_id: this.order.id,
      invoice_id,
    };
    this.pageLoading = true;
    this.orderService.updateInvoice(details, invoice_id).subscribe(
      (resp) => {
        console.log(resp);
        this.pageLoading = false;
        this.invoices = resp.invoices;
        this.invoices.forEach((invoice) => {
          if (!this.isInvoiceVAT) {
            if ((invoice.kind = "proforma")) {
              this.isInvoiceVAT = true;
            }
          }
        });
        this.orderHistory = resp.orderHistory;
        this.toastr.success("Zaktualizowano dane faktury", "Success");
      },
      (err) => {
        console.error(err);
        this.pageLoading = false;
        this.toastr.error("Błąd podczas aktualizowania faktury", "Error");
      }
    );
  }
  addInvoice() {
    const addNewInvoice = this.dialog.open(AddInvoiceComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Dodaj fakturę",
        company: this.orderCompany,
        order: this.order,
      },
    });
    addNewInvoice.afterClosed().subscribe((getData) => {
      if (getData) {
        this.toastr.success("Dodano nową fakturę", "Success");
        // this.invoices.unshift(getData);
        this.invoices = getData.invoices;
        this.orderHistory = getData.orderHistory;
      }
    });
  }
  transformInvoice(invoice) {
    this.orderService
      .transformInvoiceToVat({
        invoice,
        company_id: this.orderCompany.id,
        order_id: this.order.id,
      })
      .subscribe(
        (resp) => {
          console.log(resp);
          this.pageLoading = false;
          this.invoices = resp.invoices;
          this.invoices.forEach((invoice) => {
            if (!this.isInvoiceVAT) {
              if ((invoice.kind = "proforma")) {
                this.isInvoiceVAT = true;
              }
            }
          });
          this.orderHistory = resp.orderHistory;
          this.toastr.success(
            "Wygenerowano fakture VAT na podstawie proformy",
            "Success"
          );
        },
        (err) => {
          console.error(err);
          this.pageLoading = false;
          this.toastr.error("Błąd podczas generowania faktury VAT", "Error");
        }
      );
  }
  removeInvoice(invoice_id) {
    console.log(invoice_id);
    let dataToSend = {
      removeFv: false,
      order_id: this.order.id,
      company_id: this.orderCompany.id,
      invoice_id,
    };
    let invoice = this.invoices.find((x) => x.invoice_id == invoice_id);

    const deleteInvoice = this.dialog.open(RemoveInvoiceComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: "Czy usunąć fv nr: " + invoice.number + " ??" },
    });
    deleteInvoice.afterClosed().subscribe((getData) => {
      if (getData) {
        dataToSend.removeFv = getData.removeFromFakturownia;
        this.orderService.removeInvoice(dataToSend).subscribe(
          (resp) => {
            this.invoices = resp.invoices;
            if (this.invoices.length > 0) {
              this.invoices.forEach((invoice) => {
                if (!this.isInvoiceVAT) {
                  if ((invoice.kind = "proforma")) {
                    this.isInvoiceVAT = true;
                  }
                }
              });
            }
            this.orderHistory = resp.orderHistory;
            this.toastr.success(
              "Usunięto fv numer: " + invoice.number,
              "Success"
            );
          },
          (err) => {
            console.error(err);
            this.toastr.error(
              "Błąd podczas usuwania faktury z zamówienia",
              "Error"
            );
          }
        );
      }
    });
  }
  changeUserOrder(person) {
    console.log(person);
    const addPersonToTicket = this.dialog.open(NoNameTicketAddPersonComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: `Zamień osobę na:` },
    });
    addPersonToTicket.afterClosed().subscribe((idPersonHS) => {
      if (idPersonHS) {
        this.pageLoading = true;
        this.orderService.updateOrderPerson(idPersonHS, person).subscribe(
          (resp) => {
            this.pageLoading = false;
            this.personList = resp.orderPersonList;
            this.orderHistory = resp.orderHistory;

            this.convertPersonList(this.personList);
            // gdy mamy bilety bezimienne w zamówieniu: noNameTickets
            if (this.order.noNameTickets) {
              for (let index = 0; index < this.order.noNameTickets; index++) {
                this.personList.push({
                  firstname: "Pozycja nieprzypisana",
                  email: "",
                  isParticipant: 1,
                  personHS_id: 0,
                  order_id: this.order.id,
                  participant_role: "1",
                  phone: "",
                  ticketUse_id: this.order.ticketID,
                  trainingDate_id: this.order.trainingDate_id,
                });
              }
            }

            this.changeDetector.detectChanges();
            this.usersListSource = new MatTableDataSource(this.personList);
          },
          (err) => {
            console.error(err);
            this.pageLoading = false;
            this.toastr.error("Błąd podczas zmiany uczestnika", "Error");
          }
        );
      }
    });
  }
  sendInvoice(invoice) {
    let participants = [];
    this.personList.forEach((person) => {
      participants.push({
        firstname: person.firstname,
        lastname: person.lastname,
      });
    });
    let countNoNameTicket = false;
    if (this.order.noNameTickets > 0) {
      countNoNameTicket = this.order.noNameTickets;
    }
    let isGUSData = false;
    if (this.order.getCompanyDataGus > 0) {
      isGUSData = true;
    }
    let isProforma = false;
    if (invoice.kind == "proforma") {
      isProforma = true;
    }
    let invoiceVat = false;
    if (invoice.kind == "vat") {
      invoiceVat = true;
    }

    let isNoPay = true;
    if (
      this.order.orderPayUStatus == "CONFIRMED" ||
      this.order.orderPayUStatus == "COMPLETED"
    ) {
      isNoPay = false;
    }
    let objToSend = {
      order_id: this.order.id,
      firstName: this.reportingPerson.firstname,
      lastName: this.reportingPerson.lastname,
      sendMail: this.reportingPerson.email,
      company_id: this.orderCompany.id,
      eventName: this.orderTraining["name_" + this.order.formLang],
      invoiceUrl: invoice.view_url,
      dataFromGUS: isGUSData,
      invoiceKind: isProforma,
      invoiceProforma: isProforma,
      invoiceVAT: invoiceVat,
      payment_to: this.datePipe.transform(invoice.payment_to, "yyyy-MM-dd"),
      useLang: this.order.formLang,
      invoiceNumber: invoice.number,
      noNameTickets: countNoNameTicket,
      isNoPay,
      ticketName: this.orderTicket["name_" + this.order.formLang],
      participants,
    };
    this.pageLoading = true;
    this.orderService.sendInvoice(objToSend).subscribe(
      (resp) => {
        this.pageLoading = false;
        this.orderHistory = resp;
        this.toastr.success("Wysłano FV nr: " + invoice.number, "Success");
      },
      (err) => {
        console.error(err);
        this.pageLoading = false;
        this.toastr.error("Błąd podczas wysyłania wiadomości", "Error");
      }
    );
  }
  editPayTerm(invoice) {
    const addNewInvoice = this.dialog.open(SetDateInvoiceComponent, {
      maxWidth: "380px",
      minWidth: "380px",
      data: {
        header: "Edytuj termin płatności",
        invoice: invoice,
        company: this.orderCompany,
        order: this.order,
      },
    });
    addNewInvoice.afterClosed().subscribe((getData) => {
      if (getData) {
        // invoice.payment_to = this.datePipe.transform(getData, 'yyyy-MM-dd');
        let dataToChange = {
          invoice: invoice,
          company: this.orderCompany,
          order_id: this.order.id,
          payment_to: this.datePipe.transform(getData, "yyyy-MM-dd"),
        };
        this.orderService.updateInvoiceDate(dataToChange).subscribe(
          (resp) => {
            this.invoices = resp.invoices;
            this.orderHistory = resp.orderHistory;
            this.toastr.success("Ustawiono nowy termin płatności", "Success");
          },
          (err) => {
            console.error(err);
            this.toastr.error(
              "Błąd podczas ustawiania terminu płatności",
              "Error"
            );
          }
        );
      }
    });
  }
  showEmailVindication(email) {
    this.dialog.open(ViewEmailMsgComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: "Treść wiadomości windykacyjnej", email },
    });
  }
  changeVindicationEmail() {
    let changeEmail = this.dialog.open(VindicationEmailComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Zmień adres windykacyjny",
        emailToChange: this.order.vindication_email,
      },
    });
    changeEmail.afterClosed().subscribe((getData) => {
      if (getData) {
        let dataToUpdate = {
          id: this.order.id,
          vindication_email: getData,
        };
        this.orderService.orderUpdate(this.order.id, dataToUpdate).subscribe(
          (resp) => {
            this.order = resp.order;
            this.orderHistory = resp.orderHistory;
            this.toastr.success("Zaktualizowano email windykacyjny", "Success");
          },
          (err) => {
            console.error(err);
            this.toastr.error("Błąd podczas aktualizacji", "Error");
          }
        );
      }
    });
  }
  addNewPositionToInvoice() {
    const addNewInvoicePosition = this.dialog.open(InvoicePositionComponent, {
      maxWidth: "860px",
      minWidth: "640px",
      data: {
        header: "Dodaj nową pozycje do faktury",
        company: this.orderCompany,
        order: this.order,
      },
    });
    addNewInvoicePosition.afterClosed().subscribe((getData) => {
      if (getData) {
        this.orderService.saveNewInvoicePosition(getData).subscribe(
          (resp) => {
            this.invoicePositions = resp.invoicePositions;
            this.orderHistory = resp.orderHistory;
            this.toastr.success("Dodano nową pozycję do faktury", "Success");
          },
          (err) => {
            console.error(err);
            this.toastr.error(
              "Błąd podczas dodawania nowej pozycji do faktury",
              "Error"
            );
          }
        );
      }
    });
  }
  editPositionToInvoice(invoicePosition) {
    const editInvoicePosition = this.dialog.open(InvoicePositionComponent, {
      maxWidth: "860px",
      minWidth: "640px",
      data: {
        header: "Edytuj pozycje do faktury",
        invoicePosition,
        order: this.order,
      },
    });
    editInvoicePosition.afterClosed().subscribe((getData) => {
      if (getData) {
        this.orderService.editInvoicePosition(getData).subscribe(
          (resp) => {
            this.invoicePositions = resp.invoicePositions;
            this.orderHistory = resp.orderHistory;
            this.toastr.success("Edytowano pozycję do faktury", "Success");
          },
          (err) => {
            console.error(err);
            this.toastr.error(
              "Błąd podczas edycji pozycji do faktury",
              "Error"
            );
          }
        );
      }
    });
  }
  removePositionToInvoice(invoicePosition) {
    invoicePosition.active = 0;
    delete invoicePosition.userCreate;
    this.orderService.editInvoicePosition(invoicePosition).subscribe(
      (resp) => {
        this.invoicePositions = resp.invoicePositions;
        this.orderHistory = resp.orderHistory;
        this.toastr.success("Usunieto pozycję z faktury", "Success");
      },
      (err) => {
        console.error(err);
        this.toastr.error("Błąd podczas usuwania pozycji z faktury", "Error");
      }
    );
  }
  changeEvent() {
    const changeEvent = this.dialog.open(ChangeEventComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Zmień termin wydarzenia",
        activeTrainingDate: this.orderTrainingDate,
        productName: this.orderTraining.name_pl,
      },
    });
    changeEvent.afterClosed().subscribe((eventNewTerm) => {
      if (eventNewTerm) {
        this.orderService.orderUpdate(this.order.id, eventNewTerm).subscribe(
          (resp) => {
            this.order = resp.order;
            this.orderHistory = resp.orderHistory;
            this.ngOnInit();
            this.toastr.success("Zaktualizowano termin wydarzenia", "Success");
          },
          (err) => {
            console.error(err);
            this.toastr.error(
              "Błąd podczas edycji terminu wydarzenia",
              "Error"
            );
          }
        );
      }
    });
  }
  addNewNote() {
    this.newNoteContent.note = this.newNoteContent.note.trim();
    if (this.newNoteContent.note != "") {
      this.noteError = false;
      this.newNoteContent.order_id = this.order.id;
      this.orderService.addNewNoteInOrder(this.newNoteContent).subscribe(
        (resp) => {
          this.toastr.success("Dodano nową notatkę", "Success");
          this.orderNotes = resp;
          this.newNoteContent = {
            note: "",
            is_task: false,
          };
        },
        (err) => {
          console.error(err);
          this.toastr.error("Błąd podczas dodawania nowej notatki", "Error");
        }
      );
    } else {
      this.noteError = true;
    }
  }
  editNote(noteToEdit, index) {
    this.orderService
      .editNoteInOrder({
        id: noteToEdit.id,
        order_id: this.order.id,
        note: noteToEdit.note,
      })
      .subscribe(
        (resp) => {
          this.toastr.success("Edytowano notaktkę", "Success");
          this.orderNotes = resp;
          this.checkAndSortNote();
          this.tabNoteToEdit[index] = false;
        },
        (err) => {
          console.error(err);
          this.toastr.error("Błąd podczas edycji notatki", "Error");
        }
      );
  }
  noteIsaTask(noteTask) {
    this.orderService
      .editNoteInOrder({
        id: noteTask.id,
        order_id: this.order.id,
        is_task: 1,
      })
      .subscribe(
        (resp) => {
          this.toastr.success("Edytowano notaktkę", "Success");
          this.orderNotes = resp;
          this.checkAndSortNote();
        },
        (err) => {
          console.error(err);
          this.toastr.error("Błąd podczas edycji notatki", "Error");
        }
      );
  }
  noteIsDone(noteIsDone) {
    this.orderService
      .editNoteInOrder({
        id: noteIsDone.id,
        order_id: this.order.id,
        task_done: 1,
      })
      .subscribe(
        (resp) => {
          this.toastr.success("Edytowano notaktkę", "Success");
          this.orderNotes = resp;
          this.checkAndSortNote();
        },
        (err) => {
          console.error(err);
          this.toastr.error("Błąd podczas edycji notatki", "Error");
        }
      );
  }
  deleteNote(noteToDelete, index) {
    this.orderService
      .editNoteInOrder({
        id: noteToDelete.id,
        order_id: this.order.id,
        active: 0,
      })
      .subscribe(
        (resp) => {
          this.toastr.success("Usunięto notaktkę", "Success");
          this.orderNotes = resp;
          this.tabNoteToEdit[index] = false;
          this.checkAndSortNote();
        },
        (err) => {
          console.error(err);
          this.toastr.error("Błąd podczas usuwania notatki", "Error");
        }
      );
  }
  editNoteIndex(index) {
    this.tabNoteToEdit[index] = true;
  }
  seeMoreNotes() {
    this.noteToShow += 3;
  }
  addNewPersonToOrder() {
    const addNewPerson = this.dialog.open(AddEditOrderPersonComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: `Dodaj nową osobę do zamówienia`,
        order: this.order,
        training: this.orderTraining,
        tickets: this.orderAvailableTickets,
        trainingDate: this.orderTrainingDate,
      },
    });
    addNewPerson.afterClosed().subscribe((newPerson) => {
      if (newPerson) {
        this.orderService.addNewPersonToOrder(newPerson).subscribe(
          (resp) => {
            this.order = resp.order;
            this.orderHistory = resp.orderHistory;
            this.personList = resp.orderPersonList;
            this.convertPersonList(this.personList);
            this.changeDetector.detectChanges();
            this.usersListSource = new MatTableDataSource(this.personList);
            // order, orderPersonList, orderHistory;
            this.toastr.success(
              "Dodano nowego uczestnika do zamówienia",
              "Success"
            );
          },
          (err) => {
            console.error(err);
            this.toastr.error(
              "Błąd podczas dodawania nowego uczestnika",
              "Error"
            );
          }
        );
      }
    });
  }
  refreshHistoryList(mailsLogId) {
    this.historyListLoading = true;
    this.orderService.refreshMailNotification(mailsLogId).subscribe(
      (resp) => {
        this.orderHistory = resp;
        this.toastr.success(
          "Pobrano nowe informacje o wysłanej wiadomości",
          "Success"
        );
        this.historyListLoading = false;
      },
      (err) => {
        console.error(err);
        this.toastr.error(
          "Nie udało się pobrać nowego statusu wiadomości",
          "Błąd"
        );
        this.historyListLoading = false;
      }
    );
  }
  editPersonInOrder(personToUpdate) {
    console.log(personToUpdate);
    const editPerson = this.dialog.open(AddEditOrderPersonComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: `Edytuj bilet zamawiającego`,
        order: this.order,
        personTicket: personToUpdate,
        training: this.orderTraining,
        tickets: this.orderAvailableTickets,
        trainingDate: this.orderTrainingDate,
      },
    });
    editPerson.afterClosed().subscribe((editPerson) => {
      if (editPerson) {
        this.orderService.editPersonTicketInOrder(editPerson).subscribe(
          (resp) => {
            this.order = resp.order;
            this.orderHistory = resp.orderHistory;
            this.personList = resp.orderPersonList;
            this.convertPersonList(this.personList);
            this.changeDetector.detectChanges();
            this.usersListSource = new MatTableDataSource(this.personList);
            this.toastr.success("Edytowano uczestnika w zamówieniu", "Success");
          },
          (err) => {
            console.error(err);
            this.toastr.error("Błąd podczas edycji uczestnika", "Error");
          }
        );
      }
    });
  }

  // priceChanged() {
  //   console.log("change");
  //   // let totalPrice = 0;
  //   // let priceTraining = this.formOptions.get("priceTraining").value;
  //   // let priceExam = this.formOptions.get("priceExam").value;
  //   // let priceBook = this.formOptions.get("price_book").value;
  //   // let priceTake2 = this.formOptions.get("price_Take2_exam").value;
  //   // let personToSum =
  //   //   this.personSaveInOrder + this.formOptions.get("noNameTickets").value;

  //   // if (this.formOptions.get("idDiscountCode").value) {
  //   //   let selectDiscount = this.availableDoscountCode.find(
  //   //     (x) => x.id == this.formOptions.get("idDiscountCode").value
  //   //   );
  //   //   if (selectDiscount.product == "training") {
  //   //     if (selectDiscount.type == "percent") {
  //   //       priceTraining =
  //   //         (priceTraining -
  //   //           (priceTraining * selectDiscount.code_value) / 100) *
  //   //         personToSum;
  //   //     } else {
  //   //       priceTraining =
  //   //         priceTraining * personToSum - selectDiscount.code_value;
  //   //     }
  //   //   }

  //   //   if (selectDiscount.product == "exam") {
  //   //     if (selectDiscount.type == "percent") {
  //   //       priceExam = priceExam - (priceExam * selectDiscount.code_value) / 100;
  //   //     } else {
  //   //       priceExam = priceExam * personToSum - selectDiscount.code_value;
  //   //     }
  //   //   }
  //   //   if (selectDiscount.product == "book") {
  //   //     if (selectDiscount.type == "percent") {
  //   //       priceBook = priceBook - (priceBook * selectDiscount.code_value) / 100;
  //   //     } else {
  //   //       priceBook = priceBook * personToSum - selectDiscount.code_value;
  //   //     }
  //   //   }
  //   // } else {
  //   //   priceTraining = priceTraining * personToSum * 1.23;
  //   // }

  //   // totalPrice = priceTraining;
  //   // // console.log(this.formOptions.get('take_exam').value);
  //   // if (this.formOptions.get("take_exam").value) {
  //   //   this.formOptions.get("priceExam").enable();
  //   //   totalPrice += priceExam * personToSum * 1.23;
  //   // } else {
  //   //   this.formOptions.get("priceExam").disable();
  //   // }
  //   // if (this.formOptions.get("take_book").value) {
  //   //   this.formOptions.get("price_book").enable();
  //   //   if (this.training.book_iso != "") {
  //   //     totalPrice += priceBook * personToSum * 1.05;
  //   //   } else {
  //   //     totalPrice += priceBook * personToSum * 1.23;
  //   //   }
  //   // } else {
  //   //   this.formOptions.get("price_book").disable();
  //   // }
  //   // if (this.formOptions.get("take_take2").value) {
  //   //   this.formOptions.get("price_Take2_exam").enable();
  //   //   totalPrice += priceTake2 * personToSum * 1.23;
  //   // } else {
  //   //   this.formOptions.get("price_Take2_exam").disable();
  //   // }
  //   // console.log(totalPrice);
  //   // this.formOptions.controls["totalPrice"].setValue(totalPrice);
  // }
  addDiscountToOrder() {
    console.log(this.order.idDiscountCode);
  }
}
