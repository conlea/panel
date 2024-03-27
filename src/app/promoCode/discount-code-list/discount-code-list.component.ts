import { DiscountService } from './../discount.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EditDiscountCodeComponent } from '../modal/edit-discount-code/edit-discount-code.component';
import { ToastrService } from 'ngx-toastr';
import { SetColumnsComponent } from 'src/app/trainingDates/modal/set-columns/set-columns.component';

@Component({
  selector: 'app-discount-code-list',
  templateUrl: './discount-code-list.component.html',
  styleUrls: ['./discount-code-list.component.scss']
})
export class DiscountCodeListComponent implements OnInit {

  allColumns = [
    { showToEdit: false, checked: true, name: 'codeName', label: "Kod rabatowy" },
    { showToEdit: false, checked: true, name: 'codeStart', label: "Data ważności" },
    { showToEdit: true, checked: true, name: 'codetype', label: "Typ" },
    { showToEdit: true, checked: true, name: 'codevalue', label: "Wartość" },
    { showToEdit: true, checked: true, name: 'useLimit', label: "Limit użyć" },
    { showToEdit: true, checked: true, name: 'isUse', label: "Użyto" }];

  searchCode = "";
  displayedColumns: string[] = ['codeName', 'codeStart', 'codetype', 'codevalue', 'useLimit', 'isUse'];
  activeDiscountList = [];
  activeDiscountDataSource: MatTableDataSource<any>;
  archiveDiscountList = [];
  archiveDiscountDataSource: MatTableDataSource<any>;
  allDiscountList = [];
  allDiscountDataSource: MatTableDataSource<any>;
  codeList: any = [];
  isDiscountLoading = true;
  activeDiscountLoading = true;
  archiveDiscountLoading = true;
  allDiscountLoading = true;
  trainingDateActive: any = [];
  trainingList: any = [];
  places: any = [];
  activeTab = "eventNow";
  searchOrder = "";
  tabIndex = 0;
  filtredArray = [];

  @ViewChild('paginatorActiveDiscount') paginatorActiveDiscount: MatPaginator;
  @ViewChild('paginatorArchiveDiscount') paginatorArchiveDiscount: MatPaginator;
  @ViewChild('paginatorAllDiscount') paginatorAllDiscount: MatPaginator;

  constructor(private toastr: ToastrService, public DiscountService: DiscountService, private dialog: MatDialog, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.onTabChanged(this.tabIndex);

    if (localStorage.getItem("discountColumns")) {
      let columnLocal = JSON.parse(localStorage.getItem("discountColumns"));
      if (columnLocal.length == this.allColumns.length) {
        this.allColumns = columnLocal;
      }
      this.displayedColumns = this.createArrayColumns(this.allColumns);
    }
  }
  addNewDiscountCode() {
    const addNewDiscountCode = this.dialog.open(EditDiscountCodeComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Dodaj kod rabatowy', trainingDateActive: this.trainingDateActive, trainingList: this.trainingList, places: this.places } });
    addNewDiscountCode.afterClosed().subscribe(newDiscountData => {
      if (newDiscountData) {
        this.changeDetector.detectChanges();
        this.activeDiscountDataSource = new MatTableDataSource(newDiscountData);
        this.activeDiscountDataSource.paginator = this.paginatorActiveDiscount;
      }
    });
  }
  editDiscount(discount) {
    const editDiscountCode = this.dialog.open(EditDiscountCodeComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Edytuj kod rabatowy', editDiscount: discount, trainingDateActive: this.trainingDateActive, trainingList: this.trainingList, places: this.places } });
    editDiscountCode.afterClosed().subscribe(editDiscountData => {
      if (editDiscountData) {
        if (this.tabIndex == 0) {
          this.changeDetector.detectChanges();
          this.activeDiscountList = editDiscountData.activeDiscount;
          this.activeDiscountDataSource = new MatTableDataSource(this.activeDiscountList);
          this.activeDiscountDataSource.paginator = this.paginatorActiveDiscount;
        } else if (this.tabIndex == 1) {
          this.changeDetector.detectChanges();
          this.archiveDiscountList = editDiscountData.archiveDiscount;
          this.archiveDiscountDataSource = new MatTableDataSource(this.archiveDiscountList);
          this.archiveDiscountDataSource.paginator = this.paginatorArchiveDiscount;
        } else {
          this.changeDetector.detectChanges();
          this.allDiscountList = editDiscountData.allDiscount;
          this.allDiscountDataSource = new MatTableDataSource(this.allDiscountList);
          this.allDiscountDataSource.paginator = this.paginatorAllDiscount;
        }
      }
    });
  }
  applyFilter(filterValue: string) {
    switch (this.tabIndex) {
      case 0:
        this.activeDiscountDataSource.filter = filterValue.trim().toLowerCase();
        if (this.activeDiscountDataSource.paginator) {
          this.activeDiscountDataSource.paginator.firstPage();
        }
        break;
      case 1:
        this.archiveDiscountDataSource.filter = filterValue.trim().toLowerCase();
        if (this.archiveDiscountDataSource.paginator) {
          this.archiveDiscountDataSource.paginator.firstPage();
        }
        break;
      case 2:
        this.allDiscountDataSource.filter = filterValue.trim().toLowerCase();
        if (this.allDiscountDataSource.paginator) {
          this.allDiscountDataSource.paginator.firstPage();
        }
        break;
    }
  }
  setColumns() {
    // header: 'Wybierz maksymalnie 6 kolumn'
    const changeColumns = this.dialog.open(SetColumnsComponent, { maxWidth: '650px', minWidth: '350px', data: { header: 'Dostosuj kolumny', columns: this.allColumns } });
    changeColumns.afterClosed().subscribe(newColumns => {
      if (newColumns) {
        localStorage.setItem("discountColumns", JSON.stringify(newColumns));
        this.displayedColumns = this.createArrayColumns(newColumns);
      }
    })
  }

  getActiveList() {
    this.activeDiscountLoading = true;
    this.DiscountService.activeDiscountList().subscribe(resp => {
      this.activeDiscountLoading = false;
      this.trainingDateActive = resp.trainingDateActive;
      this.trainingList = resp.trainingList;
      this.places = resp.places;
      this.activeDiscountList = resp.discountList;
      this.changeDetector.detectChanges();
      this.activeDiscountDataSource = new MatTableDataSource(this.activeDiscountList);
      this.activeDiscountDataSource.paginator = this.paginatorActiveDiscount;
    }, err => {
      console.error(err);
      this.activeDiscountLoading = false;
      this.toastr.error('Wystąpił błąd podczas pobierania listy kodów rabatowych', 'Błąd');
    });
  }
  getArchiwList() {
    this.archiveDiscountLoading = true;
    this.DiscountService.archiveDiscountList().subscribe(resp => {
      this.archiveDiscountLoading = false;
      this.archiveDiscountList = resp;
      this.changeDetector.detectChanges();
      this.archiveDiscountDataSource = new MatTableDataSource(this.archiveDiscountList);
      this.archiveDiscountDataSource.paginator = this.paginatorArchiveDiscount;
    }, err => {
      console.error(err);
      this.archiveDiscountLoading = false;
      this.toastr.error('Wystąpił błąd podczas pobierania listy kodów rabatowych', 'Błąd');
    });
  }
  getAllList() {
    this.allDiscountLoading = true;
    this.DiscountService.allDiscountList().subscribe(resp => {
      this.allDiscountLoading = false;
      this.allDiscountList = resp;
      this.changeDetector.detectChanges();
      this.allDiscountDataSource = new MatTableDataSource(this.allDiscountList);
      this.allDiscountDataSource.paginator = this.paginatorAllDiscount;
    }, err => {
      console.error(err);
      this.allDiscountLoading = false;
      this.toastr.error('Wystąpił błąd podczas pobierania listy kodów rabatowych', 'Błąd');
    });
  }
  onTabChanged(eventIndex) {
    this.searchCode = '';
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
  createArrayColumns(oldColumns): string[] {
    let newArray = [];
    oldColumns.forEach(column => {
      if (column.checked) {
        newArray.push(column.name);
      }
    });
    return newArray;
  }
}
