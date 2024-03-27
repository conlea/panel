import { AuthService } from './../../auth/auth.service';
import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { SettingsService } from '../settings.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { AdminEditComponent } from '../modal/admin-edit/admin-edit.component';
import { MatDialog } from '@angular/material/dialog';
import { StatusComponent } from '../modal/status/status.component';
import { LangComponent } from '../modal/lang/lang.component';
import { CurrencyComponent } from '../modal/currency/currency.component';
import { TicketAttrComponent } from '../modal/ticket-attr/ticket-attr.component';
import { EventTypeComponent } from '../modal/event-type/event-type.component';
import { RuleUserComponent } from '../modal/rule-user/rule-user.component';
import { OrderStatusComponent } from '../modal/order-status/order-status.component';
import { RegulationComponent } from '../modal/regulation/regulation.component';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  searchPerson = "";
  displayedColumns: string[] = ['id', 'first_name', 'last_name', 'email', 'active'];
  participants;
  dataSource: MatTableDataSource<any>;
  isLoading = true;
  isLoadingAdmin = true;
  isLoadingStatus: boolean = true;
  isLoadingLang: boolean = true;
  isLoadingCurrency: boolean = true;
  isLoadingTicketAttr: boolean = true;
  isLoadingCompany: boolean = true;
  isLoadingEventType: boolean = true;
  isLoadingParticipantRoles: boolean = true;
  isLoadingStatusOrder: boolean = true;
  isLoadingRegulations: boolean = true;
  statusList: any = [];
  companyList: any = [];
  langList: any = [];
  eventTypeList: any = [];
  currencyList: any = [];
  attrList: any = [];
  logUser: any = {};
  userList: any = [];
  participantRole: any = [];
  statusOrderList: any = [];
  regulationsList: any = [];
  subscriptionsHS: any = [];


  tabIndex: number = 0;
  filtredArray: any = [];
  // private paginator: MatPaginator;
  // private sort: MatSort;
  // @ViewChild(MatSort) sort: MatSort;

  @ViewChild('paginatorListAdmin') paginatorAdminList: MatPaginator;
  @ViewChild(MatSort) sortAdminList: MatSort;

  constructor(private toastr: ToastrService, private authService: AuthService, private settingsService: SettingsService, private dialog: MatDialog, private changeDetector: ChangeDetectorRef) { }

  ngOnInit(): void {
    // this.logUser = this.authService.userData.getValue();
    // console.log(this.logUser);

    this.authService.userData.subscribe(resp => {
      this.logUser = resp;
    })

    this.settingsService.getSettings().subscribe(resp => {
      this.userList = resp.userList;
      this.statusList = resp.statusList;
      this.langList = resp.langList;
      this.currencyList = resp.currencyList;
      this.attrList = resp.attrList;
      this.companyList = resp.companyList;
      this.eventTypeList = resp.eventType;
      this.participantRole = resp.perticipantRoles;
      this.statusOrderList = resp.orderStatus;
      this.regulationsList = resp.regulationsList;
      this.subscriptionsHS = resp.subscriptionsHS;

      this.isLoadingStatus = false;
      this.isLoadingLang = false;
      this.isLoadingCurrency = false;
      this.isLoadingTicketAttr = false;
      this.isLoadingAdmin = false;
      this.isLoadingCompany = false;
      this.isLoadingEventType = false;
      this.isLoadingParticipantRoles = false;
      this.isLoadingStatusOrder = false;
      this.isLoadingRegulations = false;

      this.changeDetector.detectChanges();
      this.dataSource = new MatTableDataSource(this.userList);
      this.dataSource.paginator = this.paginatorAdminList;
      this.dataSource.sort = this.sortAdminList;
    }, err => {
      this.isLoadingStatus = false;
      this.isLoadingLang = false;
      this.isLoadingCurrency = false;
      this.isLoadingTicketAttr = false;
      this.isLoadingAdmin = false;
      this.isLoadingCompany = false;
      this.isLoadingEventType = false;
      this.isLoadingParticipantRoles = false;
      this.isLoadingStatusOrder = false;
      this.isLoadingRegulations = false;
      console.error(err);
      this.toastr.error("Bład podczas pobierania ustawień panelu", "Error")
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onTabChanged(eventIndex) {
    this.searchPerson = '';
    this.filtredArray = [];
    this.tabIndex = eventIndex;
    switch (eventIndex) {
      case 0:
        // this.getActiveList();
        break;
      case 1:
        // this.getArchiwList();
        break;
      case 2:
        // this.getAllList();
        break;

      default:
        break;
    }

  }


  addAdmin() {
    const addAdminUser = this.dialog.open(AdminEditComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Dodaj Użytkownika' } });
    addAdminUser.afterClosed().subscribe(addUser => {
      if (addUser) {
        this.isLoadingAdmin = true;
        this.settingsService.addNewAdmin(addUser).subscribe(resp => {
          this.isLoadingAdmin = false;
          this.changeDetector.detectChanges();
          this.dataSource = new MatTableDataSource(resp);
          this.dataSource.paginator = this.paginatorAdminList;
          this.dataSource.sort = this.sortAdminList;
          this.toastr.success('Nowy użytkownik został dodany', 'Success');
        }, err => {
          this.isLoadingAdmin = false;
          console.error(err);
          this.toastr.error('Błąd podczas dodawania użytkownika', 'Error');
        });
      }
    });
  }
  editAdmin(userSelect) {
    const editAdminUser = this.dialog.open(AdminEditComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Edytuj Użytkownika', user: userSelect } });
    editAdminUser.afterClosed().subscribe(editUser => {
      if (editUser) {
        this.isLoadingAdmin = true;
        this.settingsService.adminUpdate(editUser).subscribe(resp => {
          this.isLoadingAdmin = false;
          this.changeDetector.detectChanges();
          this.dataSource = new MatTableDataSource(resp);
          this.dataSource.paginator = this.paginatorAdminList;
          this.dataSource.sort = this.sortAdminList;
          if (editUser.deleted > 0) {
            this.toastr.success('Usunięto użytkownika', 'Success');
          } else {
            this.toastr.success('User has been update', 'Success');
          }
        }, err => {
          this.isLoadingAdmin = false;
          console.error(err);
          this.toastr.error('Błąd podczas edycji użytkownika', 'Error');
        });
      }
    }, err => {
      console.error(err);
    });
  }
  editStatus(statusFrom) {
    const editStatus = this.dialog.open(StatusComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Edytuj status', status: statusFrom } });
    editStatus.afterClosed().subscribe(editStatus => {
      if (editStatus) {
        this.isLoadingStatus = true;
        this.settingsService.statusUpdate(statusFrom.id, editStatus).subscribe(resp => {
          this.isLoadingStatus = false;
          this.statusList = resp;
          this.toastr.success('Status has been update', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingStatus = false;
          this.toastr.error('Błąd podczas edycji statusu', 'Error');
        });
      }
    });
  }
  addStatus() {
    const addStatus = this.dialog.open(StatusComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Dodaj nowy status' } });
    addStatus.afterClosed().subscribe(newStatus => {
      if (newStatus) {
        this.isLoadingStatus = true;
        this.settingsService.addNewStatus(newStatus).subscribe(resp => {
          this.isLoadingStatus = false;
          this.statusList = resp;
          this.toastr.success('Status has been added', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingStatus = false;
          this.toastr.error('Błąd podczas dodawania statusu', 'Error');
        });
      }
    });
  }
  addNewLang() {
    const addSLang = this.dialog.open(LangComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Dodaj nowy język' } });
    addSLang.afterClosed().subscribe(newLang => {
      if (newLang) {
        this.isLoadingLang = true;
        this.settingsService.addNewlang(newLang).subscribe(resp => {
          this.isLoadingLang = false;
          this.langList = resp;
          this.toastr.success('Lang has been added', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingLang = false;
          this.toastr.error('Błąd podczas dodawania lang', 'Error');
        });
      }
    });
  }
  editLang(langForm) {
    const editLang = this.dialog.open(LangComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Edytuj język', lang: langForm } });
    editLang.afterClosed().subscribe(editLang => {
      if (editLang) {
        this.isLoadingLang = true;
        this.settingsService.updateLang(langForm.id, editLang).subscribe(resp => {
          this.isLoadingLang = false;
          this.langList = resp;
          this.toastr.success('Lang has been update', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingLang = false;
          this.toastr.error('Błąd podczas edycji statusu', 'Error');
        });
      }
    });
  }
  addCurrency() {
    const addCurrency = this.dialog.open(CurrencyComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Dodaj nową walutę' } });
    addCurrency.afterClosed().subscribe(newCurrency => {
      if (newCurrency) {
        this.isLoadingCurrency = true;
        this.settingsService.addNewCurrency(newCurrency).subscribe(resp => {
          this.isLoadingCurrency = false;
          this.currencyList = resp;
          this.toastr.success('Currency has been added', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingCurrency = false;
          this.toastr.error('Błąd podczas dodawania lang', 'Error');
        });
      }
    });
  }
  editCurrency(currencyForm) {
    const editCurrency = this.dialog.open(CurrencyComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Edytuj walutę', currency: currencyForm } });
    editCurrency.afterClosed().subscribe(editCurrency => {
      if (editCurrency) {
        this.isLoadingCurrency = true;
        this.settingsService.updateCurrency(currencyForm.id, editCurrency).subscribe(resp => {
          this.isLoadingCurrency = false;
          this.currencyList = resp;
          this.toastr.success('Currency has been update', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingCurrency = false;
          this.toastr.error('Błąd podczas edycji statusu', 'Error');
        });
      }
    });
  }
  addAttr() {
    const addAttr = this.dialog.open(TicketAttrComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Dodaj nowy atrybut' } });
    addAttr.afterClosed().subscribe(newAttr => {
      if (newAttr) {
        this.isLoadingTicketAttr = true;
        this.settingsService.addNewAttr(newAttr).subscribe(resp => {
          this.isLoadingTicketAttr = false;
          this.attrList = resp;
          this.toastr.success('New Attr has been added', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingTicketAttr = false;
          this.toastr.error('Błąd podczas dodawania atrybutu', 'Error');
        });
      }
    });
  }
  editAttr(attrForm) {
    const editAttr = this.dialog.open(TicketAttrComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Edytuj atrybut', attr: attrForm } });
    editAttr.afterClosed().subscribe(editAtt => {
      if (editAtt) {
        this.isLoadingTicketAttr = true;
        this.settingsService.updateAttr(attrForm.id, editAtt).subscribe(resp => {
          this.isLoadingTicketAttr = false;
          this.attrList = resp;
          this.toastr.success('Attribute has been update', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingTicketAttr = false;
          this.toastr.error('Błąd podczas edycji atrybutu', 'Error');
        });
      }
    });
  }
  addNewEventType() {
    const addEventType = this.dialog.open(EventTypeComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Dodaj nowy rodzaj wydarzenia' } });
    addEventType.afterClosed().subscribe(newData => {
      if (newData) {
        this.isLoadingEventType = true;
        this.settingsService.addNewEventType(newData).subscribe(resp => {
          this.isLoadingEventType = false;
          this.eventTypeList = resp;
          this.toastr.success('Dodano nowy rodzaj wydarzenia', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingEventType = false;
          this.toastr.error('Błąd podczas dodawania nowego rodzaju wydarzenia', 'Error');
        });
      }
    })
  }
  editEventType(editEventT) {
    const addEventType = this.dialog.open(EventTypeComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Edytuj rodzaj wydarzenia', eventT: editEventT } });
    addEventType.afterClosed().subscribe(newData => {
      if (newData) {
        this.isLoadingEventType = true;
        this.settingsService.updateEventType(editEventT.id, newData).subscribe(resp => {
          this.isLoadingEventType = false;
          this.eventTypeList = resp;
          this.toastr.success('Zapisano zmiany', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingEventType = false;
          this.toastr.error('Błąd podczas edycji rodzaju wydarzenia', 'Error');
        });
      }
    })
  }
  addNewRole() {
    const addParticipantRole = this.dialog.open(RuleUserComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Dodaj nową rolę uczestnika' } });
    addParticipantRole.afterClosed().subscribe(newData => {
      if (newData) {
        this.isLoadingParticipantRoles = true;
        this.settingsService.addNewParticipantRole(newData).subscribe(resp => {
          this.isLoadingParticipantRoles = false;
          this.participantRole = resp;
          this.toastr.success('Dodano nowy rodzaj wydarzenia', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingParticipantRoles = false;
          this.toastr.error('Błąd podczas dodawania nowego rodzaju wydarzenia', 'Error');
        });
      }
    })
  }
  editParticipantRole(editParticipantRole) {
    const editParticipantRoleModal = this.dialog.open(RuleUserComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Edytuj rolę uczestnika', participantRole: editParticipantRole } });
    editParticipantRoleModal.afterClosed().subscribe(newData => {
      if (newData) {
        this.isLoadingParticipantRoles = true;
        this.settingsService.updateParticipantRole(editParticipantRole.id, newData).subscribe(resp => {
          this.isLoadingParticipantRoles = false;
          this.participantRole = resp;
          this.toastr.success('Zapisano zmiany', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingParticipantRoles = false;
          this.toastr.error('Błąd podczas edycji roli uczestnika', 'Error');
        });
      }
    })
  }
  addStatusOrder() {
    const addOrderStatus = this.dialog.open(OrderStatusComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Dodaj nowy status zamówienia' } });
    addOrderStatus.afterClosed().subscribe(newData => {
      if (newData) {
        this.isLoadingStatusOrder = true;
        this.settingsService.addNewOrderStatus(newData).subscribe(resp => {
          this.isLoadingStatusOrder = false;
          this.statusOrderList = resp;
          this.toastr.success('Dodano nowy status zamówienia', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingStatusOrder = false;
          this.toastr.error('Błąd dodawania nowego statusu szkolenia', 'Error');
        });
      }
    })
  }
  editStatusOrder(editStatusOrder) {
    const editOrderStatusModal = this.dialog.open(OrderStatusComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Edytuj status zamówienia', editStatusOrder } });
    editOrderStatusModal.afterClosed().subscribe(newData => {
      if (newData) {
        this.isLoadingStatusOrder = true;
        this.settingsService.updateOrderStatus(editStatusOrder.id, newData).subscribe(resp => {
          this.isLoadingStatusOrder = false;
          this.statusOrderList = resp;
          this.toastr.success('Zapisano zmiany', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingStatusOrder = false;
          this.toastr.error('Błąd podczas edycji statusu zamówienia', 'Error');
        });
      }
    })
  }
  addNewReg() {
    const addRegulations = this.dialog.open(RegulationComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Dodaj nowy regulamin' } });
    addRegulations.afterClosed().subscribe(newData => {
      if (newData) {
        this.isLoadingRegulations = true;
        this.settingsService.addNewRegulation(newData).subscribe(resp => {
          this.isLoadingRegulations = false;
          this.regulationsList = resp;
          this.toastr.success('Dodano nowy status zamówienia', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingRegulations = false;
          this.toastr.error('Błąd dodawania nowego regulaminu ', 'Error');
        });
      }
    })
  }
  editRegulation(regulation) {
    const editRegulation = this.dialog.open(RegulationComponent, { maxWidth: '650px', minWidth: '600px', data: { header: 'Edytuj regulamin', regulation } });
    editRegulation.afterClosed().subscribe(newData => {
      if (newData) {
        this.isLoadingRegulations = true;
        this.settingsService.updateRegulation(regulation.id, newData).subscribe(resp => {
          this.isLoadingRegulations = false;
          this.regulationsList = resp;
          this.toastr.success('Zapisano zmiany', 'Success');
        }, err => {
          console.error(err);
          this.isLoadingRegulations = false;
          this.toastr.error('Błąd podczas edycji regulaminu', 'Error');
        });
      }
    })
  }
}
