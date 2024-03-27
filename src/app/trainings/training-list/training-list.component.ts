import { Component, OnInit, ChangeDetectorRef, ViewChild } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { TrainingService } from "../training.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ToastrService } from "ngx-toastr";
import { SetColumnsComponent } from "src/app/trainingDates/modal/set-columns/set-columns.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-training-list",
  templateUrl: "./training-list.component.html",
  styleUrls: ["./training-list.component.scss"],
})
export class TrainingListComponent implements OnInit {
  searchTraining = "";

  allColumns = [
    { showToEdit: false, checked: true, name: "code", label: "Kod produktu" },
    { showToEdit: false, checked: true, name: "name", label: "Nazwa produktu" },
    { showToEdit: true, checked: true, name: "exam", label: "Egzamin" },
    {
      showToEdit: true,
      checked: false,
      name: "examprice",
      label: "Cena egzaminu",
    },
    {
      showToEdit: true,
      checked: false,
      name: "examRequired",
      label: "Egzamin wymagany",
    },
    {
      showToEdit: true,
      checked: true,
      name: "book",
      label: "Materiały szkoleniowe",
    },
    {
      showToEdit: true,
      checked: false,
      name: "bookprice",
      label: "Cena materiałów szkoleniowych",
    },
    {
      showToEdit: true,
      checked: true,
      name: "take2resit",
      label: "Take2 Re-sit",
    },
    { showToEdit: false, checked: true, name: "status", label: "Status" },
  ];

  displayedColumns: string[] = [
    "code",
    "name",
    "exam",
    "book",
    "take2resit",
    "status",
  ];
  activeProductList: MatTableDataSource<any>;
  archivedProductList: MatTableDataSource<any>;
  trainingActiveLoading = true;
  trainingArchiveLoading = true;
  searchOrder = "";
  tabIndex = 0;
  filtredArray = [];

  @ViewChild("paginatorListTraining") paginatorListTraining: MatPaginator;
  @ViewChild("paginatorArchiveListTraining")
  paginatorArchiveListTraining: MatPaginator;
  @ViewChild(MatSort) sortListTraining: MatSort;

  constructor(
    private trainingService: TrainingService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.tabIndex == 0) {
      this.getActiveList();
    } else if (this.tabIndex == 1) {
      this.getArchiwList();
    }
  }

  applyFilter(filterValue: string) {
    if (this.tabIndex == 0) {
      this.activeProductList.filter = filterValue.trim().toLowerCase();
      if (this.activeProductList.paginator) {
        this.activeProductList.paginator.firstPage();
      }
    } else if (this.tabIndex == 1) {
      this.archivedProductList.filter = filterValue.trim().toLowerCase();
      if (this.archivedProductList.paginator) {
        this.archivedProductList.paginator.firstPage();
      }
    }
  }

  getActiveList() {
    this.trainingActiveLoading = true;
    this.trainingService.activeTrainingList().subscribe(
      (resp) => {
        this.trainingActiveLoading = false;
        this.changeDetector.detectChanges();
        this.activeProductList = new MatTableDataSource(resp);
        this.activeProductList.paginator = this.paginatorListTraining;
      },
      (err) => {
        console.error(err);
        this.trainingActiveLoading = false;
        this.changeDetector.detectChanges();
        this.activeProductList = new MatTableDataSource([]);
        this.activeProductList.paginator = this.paginatorListTraining;
        this.toastr.error(
          "Nie udało się pobrać bieżącej listy produktów",
          "Błąd"
        );
      }
    );
  }
  getArchiwList() {
    this.trainingArchiveLoading = true;
    this.trainingService.archivedTrainingList().subscribe(
      (resp) => {
        this.trainingArchiveLoading = false;
        this.changeDetector.detectChanges();
        this.archivedProductList = new MatTableDataSource(resp);
        this.archivedProductList.paginator = this.paginatorArchiveListTraining;
      },
      (err) => {
        console.error(err);
        this.trainingArchiveLoading = false;
        this.changeDetector.detectChanges();
        this.archivedProductList = new MatTableDataSource([]);
        this.archivedProductList.paginator = this.paginatorArchiveListTraining;
        this.toastr.error(
          "Nie udało się pobrać archiwalnej listy produktów",
          "Błąd"
        );
      }
    );
  }
  getAllList() {}

  onTabChanged(eventIndex) {
    this.searchOrder = "";
    this.filtredArray = [];
    this.tabIndex = eventIndex;
    switch (eventIndex) {
      case 0:
        this.getActiveList();
        break;
      case 1:
        this.getArchiwList();
        break;
      case 2:
        this.getAllList();
        break;

      default:
        break;
    }
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
        // localStorage.setItem("eventColumns", JSON.stringify(newColumns));
        this.displayedColumns = this.createArrayColumns(newColumns);
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
}
