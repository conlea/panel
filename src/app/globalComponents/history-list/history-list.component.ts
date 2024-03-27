import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ViewEmailMsgComponent } from "src/app/orders/modal/view-email-msg/view-email-msg.component";

@Component({
  selector: "app-history-list",
  templateUrl: "./history-list.component.html",
  styleUrls: ["./history-list.component.scss"],
})
export class HistoryListComponent implements OnInit {
  @Input() historyList;
  @Input() order;
  @Input() trainingDate;

  @Output() refreshList = new EventEmitter();

  listHistorySource: MatTableDataSource<any>;
  listrHistoryColumns = ["name", "user"];

  @ViewChild("paginatorOrderHistoryList")
  paginatorOrderHistoryList: MatPaginator;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}
  ngOnChanges(changes: any) {
    if (changes.historyList) {
      this.historyList = changes.historyList.currentValue;
      console.log("new Value historyList");
      this.addEventToTable();
    }
  }
  ngOnInit(): void {}
  public addEventToTable() {
    if (this.order) {
      let comment = "Zapisano nowe zgłoszenie";
      let userCreate = {};
      if (this.order.userCreate) {
        comment = "Dodano nowe zgłoszenie";
        userCreate = {
          first_name: this.order.userCreate.first_name,
          last_name: this.order.userCreate.last_name,
        };
      }
      this.historyList.push({
        comment,
        userCreate,
        updated_at: this.order.updated_at,
      });
    }
    if (this.trainingDate) {
      let userCreate = {};
      if (this.trainingDate.userCreate) {
        userCreate = {
          first_name: this.trainingDate.userCreate.first_name,
          last_name: this.trainingDate.userCreate.last_name,
        };
      }
      this.historyList.push({
        comment: "Dodano nowy termin wydarzenia",
        userCreate,
        updated_at: this.trainingDate.updated_at,
      });
    }
    this.changeDetector.detectChanges();
    this.listHistorySource = new MatTableDataSource(this.historyList);
    this.listHistorySource.paginator = this.paginatorOrderHistoryList;
  }
  public showEmailVindication(email) {
    if (email.order_id) {
      this.dialog.open(ViewEmailMsgComponent, {
        maxWidth: "650px",
        minWidth: "600px",
        data: { header: "Treść wiadomości", email },
      });
    } else {
      this.dialog.open(ViewEmailMsgComponent, {
        maxWidth: "650px",
        minWidth: "600px",
        data: { header: "Treść wiadomości grupowej", email },
      });
    }
  }
  public refreshStatus(mailsLog) {
    this.refreshList.emit(mailsLog.id);
  }
}
