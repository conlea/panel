import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { OrderService } from "../order.service";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";
import { SetColumnsOrdersComponent } from "../modal/set-columns-orders/set-columns-orders.component";
import { MatDialog } from "@angular/material/dialog";
import { OrderListInterface } from "./order-list.interface";
import { SelectionModel } from "@angular/cdk/collections";
import { RemoveOrderComponent } from "../modal/remove-order/remove-order.component";

@Component({
  selector: "app-order-list",
  templateUrl: "./order-list.component.html",
  styleUrls: ["./order-list.component.scss"],
})
export class OrderListComponent implements OnInit {
  searchOrder = "";
  public orderList: OrderListInterface[] = [];
  orderArchiwLoading: boolean = true;
  orderAllLoading: boolean = true;
  editSpinner: boolean = false;
  activOrderList: MatTableDataSource<any> = new MatTableDataSource<
    OrderListInterface[]
  >([]);
  archiwOrderList: MatTableDataSource<any> = new MatTableDataSource<
    OrderListInterface[]
  >([]);
  allOrderList: MatTableDataSource<any> = new MatTableDataSource<
    OrderListInterface[]
  >([]);
  personHS: any = [];
  activeTab = "eventNow";
  datePipe = new DatePipe("pl-PL");
  tabIndex = 0;
  registerType = [];
  filtredArray = [];
  public selection = new SelectionModel<OrderListInterface>(true, []);
  allColumns = [
    {
      showToEdit: false,
      checked: true,
      name: "select",
      label: "select",
    },
    { showToEdit: false, checked: true, name: "idOrder", label: "ID" },
    {
      showToEdit: true,
      checked: true,
      name: "termOrder",
      label: "Data zgłoszenia",
    },
    { showToEdit: true, checked: true, name: "training", label: "Wydarzenie" },
    {
      showToEdit: true,
      checked: true,
      name: "reporting",
      label: "Os. zgłaszająca",
    },
    { showToEdit: true, checked: true, name: "company", label: "Firma" },
    {
      showToEdit: true,
      checked: false,
      name: "term",
      label: "Data wydarzenia",
    },
    { showToEdit: true, checked: false, name: "lang", label: "Język" },
    { showToEdit: true, checked: false, name: "invoice", label: "Faktury" },
    {
      showToEdit: true,
      checked: true,
      name: "status_order",
      label: "Status zgłoszenia",
    },
  ];

  displayedColumns: string[] = [
    "select",
    "idOrder",
    "termOrder",
    "training",
    "reporting",
    "company",
    "status_order",
  ];

  @ViewChild("paginatorOrderListActive") paginatorOrderListActive: MatPaginator;
  @ViewChild("paginatorOrderListArchiw") paginatorOrderListArchiw: MatPaginator;
  @ViewChild("paginatorOrderListAll") paginatorOrderListAll: MatPaginator;
  @ViewChild(MatSort) sortListOrdersList: MatSort;

  constructor(
    private orderService: OrderService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private changeDetector: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    this.getActiveList();
    if (localStorage.getItem("orderColumns")) {
      let columnLocal = JSON.parse(localStorage.getItem("orderColumns"));
      if (columnLocal.length == this.allColumns.length) {
        this.allColumns = columnLocal;
      }
      this.displayedColumns = this.createArrayColumns(this.allColumns);
    }
  }

  public convertEventType(orders): void {
    this.registerType = [];
    orders.forEach((order) => {
      let eventt = this.registerType.filter((x) => x.name === order.eventType);
      if (eventt.length > 0) {
        eventt[0].count += 1;
      } else {
        this.registerType.push({ name: order.eventType, count: 1 });
      }
    });
  }

  public isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.activOrderList.data.length;
    return numSelected === numRows;
  }

  public isSelectedEvent(order: OrderListInterface) {
    this.selection.toggle(order);
  }

  public getActiveList(): void {
    this.editSpinner = true;
    this.orderService.orderList().subscribe(
      (resp) => {
        this.orderList = resp;
        this.editSpinner = false;
        this.convertEventType(this.orderList);
        this.changeDetector.detectChanges();
        this.activOrderList.data = this.orderList;
        this.activOrderList.paginator = this.paginatorOrderListActive;
        this.activOrderList.sort = this.sortListOrdersList;
        this.activOrderList.filterPredicate = this.customFilterPredicate();
      },
      (err) => {
        console.error(err);
        this.editSpinner = false;
        this.changeDetector.detectChanges();
        this.activOrderList.data = [];
        this.activOrderList.paginator = this.paginatorOrderListActive;
        this.activOrderList.sort = this.sortListOrdersList;
        this.toastr.error(
          "Nie udało się pobrać bieżącej listy zamówień",
          "Błąd"
        );
      }
    );
  }
  public getArchiwList(): void {
    this.orderArchiwLoading = true;
    this.orderService.orderArchiwList().subscribe(
      (resp) => {
        this.orderList = resp;
        this.orderArchiwLoading = false;
        this.convertEventType(this.orderList);
        this.changeDetector.detectChanges();
        this.archiwOrderList.data = this.orderList;
        this.archiwOrderList.paginator = this.paginatorOrderListArchiw;
        this.archiwOrderList.sort = this.sortListOrdersList;
        this.archiwOrderList.filterPredicate = this.customFilterPredicate();
      },
      (err) => {
        console.error(err);
        this.orderArchiwLoading = false;
        this.changeDetector.detectChanges();
        this.archiwOrderList.data = [];
        this.archiwOrderList.paginator = this.paginatorOrderListArchiw;
        this.archiwOrderList.sort = this.sortListOrdersList;
        this.toastr.error(
          "Nie udało się pobrać listy archiwum zamówień",
          "Błąd"
        );
      }
    );
  }
  public getAllList(): void {
    this.orderAllLoading = true;
    this.orderService.orderAllList().subscribe(
      (resp) => {
        this.orderList = resp;
        this.orderAllLoading = false;
        this.convertEventType(this.orderList);
        this.changeDetector.detectChanges();
        this.allOrderList.data = this.orderList;
        this.allOrderList.paginator = this.paginatorOrderListAll;
        this.allOrderList.sort = this.sortListOrdersList;
        this.allOrderList.filterPredicate = this.customFilterPredicate();
      },
      (err) => {
        console.error(err);
        this.orderAllLoading = false;
        this.changeDetector.detectChanges();
        this.allOrderList.data = [];
        this.allOrderList.paginator = this.paginatorOrderListAll;
        this.allOrderList.sort = this.sortListOrdersList;
        this.toastr.error(
          "Nie udało się pobrać listy archiwum zamówień",
          "Błąd"
        );
      }
    );
  }

  public archiveSelectedOrder(): void {
    const removeOrder = this.dialog.open(RemoveOrderComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Czy na pewno chcesz dodać zgłoszenia do archiwum?",
        confirmBtnText: "Potwierdź",
      },
    });
    removeOrder.afterClosed().subscribe((accept) => {
      if (accept) {
        this.editSpinner = true;
        this.orderService.archiveOrderList(this.selection.selected).subscribe(
          () => {
            this.selection.clear();
            this.getActiveList();
            this.toastr.success("Zgłoszenia dodano do archiwum", "Success");
          },
          () => {
            this.editSpinner = false;
            this.toastr.error(
              "Błąd podczas dodawania zgłoszeń do archiwum",
              "Błąd!"
            );
          }
        );
      }
    });
  }

  public removeSelectedOrder(): void {
    const removeOrder = this.dialog.open(RemoveOrderComponent, {
      maxWidth: "650px",
      minWidth: "600px",
      data: {
        header: "Czy na pewno chcesz usunąć zgłoszenia?",
        confirmBtnText: "Potwierdź",
        confirmBtnType: "warn",
      },
    });
    removeOrder.afterClosed().subscribe((accept) => {
      if (accept) {
        this.editSpinner = true;
        this.orderService.removeOrderList(this.selection.selected).subscribe(
          () => {
            this.selection.clear();
            this.getActiveList();
            this.toastr.success("Zgłoszenia zostały usunięte", "Success");
          },
          () => {
            this.editSpinner = false;
            this.toastr.error("Błąd podczas usuwania zgłoszeń", "Błąd!");
          }
        );
      }
    });
  }

  public applyFilter(filterValue: string) {
    let otherFilter = filterValue.trim().toLowerCase();
    if (this.filtredArray.length > 0) {
      this.filtredArray.forEach((string, index) => {
        if (index == 0 && otherFilter == "") {
          otherFilter += string.trim().toLowerCase();
        } else {
          otherFilter += "+" + string.trim().toLowerCase();
        }
      });
    }

    switch (this.tabIndex) {
      case 0:
        this.activOrderList.filter = otherFilter.trim().toLowerCase();
        if (this.activOrderList.paginator) {
          this.activOrderList.paginator.firstPage();
        }
        break;
      case 1:
        this.archiwOrderList.filter = otherFilter.trim().toLowerCase();
        if (this.archiwOrderList.paginator) {
          this.archiwOrderList.paginator.firstPage();
        }
        break;
      case 2:
        this.allOrderList.filter = otherFilter.trim().toLowerCase();
        if (this.allOrderList.paginator) {
          this.allOrderList.paginator.firstPage();
        }
        break;

      default:
        break;
    }
    // this.activOrderList.filter = filterValue.trim().toLowerCase();
    // if (this.activOrderList.paginator) {
    //   this.activOrderList.paginator.firstPage();
    // }
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
    this.applyFilter(this.searchOrder);

    // this.applyFilter(this.searchTrainingDates);
  }
  setColumns() {
    const changeColumns = this.dialog.open(SetColumnsOrdersComponent, {
      maxWidth: "650px",
      minWidth: "350px",
      data: { header: "Dostosuj kolumny", columns: this.allColumns },
    });
    changeColumns.afterClosed().subscribe((newColumns) => {
      if (newColumns) {
        localStorage.setItem("orderColumns", JSON.stringify(newColumns));
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
  onTabChanged(eventIndex) {
    console.log("tab change");
    console.log(eventIndex);
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
}
