import {
  Component,
  OnInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
} from "@angular/core";
import { TrainingDatesService } from "../training-dates.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { AddPersonToTrainingComponent } from "../modal/add-person-to-training/add-person-to-training.component";
import { AddTrainingTicketComponent } from "../modal/add-training-ticket/add-training-ticket.component";
import { MatTableDataSource } from "@angular/material/table";
import { MatSort } from "@angular/material/sort";
import { MatPaginator } from "@angular/material/paginator";
import { ChangeRoleComponent } from "../modal/change-role/change-role.component";
import { SetColumnsComponent } from "../modal/set-columns/set-columns.component";
import { ExportToCSV } from "@molteni/export-csv";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { DiscountCodeComponent } from "../modal/discount-code/discount-code.component";
import * as customBuildPlaceholders from "../../../assets/ck-editor-placeholders/ckeditor";

import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { AddCommentComponent } from "../modal/add-comment/add-comment.component";
import { AuthService } from "src/app/auth/auth.service";
import { environment } from "src/environments/environment";
import { AddInvoiceComponent } from "src/app/orders/modal/add-invoice/add-invoice.component";
import { AddCostInvoiceByIdComponent } from "../modal/add-cost-invoice-by-id/add-cost-invoice-by-id.component";
import { AddCostManualComponent } from "../modal/add-cost-manual/add-cost-manual.component";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";

@Component({
  selector: "app-training-dates-details",
  templateUrl: "./training-dates-details.component.html",
  styleUrls: ["./training-dates-details.component.scss"],
})
export class TrainingDatesDetailsComponent implements OnInit {
  public Editor = customBuildPlaceholders;
  public ckeConfig = {
    placeholder: "Treść wiadomości",
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
  // new var
  dateNow = new Date();
  isLoading: boolean = true;
  isCommentLoading: boolean = false;
  isCostsLoading: boolean = false;
  trainingDate: any = {};
  training: any = {};
  company: any = {};
  trainer: any = {};
  idTrainingDate: number;
  personConfirm: number = 0;
  priceInfo = {
    priceConfirm: 0,
    priceToConfirm: 0,
    priceMax: 0,
  };
  method: any = {};
  place: any = {};
  status: any = {};
  costsList: any = [];
  personList: any = [];
  eventOwner: any = {};
  salesOwner: any = {};
  orderList: any = [];
  commentList: any = [];
  participantRoles: any = [];
  trainingDateHistory: any = [];
  personDataSource: MatTableDataSource<any>;
  allTickets = [];
  attrTicket = [];
  discountCode: any = [];
  public ticketsLoading: boolean = false;
  userList: any = [];
  ticketDataSource: MatTableDataSource<any>;
  costsDataSource: MatTableDataSource<any>;
  orderDataSource: MatTableDataSource<any>;
  discountDataSource: MatTableDataSource<any>;
  @ViewChild("ticketListTable", { static: false }) ticketListTable: any;
  ticketColumns: string[] = [
    "name",
    "termValidity",
    "price_PLN",
    "limit",
    "isUse",
    "left",
    "income",
    "action",
  ];
  personColumns: string[] = [
    "name",
    "role",
    "company",
    "email",
    "phone",
    "status",
    "order",
  ];
  orderColumns: string[] = [
    "orderName",
    "reportPerson",
    "company",
    "invoice",
    "price",
    "orderStatus",
    "action",
  ];
  discountColumns: string[] = [
    "codeName",
    "term",
    "value",
    "isUse",
    "limit",
    "left",
    "income",
    "action",
  ];
  costsColumns: string[] = [
    "cost_number",
    "name",
    "price",
    "confirmed",
    "action",
  ];
  availablePersonColumn: string[] = ["name"];
  availableDays: number[] = [];
  exportToCSV = new ExportToCSV();
  sendTo = [];
  sendFrom = "";
  mailText = "";
  formOptions: FormGroup;
  isLoadingMessage = false;
  userData: any = {};
  HubSpotId = environment.HSId;
  showAvailablePersonList = false;
  profit: number = 0;
  profitPrecent: number = 0;
  costConfirmed: number = 0;
  costToConfirmed: number = 0;

  // old var
  userTypeFilter: any = [];
  filtredArray = [];

  searchTrainingDates = "";

  @ViewChild("personListTable", { static: false }) personListTable: any;

  @ViewChild("availablePersonListTable", { static: false })
  availablePersonListTable: any;

  @ViewChild("paginatorListContact") paginatorListContact: MatPaginator;
  @ViewChild(MatSort) sortListContact: MatSort;

  @ViewChild("paginatorPersonList") paginatorPersonList: MatPaginator;
  @ViewChild("paginatorOrderList") paginatorOrderList: MatPaginator;

  @ViewChild("matSortPerson") sortListPerson: MatSort;

  constructor(
    private authService: AuthService,
    private trainingDateDetails: TrainingDatesService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private changeDetector: ChangeDetectorRef
  ) {
    this.authService.userData.subscribe((resp) => {
      console.log(resp);
      this.userData = resp;
    });
  }

  allColumns = [
    { showToEdit: false, checked: true, name: "name", label: "Nazwa" },
    { showToEdit: false, checked: true, name: "role", label: "Rola" },
    { showToEdit: true, checked: true, name: "company", label: "Firma" },
    { showToEdit: true, checked: true, name: "email", label: "Email" },
    { showToEdit: true, checked: true, name: "phone", label: "Telefon" },
    { showToEdit: true, checked: true, name: "status", label: "Status" },
    { showToEdit: true, checked: true, name: "order", label: "Zamówienie" },
  ];

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      sendTo: new FormControl("", Validators.required),
      sendFrom: new FormControl("", Validators.required),
      mailSubject: new FormControl("", Validators.required),
      mailText: new FormControl("", Validators.required),
    });
    this.idTrainingDate = Number(this.route.snapshot.paramMap.get("id"));

    this.trainingDateDetails.trainingDateDetail(this.idTrainingDate).subscribe(
      (resp) => {
        this.trainingDate = resp.trainingDate;
        this.training = resp.training;
        this.company = resp.company;
        this.place = resp.place;
        this.method = resp.place;
        this.status = resp.status;
        this.costsList = resp.costsList;
        this.status.color_status = JSON.parse(resp.status.color_status);
        this.allTickets = resp.tickets;
        this.attrTicket = resp.ticketAttr;
        this.personList = resp.personLists;
        this.salesOwner = resp.salesOwner;
        this.trainer = resp.trainer;
        this.eventOwner = resp.eventOwner;
        this.discountCode = resp.discountCode;
        this.participantRoles = resp.participantRoles;
        this.userList = resp.users;
        this.orderList = resp.orderList;
        this.commentList = resp.comments;
        this.trainingDateHistory = resp.trainingDateHistory;

        // diff date start end
        let diffTime =
          new Date(this.trainingDate.dateend).getTime() -
          new Date(this.trainingDate.datestart).getTime();
        let diffDays = diffTime / (1000 * 3600 * 24) + 1; //Diference in Days
        for (let index = 0; index < diffDays; index++) {
          this.availablePersonColumn.push("day" + (index + 1));
          this.availableDays.push(index + 1);
        }

        this.personList.forEach((person, index) => {
          if (person.orderID.status_id == 2) {
            this.personConfirm += 1;
          }
          person.statusColor = JSON.parse(person.statusColor);
          person = this.getRoleParticipant(person);
          this.sendTo.push(person.email);
          // przygotowanie tabeli pod obecności
          if (person.isAvailable == null) {
            person.isAvailable = [];
            for (let index = 0; index < diffDays; index++) {
              person.isAvailable[index] = 0;
            }
          } else {
            // tu event gdy ma zoznaczoną obecność
            person.isAvailable = person.isAvailable
              .split(",")
              .map((i) => Number(i));
          }
        });
        // czy pokazać listę z obecnością
        if (new Date() >= new Date(this.trainingDate.datestart)) {
          this.showAvailablePersonList = true;
        } else {
          this.showAvailablePersonList = false;
        }

        this.formOptions.controls["sendTo"].setValue(this.sendTo);
        if (this.allTickets.length > 0) {
          this.trainingDate.maxperson = 0;
          this.allTickets.forEach((ticket, index) => {
            this.trainingDate.maxperson += ticket.useLimit;
            this.priceInfo.priceMax += ticket.price_PLN * ticket.useLimit;
          });
        }
        this.participantRoles.forEach((role) => {
          if (role.color_status != "") {
            role.color_status = JSON.parse(role.color_status);
          }
        });
        this.orderList.forEach((order) => {
          if (order.personlist[0]) {
            order.reportingPerson = this.personList.find(
              (x) => x.id == order.personlist[0].id
            );
          }
          order.status.color_status = JSON.parse(order.status.color_status);
          if (order.status_id == 1) {
            this.priceInfo.priceToConfirm += order.totalPrice;
          } else if (order.status_id == 2) {
            this.priceInfo.priceConfirm += order.totalPrice;
          }
        });

        this.isLoading = false;
        this.changeDetector.detectChanges();
        this.personDataSource = new MatTableDataSource(this.personList);
        this.personDataSource.paginator = this.paginatorPersonList;
        this.personDataSource.sort = this.sortListPerson;
        this.personDataSource.filterPredicate = this.customFilterPredicate();

        this.ticketDataSource = new MatTableDataSource(this.allTickets);
        this.discountDataSource = new MatTableDataSource(this.discountCode);
        this.orderDataSource = new MatTableDataSource(this.orderList);
        this.costsDataSource = new MatTableDataSource(this.costsList);
        this.orderDataSource.paginator = this.paginatorOrderList;

        this.summaryOfTheCosts();
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
        this.toastr.error(
          "Nie udało się pobrać szczegółów terminu szkolenia",
          "Błąd"
        );
      }
    );

    // old on init
    // this.dateAdapter.getFirstDayOfWeek = () => { return 1 };

    if (localStorage.getItem("eventDetailsColumns")) {
      let columnLocal = JSON.parse(localStorage.getItem("eventDetailsColumns"));
      if (columnLocal.length == this.allColumns.length) {
        this.allColumns = columnLocal;
      }
      this.personColumns = this.createArrayColumns(this.allColumns);
    }
  }
  // new functions
  activeForm(status) {
    let toastText = "";
    if (status == 1) {
      this.trainingDate.activeRegister = 0;
      toastText = "Formularz rejestracyjny jest nieaktywny";
    } else {
      this.trainingDate.activeRegister = 1;
      toastText = "Formularz rejestracyjny jest aktywny";
    }
    let toSend = {
      activeRegister: this.trainingDate.activeRegister,
    };
    this.trainingDateDetails
      .updateTrainingDate(this.idTrainingDate, toSend)
      .subscribe(
        (resp) => {
          // this.trainingDate = resp;
          this.toastr.success(toastText, "Success");
        },
        (err) => {
          console.error(err);
          this.toastr.error("Wystąpił błąd podczas zapisywania", "Błąd");
        }
      );
  }

  getRoleParticipant(participant) {
    participant.participantRole = [];
    participant.roleName = [];
    participant.participant_role.forEach((roleId) => {
      let roleObj = this.participantRoles.find((x) => x.id == roleId);
      if (roleObj) {
        participant.participantRole.push(roleObj);
        participant.roleName.push(roleObj.name);
        let userType = this.userTypeFilter.find((x) => x.id == roleId);
        if (userType) {
          userType.count += 1;
        } else {
          this.userTypeFilter.push({
            id: roleId,
            count: 1,
            name: roleObj.name,
          });
        }
      }
    });
    return participant;
  }

  public onListDrop(event: CdkDragDrop<any>) {
    let primaryArray = [];
    this.ticketDataSource.filteredData.map((data, index) => {
      primaryArray.push(data.rank);
    });
    let prevIndex = this.ticketDataSource.filteredData.findIndex(
      (d) => d === event.item.data
    );
    moveItemInArray(
      this.ticketDataSource.filteredData,
      prevIndex,
      event.currentIndex
    );
    let endArray = [];
    this.ticketDataSource.filteredData.map((data, index) => {
      data.rank = index;
      endArray.push(data);
    });
    if (primaryArray.toString() !== endArray.toString()) {
      this.ticketsLoading = true;
      this.trainingDateDetails
        .updateTicketsRank(this.ticketDataSource.filteredData)
        .subscribe(
          (resp) => {
            console.log(resp);
            this.toastr.success(
              "Kolejność wyświetlania biletów została zmieniona",
              "Success"
            );
          },
          (err) => {
            this.ticketsLoading = false;
            this.toastr.error("Błąd zmiany kolejności biletów", "Błąd");
          },
          () => {
            this.ticketsLoading = false;
          }
        );
    }
    this.ticketListTable.renderRows();
  }
  // old functions
  addPersonToTrainingData() {
    const addPerson = this.dialog.open(AddPersonToTrainingComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: "Dodaj osobę do terminu szkolenia" },
    });
    addPerson.afterClosed().subscribe((getPersonFromHS) => {
      if (getPersonFromHS) {
        let addPersonToTraining = {
          trainingDate_id: this.trainingDate.id,
          personHS_id: getPersonFromHS,
          isParticipant: 1,
          isReportiongPerson: 0,
        };
      }
    });
  }
  addDiscountCode() {
    const editDiscountCode = this.dialog.open(DiscountCodeComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: "Dodaj kod rabatowy", trainingDate: this.trainingDate },
    });
    editDiscountCode.afterClosed().subscribe((editDiscountData) => {
      if (editDiscountData) {
        this.discountCode.push(editDiscountData);
        this.changeDetector.detectChanges();
        this.discountDataSource = new MatTableDataSource(this.discountCode);
      }
    });
  }
  editDiscountCode(discount) {
    const editDiscountCode = this.dialog.open(DiscountCodeComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: "Edytuj kod rabatowy", editDiscount: discount },
    });
    editDiscountCode.afterClosed().subscribe((editDiscountData) => {
      if (editDiscountData) {
        let foundIndex = this.discountCode.findIndex(
          (x) => x.id == editDiscountData.id
        );
        this.discountCode[foundIndex] = editDiscountData;
        this.changeDetector.detectChanges();
        this.discountDataSource = new MatTableDataSource(this.discountCode);
      }
    });
  }
  addTicket() {
    const addTrainingTicket = this.dialog.open(AddTrainingTicketComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Dodaj radzaj miejsca",
        trainingDateId: this.idTrainingDate,
        ticketAttr: this.attrTicket,
        currency: this.trainingDate.currency,
      },
    });
    addTrainingTicket.afterClosed().subscribe((resp) => {
      if (resp) {
        this.allTickets = resp.tickets;
        this.trainingDateHistory = resp.trainingDateHistory;
        this.changeDetector.detectChanges();
        this.ticketDataSource = new MatTableDataSource(this.allTickets);
        this.ticketDataSource.paginator = this.paginatorListContact;
        this.ticketDataSource.sort = this.sortListContact;
      }
    });
  }
  editTicket(id) {
    let ticketToEdit = this.allTickets.find((x) => x.id == id);
    let indexTicket = this.allTickets.findIndex((x) => x.id == id);
    const editTrainingTicket = this.dialog.open(AddTrainingTicketComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Edytuj rodzaj miejsca",
        ticket: ticketToEdit,
        ticketAttr: this.attrTicket,
        currency: this.trainingDate.currency,
      },
    });
    editTrainingTicket.afterClosed().subscribe((getTicketData) => {
      if (getTicketData) {
        this.allTickets = getTicketData.tickets;
        this.trainingDateHistory = getTicketData.trainingDateHistory;

        this.changeDetector.detectChanges();
        this.ticketDataSource = new MatTableDataSource(this.allTickets);
        this.ticketDataSource.paginator = this.paginatorListContact;
        this.ticketDataSource.sort = this.sortListContact;
      }
    });
  }
  sendMail(formDirective: FormGroupDirective) {
    if (this.formOptions.valid) {
      let mailGroupData = this.formOptions.value;
      mailGroupData.templateId = this.company.sendgridGroupMail_id;
      mailGroupData.trainingDate_id = this.trainingDate.id;
      // mailGroupData.trainingDate = this.datePipe.transform(this.trainingDate.datestart, 'dd-MM') + ' - ' + this.datePipe.transform(this.trainingDate.dateend, 'dd-MM-yyyy');
      // console.log(mailGroupData);
      this.isLoadingMessage = true;
      this.trainingDateDetails.sendGroupMail(mailGroupData).subscribe(
        (resp) => {
          this.isLoadingMessage = false;
          mailGroupData = "";
          formDirective.resetForm();
          this.trainingDateHistory = resp;
        },
        (err) => {
          console.error(err);
          this.isLoadingMessage = false;
          this.toastr.error("Błąd podczas wysyłania maila grupowego", "Błąd");
        }
      );
    }
  }
  copyTicket(id) {
    let ticketToCopy = this.allTickets.find((x) => x.id == id);
    const copyTrainingTicket = this.dialog.open(AddTrainingTicketComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Kopiuj rodzaj miejsca",
        copy: true,
        ticket: ticketToCopy,
        ticketAttr: this.attrTicket,
      },
    });
    copyTrainingTicket.afterClosed().subscribe((copyTicketData) => {
      if (copyTicketData) {
        this.allTickets.push(copyTicketData);
        this.changeDetector.detectChanges();
        this.ticketDataSource = new MatTableDataSource(this.allTickets);
        this.ticketDataSource.paginator = this.paginatorListContact;
        this.ticketDataSource.sort = this.sortListContact;
      }
    });
  }
  addComment() {
    console.log("add comment");
    const addNewComment = this.dialog.open(AddCommentComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: { header: "Dodaj notatkę", trainingDate: this.trainingDate },
    });
    addNewComment.afterClosed().subscribe((newComment) => {
      if (newComment) {
        this.isCommentLoading = true;
        this.trainingDateDetails.saveNewComment(newComment).subscribe(
          (resp) => {
            this.isCommentLoading = false;
            console.log(resp);
            this.commentList = resp;
          },
          (err) => {
            console.error(err);
            this.isCommentLoading = false;
            this.toastr.error("Błąd podczas wysyłania maila grupowego", "Błąd");
          }
        );
      }
    });
  }
  editComment(comment) {
    const editComment = this.dialog.open(AddCommentComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Edytuj notatkę",
        trainingDate: this.trainingDate,
        comment,
      },
    });
    editComment.afterClosed().subscribe((editContent) => {
      if (editContent) {
        this.isCommentLoading = true;
        this.trainingDateDetails.editComment(editContent).subscribe(
          (resp) => {
            this.isCommentLoading = false;
            console.log(resp);
            this.commentList = resp;
          },
          (err) => {
            console.error(err);
            this.isCommentLoading = false;
            this.toastr.error("Błąd podczas edycji notatki", "Błąd");
          }
        );
      }
    });
  }
  deleteComment(comment) {
    comment.active = 0;
    this.trainingDateDetails.editComment(comment).subscribe(
      (resp) => {
        this.isCommentLoading = false;
        this.commentList = resp;
      },
      (err) => {
        console.error(err);
        this.isCommentLoading = false;
        this.toastr.error("Błąd podczas usuwania notatki", "Błąd");
      }
    );
  }
  openRoleModal(person) {
    let colorStatus = person.color_status;
    let orderID = person.orderID;
    let company = person.company;
    let firstname = person.firstname;
    let lastname = person.lastname;
    let email = person.email;
    let phone = person.phone;
    let statusName = person.statusName;
    let statusColor = person.statusColor;

    const changeRolePerson = this.dialog.open(ChangeRoleComponent, {
      maxWidth: "650px",
      minWidth: "250px",
      data: { header: "Zmień role", person, roles: this.participantRoles },
    });
    changeRolePerson.afterClosed().subscribe((newRolePerson) => {
      if (newRolePerson) {
        person.participant_role = newRolePerson.toString();
        this.trainingDateDetails
          .updateParticipantTraining(person.id, {
            participant_role: person.participant_role,
          })
          .subscribe(
            (resp) => {
              person.participant_role = person.participant_role
                .split(",")
                .map(Number);
              // this.userTypeFilter = [];
              let newPerson = this.getRoleParticipant(person);
              newPerson.color_status = colorStatus;
              newPerson.orderID = orderID;
              newPerson.company = company;
              newPerson.firstname = firstname;
              newPerson.lastname = lastname;
              newPerson.email = email;
              newPerson.phone = phone;
              newPerson.statusName = statusName;
              newPerson.statusColor = statusColor;
              this.toastr.success("Role uczestnika zapisane", "Success");
            },
            (err) => {
              console.error(err);
              this.toastr.error("Błąd zapisu roli uczestnika", "Błąd");
            }
          );
      }
    });
  }
  applyFilter(filterValue: string) {
    let newValue = filterValue;
    if (this.filtredArray.length > 0) {
      this.filtredArray.forEach((name) => {
        newValue += "+" + name;
      });
    }

    this.personDataSource.filter = newValue.trim().toLowerCase();
    if (this.personDataSource.paginator) {
      this.personDataSource.paginator.firstPage();
    }
  }
  filterTypeTraining(idName) {
    if (this.filtredArray.includes(idName)) {
      const index = this.filtredArray.indexOf(idName);
      if (index > -1) {
        this.filtredArray.splice(index, 1);
      }
    } else {
      this.filtredArray.push(idName);
    }
    this.applyFilter(this.searchTrainingDates);
  }
  setColumns() {
    const changeColumns = this.dialog.open(SetColumnsComponent, {
      maxWidth: "650px",
      minWidth: "350px",
      data: { header: "Edytuj kolumny", columns: this.allColumns },
    });
    changeColumns.afterClosed().subscribe((newColumns) => {
      if (newColumns) {
        localStorage.setItem("eventDetailsColumns", JSON.stringify(newColumns));
        this.personColumns = this.createArrayColumns(newColumns);
      }
    });
  }

  createArrayColumns(oldColumns): string[] {
    let newArray = [];
    oldColumns.forEach((column) => {
      if (column.checked) {
        newArray.push(column.name);
      }
    });
    return newArray;
  }
  getFile(fileType) {
    var filteredData = this.personDataSource.filteredData;
    let headerArray = [
      "firstname",
      "lastname",
      "email",
      "company",
      "phone",
      "order_status",
    ];
    if (fileType == "csv") {
      let objToConvert = [];
      filteredData.forEach((participant) => {
        objToConvert.push({
          firstname: participant.firstname,
          lastname: participant.lastname,
          email: participant.email,
          company: participant.company,
          phone: participant.phone,
          role: participant.roleName,
          order_status: participant.statusName,
          order_nr: `${this.trainingDate.idTermTraining}/${participant.order_id}`,
        });
      });
      this.exportToCSV.exportColumnsToCSV(
        objToConvert,
        `${this.training.name_short_en}.${fileType}`,
        headerArray
      );
    }
    if (fileType == "pdf") {
      this.changeDetector.detectChanges();
      let DATA = this.personListTable["_elementRef"].nativeElement;
      html2canvas(DATA).then((canvas) => {
        let fileWidth = 208;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;

        const FILEURI = canvas.toDataURL("image/png");
        let PDF = new jsPDF("p", "mm", "a4");
        let position = 0;
        PDF.addImage(FILEURI, "PNG", 0, position, fileWidth, fileHeight);

        PDF.save(`${this.training.name_short_en}.${fileType}`);
      });
    }
  }
  getFileAvailablePerson(fileType) {
    var filteredData = this.personDataSource.filteredData;
    let headerArray = ["firstname", "lastname", "email", "company", "phone"];
    this.availableDays.forEach((element) => {
      headerArray.push("day_" + element);
    });
    if (fileType == "csv") {
      let objToConvert = [];
      filteredData.forEach((participant, i) => {
        objToConvert.push({
          Name: participant.firstname,
          lastname: participant.lastname,
          email: participant.email,
          company: participant.company,
          phone: participant.phone,
        });
        this.availableDays.forEach((element, index) => {
          objToConvert[i]["day_" + element] = participant.isAvailable[index];
        });
      });
      console.log(objToConvert);
      this.exportToCSV.exportColumnsToCSV(
        objToConvert,
        `${this.training.name_short_en}-lista_obecnosci.${fileType}`,
        headerArray
      );
    }
    if (fileType == "pdf") {
      this.changeDetector.detectChanges();
      let DATA = this.availablePersonListTable["_elementRef"].nativeElement;
      html2canvas(DATA).then((canvas) => {
        let fileWidth = 208;
        let fileHeight = (canvas.height * fileWidth) / canvas.width;

        const FILEURI = canvas.toDataURL("image/png");
        let PDF = new jsPDF("p", "mm", "a4");
        let position = 0;
        PDF.addImage(FILEURI, "PNG", 0, position, fileWidth, fileHeight);

        PDF.save(`${this.training.name_short_en}-lista_obecności.${fileType}`);
      });
    }
  }
  customFilterPredicate() {
    const myFilterPredicate = (data, filters: string): boolean => {
      const matchFilter = [];
      const filterArray = filters.split("+");
      // console.log(filterArray);

      const columns = (<any>Object).values(data);
      // OR be more specific [data.name, data.race, data.color];

      // Main
      filterArray.forEach((filter) => {
        const customFilter = [];
        columns.forEach((column) => {
          customFilter.push(
            JSON.stringify(column).toLowerCase().includes(filter)
          );
        });
        matchFilter.push(customFilter.some(Boolean)); // OR
      });
      return matchFilter.every(Boolean); // AND
    };
    return myFilterPredicate;
  }
  // obecności
  availableEvent(e, person, day) {
    if (e.checked) {
      person.isAvailable[day - 1] = 1;
    } else {
      person.isAvailable[day - 1] = 0;
    }
    let isAvailableString = person.isAvailable.toString();
    this.trainingDateDetails
      .availablePerson(person.id, {
        id: person.id,
        isAvailable: isAvailableString,
      })
      .subscribe((resp) => {
        console.log(resp);
      });

    // let simpleArrayNumbers = isAvailableString.split(",").map(i => Number(i));
    // console.log(simpleArrayNumbers);
  }
  summaryOfTheCosts() {
    this.costConfirmed = 0;
    this.costToConfirmed = 0;
    this.profit = 0;
    this.profitPrecent = 0;
    this.costsList.forEach((cost) => {
      if (cost.isConfirmed) {
        this.costConfirmed += Number(cost.cost_price);
      } else {
        this.costToConfirmed += Number(cost.cost_price);
      }
    });
    this.profit = this.priceInfo.priceConfirm - this.costConfirmed;
    // this.profitPrecent = parseFloat(((Math.round(this.profit * 100) / 100) / 100).toFixed(2));
    this.profitPrecent = parseFloat(
      ((this.profit / this.priceInfo.priceConfirm) * 100).toFixed(2)
    );
    // this.profitPrecent = parseFloat(Math.round(((this.profit / this.priceInfo.priceConfirm * 100) * 100) / 100).toFixed(2));
  }
  addCostManual() {
    const addNewCostManual = this.dialog.open(AddCostManualComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Dodaj koszt do wydarzenia",
        company: this.company,
        trainingDate: this.trainingDate,
      },
    });
    addNewCostManual.afterClosed().subscribe((getData) => {
      if (getData) {
        this.costsList = getData;
        this.costsDataSource = new MatTableDataSource(this.costsList);
        this.summaryOfTheCosts();
        this.toastr.success("Dodano nowy koszt", "Success");
      }
    });
  }
  editCost(cost) {
    console.log(cost);
    const editCostManual = this.dialog.open(AddCostManualComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Edytuj koszt do wydarzenia",
        company: this.company,
        trainingDate: this.trainingDate,
        cost,
      },
    });
    editCostManual.afterClosed().subscribe((getData) => {
      if (getData) {
        this.costsList = getData;
        this.costsDataSource = new MatTableDataSource(this.costsList);
        this.summaryOfTheCosts();
        this.toastr.success("Dodano nowy koszt", "Success");
      }
    });
  }
  addCostByID() {
    const addNewCostInvoice = this.dialog.open(AddCostInvoiceByIdComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Dodaj koszt po ID faktury",
        company: this.company,
        trainingDate: this.trainingDate,
      },
    });
    addNewCostInvoice.afterClosed().subscribe((getData) => {
      if (getData) {
        this.costsList = getData;
        this.costsDataSource = new MatTableDataSource(this.costsList);
        this.summaryOfTheCosts();
        this.toastr.success("Dodano nowy koszt po ID", "Success");
        // this.invoices.unshift(getData);
        // this.invoices = getData.invoices;
        // this.orderHistory = getData.orderHistory;
      }
    });
  }
  addCostAll() {
    this.isCostsLoading = true;
    this.trainingDateDetails
      .getAllCostsTrainingDate(this.trainingDate.id, this.company.id)
      .subscribe(
        (resp) => {
          this.isCostsLoading = false;
          this.costsList = resp;
          this.costsDataSource = new MatTableDataSource(this.costsList);
          this.summaryOfTheCosts();
          this.toastr.success(
            "Dodano wszystkie koszty wydarzenia z fakturownii",
            "Success"
          );
        },
        (err) => {
          this.isCostsLoading = false;
          console.error(err);
          this.toastr.error(
            "Błąd podczas pobierania wszystkich kosztów",
            "Błąd"
          );
        }
      );
  }
  removeCost(cost) {
    this.isCostsLoading = true;
    this.trainingDateDetails
      .removeCost(cost.id, this.trainingDate.id)
      .subscribe(
        (resp) => {
          this.isCostsLoading = false;
          this.costsList = resp;
          this.costsDataSource = new MatTableDataSource(this.costsList);
          this.summaryOfTheCosts();
          this.toastr.success("Usunięto koszt z wydarzenia", "Success");
        },
        (err) => {
          console.error(err);
          this.isCostsLoading = false;
          this.toastr.error("Błąd podczas usuwania kosztów", "Błąd");
        }
      );
  }
}
