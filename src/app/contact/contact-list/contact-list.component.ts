import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ToastrService } from "ngx-toastr";
import { ContactService } from "../contact.service";
import { environment } from "src/environments/environment";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { AddNewContactComponent } from "../modal/add-new-contact/add-new-contact.component";
import { MatDialog } from "@angular/material/dialog";

export interface UserData {
  id: number;
  firstname: string;
  lastname: string;
  company: string;
  email: string;
}

@Component({
  selector: "app-contact-list",
  templateUrl: "./contact-list.component.html",
  styleUrls: ["./contact-list.component.scss"],
})
export class ContactListComponent implements OnInit {
  searchPerson = "";
  HSId = environment.HSId;

  displayedColumns: string[] = [
    "firstname",
    "lastname",
    "company",
    "email",
    "phone",
  ];
  participants;
  dataSource: MatTableDataSource<any>;
  contactLoading = true;
  allContacts: any = [];
  filtredContacts: any = [];

  @ViewChild("paginatorListContact") paginatorListContact: MatPaginator;
  @ViewChild(MatSort) sortListContact: MatSort;

  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private contactService: ContactService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.contactLoading = true;
    this.contactService.contactList().subscribe(
      (resp) => {
        this.contactLoading = false;
        this.allContacts = resp;
        this.changeDetector.detectChanges();
        this.dataSource = new MatTableDataSource(this.allContacts);
        this.dataSource.paginator = this.paginatorListContact;
        this.dataSource.sort = this.sortListContact;
      },
      (err) => {
        this.contactLoading = false;
        this.changeDetector.detectChanges();
        this.dataSource = new MatTableDataSource([]);
        this.dataSource.paginator = this.paginatorListContact;
        this.dataSource.sort = this.sortListContact;
        this.toastr.error("Nie udało się pobrać listy kontaktów", "Błąd");
      }
    );
  }

  addNewContact() {
    const addContactModal = this.dialog.open(AddNewContactComponent, {
      maxWidth: "650px",
      minWidth: "350px",
      data: { header: "Dodaj kontakt" },
    });
    addContactModal.afterClosed().subscribe((newContact) => {
      if (newContact) {
        this.contactService.addNewContact(newContact).subscribe((resp) => {
          console.log(resp);
          this.toastr.success("Dodano nowy kontakt", "Success");
        }),
          (err) => {
            console.error(err);
            this.toastr.error("Błąd podczas dodawania nowego kontaktu", "Błąd");
          };
      }
    });
  }

  applyFilter(filterValue: string) {
    if (filterValue.length > 3) {
      this.contactLoading = true;
      this.contactService.findPersonFromHS(filterValue).subscribe(
        (resp) => {
          this.contactLoading = false;
          // this.filteredOptions = resp.contacts;
          this.filtredContacts = resp;
          this.changeDetector.detectChanges();
          this.dataSource = new MatTableDataSource(this.filtredContacts);
          this.dataSource.paginator = this.paginatorListContact;
          this.dataSource.sort = this.sortListContact;
        },
        (err) => {
          this.contactLoading = false;
          this.changeDetector.detectChanges();
          this.dataSource = new MatTableDataSource(this.allContacts);
          this.dataSource.paginator = this.paginatorListContact;
          this.dataSource.sort = this.sortListContact;
        }
      );
    } else {
      this.changeDetector.detectChanges();
      this.dataSource = new MatTableDataSource(this.allContacts);
      this.dataSource.paginator = this.paginatorListContact;
      this.dataSource.sort = this.sortListContact;
    }
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }
}
