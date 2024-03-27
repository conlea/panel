import { AuthService } from "./../../auth/auth.service";

import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { TrainingDatesService } from "../training-dates.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ToastrService } from "ngx-toastr";
import { environment } from "src/environments/environment";
import { faWpforms } from "@fortawesome/free-brands-svg-icons";
import { SetColumnsComponent } from "../modal/set-columns/set-columns.component";
import { MatDialog } from "@angular/material/dialog";
import { faPercentage } from "@fortawesome/free-solid-svg-icons";
import { DatePipe } from "@angular/common";
// import {} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-training-dates-list",
  templateUrl: "./training-dates-list.component.html",
  styleUrls: ["./training-dates-list.component.scss"],
})
export class TrainingDatesListComponent implements OnInit {
  searchTrainingDates = "";
  formLinkConlea = environment.formLinkConlea;

  allColumns = [
    { showToEdit: false, checked: true, name: "idTermTraining", label: "ID" },
    { showToEdit: false, checked: true, name: "training", label: "Nazwa" },
    { showToEdit: true, checked: true, name: "trainingType", label: "Typ" },
    { showToEdit: true, checked: true, name: "dateStartEnd", label: "Termin" },
    { showToEdit: true, checked: true, name: "place", label: "Lokalizacja" },
    { showToEdit: true, checked: true, name: "lang", label: "Język" },
    {
      showToEdit: true,
      checked: true,
      name: "participants",
      label: "Uczestnicy",
    },
    { showToEdit: true, checked: true, name: "status", label: "Status" },
  ];

  displayedColumns: string[] = [
    "idTermTraining",
    "training",
    "trainingType",
    "dateStartEnd",
    "lang",
    "place",
    "participants",
    "status",
  ];
  dataSourceActive: MatTableDataSource<any>;
  dataSourceArchive: MatTableDataSource<any>;
  dataSourceAll: MatTableDataSource<any>;
  loadingActiveTraining = true;
  loadingArchiveTraining = true;
  loadingAllTraining = true;
  tActive: any = [];
  tArchive: any = [];
  tAll: any = [];
  wpforms = faWpforms;
  tabIndex = 0;
  selectIndex = "";
  selectDate = "";
  registerType: any[];
  filtredArray = [];
  activeTab = "eventNow";
  percentage = faPercentage;
  dateStart = "";
  dateEnd = "";

  @ViewChild("paginatorListTrainingDatesActive")
  paginatorListTrainingDatesActive: MatPaginator;
  @ViewChild("paginatorListTrainingDatesArchive")
  paginatorListTrainingDatesArchive: MatPaginator;
  @ViewChild("paginatorListTrainingDatesAll")
  paginatorListTrainingDatesAll: MatPaginator;
  @ViewChild("matSortActive") sortListTrainingDatesActive: MatSort;
  @ViewChild("matSortArchive") sortListTrainingDatesArchive: MatSort;
  @ViewChild("matSortAll") sortListTrainingDatesAll: MatSort;

  constructor(
    private authService: AuthService,
    private trainingDatesService: TrainingDatesService,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadingActiveTraining = true;
    this.tActive = [];
    this.tArchive = [];

    if (localStorage.getItem("eventColumns")) {
      let columnLocal = JSON.parse(localStorage.getItem("eventColumns"));
      if (columnLocal.length == this.allColumns.length) {
        this.allColumns = columnLocal;
      }
      this.displayedColumns = this.createArrayColumns(this.allColumns);
    }

    this.trainingDatesService.trainingDatesListActive().subscribe((resp) => {
      this.loadingActiveTraining = false;
      this.changeDetector.detectChanges();
      this.convertObjectToTable(resp);
      this.dataSourceActive = new MatTableDataSource(this.tActive);
      this.dataSourceActive.paginator = this.paginatorListTrainingDatesActive;
      this.dataSourceActive.sort = this.sortListTrainingDatesActive;
      this.dataSourceActive.filterPredicate = this.customFilterPredicate();
    });
  }
  convertObjectToTable(dataEvents) {
    this.tActive = [];
    this.tArchive = [];
    this.tAll = [];
    let tableObj = [];
    let typeTraining = [];
    if (dataEvents) {
      dataEvents.forEach((training) => {
        // filtracja nad lista wydarzeń
        let eventt = typeTraining.filter(
          (x) => x.name === training.eventType?.name_pl
        );
        if (eventt.length > 0) {
          eventt[0].count += 1;
        } else {
          typeTraining.push({
            id: "evt-" + training.event_type,
            name: training.eventType?.name_pl,
            count: 1,
          });
        }
        let isColor = "";
        if (training.status?.color_status) {
          isColor = JSON.parse(training.status?.color_status);
        }
        tableObj.push({
          id: training.id,
          idTraining: training.training?.kod,
          training: training.training?.name_pl,
          ticketCount: training.ticketList?.length,
          activeRegister: training.activeRegister,
          idTermTraining: training.idTermTraining,
          eventType: "evt-" + training.eventType?.id,
          eventTypeName: training.eventType?.name_pl,
          status: training.status?.name_pl,
          statusColor: isColor,
          maxPerson: training.maxperson,
          countParticipants: training.personlist?.length,
          place: training.place?.name_pl,
          placeRemote: training.place?.remote,
          lang: training.lang,
          datestart: training.datestart,
          dateend: training.dateend,
        });
      });
    }
    this.registerType = typeTraining;

    if (this.tabIndex == 0) {
      this.tActive = tableObj;
    } else if (this.tabIndex == 1) {
      this.tArchive = tableObj;
    } else {
      this.tAll = tableObj;
    }
  }
  onTabChanged(event) {
    if (event != this.tabIndex || this.selectDate != this.selectIndex) {
      this.tabIndex = event;
      this.selectIndex = this.selectDate;
      this.registerType = [];
      this.dateStart = "";
      this.dateEnd = "";
      this.searchTrainingDates = "";
      if (this.tabIndex == 0) {
        this.activeTab = "eventNow";
        this.selectDate = "";
        this.loadingActiveTraining = true;
        this.trainingDatesService
          .trainingDatesListActive()
          .subscribe((resp) => {
            this.loadingActiveTraining = false;
            this.changeDetector.detectChanges();
            this.convertObjectToTable(resp);
            console.log(this.tActive);
            this.dataSourceActive = new MatTableDataSource(this.tActive);
            this.dataSourceActive.paginator =
              this.paginatorListTrainingDatesActive;
            this.dataSourceActive.sort = this.sortListTrainingDatesActive;
            this.dataSourceActive.filterPredicate =
              this.customFilterPredicate();
            this.applyFilter("");
          });
      } else if (this.tabIndex == 1) {
        this.activeTab = "eventOld";
        this.selectDate = "";
        this.loadingArchiveTraining = true;
        this.trainingDatesService
          .trainingDatesListArchive()
          .subscribe((resp) => {
            this.loadingArchiveTraining = false;
            this.changeDetector.detectChanges();
            this.convertObjectToTable(resp);
            this.dataSourceArchive = new MatTableDataSource(this.tArchive);
            this.dataSourceArchive.paginator =
              this.paginatorListTrainingDatesArchive;
            this.dataSourceArchive.sort = this.sortListTrainingDatesArchive;
            this.dataSourceArchive.filterPredicate =
              this.customFilterPredicate();
            this.applyFilter("");
          });
      } else {
        this.activeTab = "eventAll";
        this.loadingAllTraining = true;
        let dateNow = new Date();
        let startDate = "";
        let endDate = "";
        if (this.selectDate == "1") {
          // opcja szkoleń dziś
          startDate = this.datePipe.transform(dateNow, "yyyy-MM-dd");
          endDate = this.datePipe.transform(dateNow, "yyyy-MM-dd");
        } else if (this.selectDate == "2") {
          dateNow.setDate(dateNow.getDate() - 1);
          startDate = this.datePipe.transform(dateNow, "yyyy-MM-dd");
          endDate = this.datePipe.transform(dateNow, "yyyy-MM-dd");
        } else if (this.selectDate == "3") {
          startDate = this.datePipe.transform(dateNow, "yyyy-MM-dd");
          dateNow.setDate(dateNow.getDate() + 7);
          endDate = this.datePipe.transform(dateNow, "yyyy-MM-dd");
        } else if (this.selectDate == "4") {
          endDate = this.datePipe.transform(dateNow, "yyyy-MM-dd");
          dateNow.setDate(dateNow.getDate() - 7);
          startDate = this.datePipe.transform(dateNow, "yyyy-MM-dd");
        }
        this.trainingDatesService
          .trainingDatesListAll(this.selectDate, startDate, endDate)
          .subscribe((resp) => {
            this.loadingAllTraining = false;
            this.changeDetector.detectChanges();
            this.convertObjectToTable(resp);
            this.dataSourceAll = new MatTableDataSource(this.tAll);
            this.dataSourceAll.paginator = this.paginatorListTrainingDatesAll;
            this.dataSourceAll.sort = this.sortListTrainingDatesAll;
            this.dataSourceAll.filterPredicate = this.customFilterPredicate();
            this.applyFilter("");
          });
      }
    }
  }
  applyFilter(filterValue: string) {
    let newValue = filterValue;
    if (this.filtredArray.length > 0) {
      this.filtredArray.forEach((name) => {
        newValue += "+" + name;
      });
    }
    if (this.tabIndex == 0) {
      this.dataSourceActive.filter = newValue.trim().toLowerCase();
      if (this.dataSourceActive.paginator) {
        this.dataSourceActive.paginator.firstPage();
      }
    } else if (this.tabIndex == 1) {
      this.dataSourceArchive.filter = newValue.trim().toLowerCase();
      if (this.dataSourceArchive.paginator) {
        this.dataSourceArchive.paginator.firstPage();
      }
    } else {
      this.dataSourceAll.filter = newValue.trim().toLowerCase();
      if (this.dataSourceAll.paginator) {
        this.dataSourceAll.paginator.firstPage();
      }
    }
  }
  filterTypeTraining(idName) {
    if (this.filtredArray.includes(idName)) {
      const index = this.filtredArray.indexOf(idName);
      if (index > -1) {
        this.filtredArray.splice(index, 1);
      }
    } else {
      // this.filtredArray.push(idName);
      this.filtredArray[0] = idName;
    }
    this.applyFilter(this.searchTrainingDates);
  }
  setColumns() {
    // header: 'Wybierz maksymalnie 6 kolumn'
    const changeColumns = this.dialog.open(SetColumnsComponent, {
      maxWidth: "650px",
      minWidth: "350px",
      data: { header: "Dostosuj kolumny", columns: this.allColumns },
    });
    changeColumns.afterClosed().subscribe((newColumns) => {
      if (newColumns) {
        localStorage.setItem("eventColumns", JSON.stringify(newColumns));
        this.displayedColumns = this.createArrayColumns(newColumns);
      }
    });
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
  createArrayColumns(oldColumns): string[] {
    let newArray = [];
    oldColumns.forEach((column) => {
      if (column.checked) {
        newArray.push(column.name);
      }
    });
    return newArray;
  }
  changeSelectDate(value) {
    console.log(value);
    if (value != "5") {
      this.activeTab = "eventAll";
      this.onTabChanged(2);
      console.log("change");
      console.log(this.activeTab);
    }
  }
  changeDateStart(date) {
    this.activeTab = "eventAll";
    this.tabIndex = 2;
    this.registerType = [];
    let newDateStart = this.datePipe.transform(this.dateStart, "yyyy-MM-dd");
    let newDateEnd = this.datePipe.transform(this.dateEnd, "yyyy-MM-dd");
    this.loadingAllTraining = true;
    this.trainingDatesService
      .trainingDatesListAll(this.selectDate, newDateStart, newDateEnd)
      .subscribe((resp) => {
        this.loadingAllTraining = false;
        this.changeDetector.detectChanges();
        this.convertObjectToTable(resp);
        this.dataSourceAll = new MatTableDataSource(this.tAll);
        this.dataSourceAll.paginator = this.paginatorListTrainingDatesAll;
        this.dataSourceAll.sort = this.sortListTrainingDatesAll;
        this.dataSourceAll.filterPredicate = this.customFilterPredicate();
        this.applyFilter("");
      });
  }
}
