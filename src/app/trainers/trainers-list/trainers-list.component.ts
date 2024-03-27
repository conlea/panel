import { ChangeDetectorRef, Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { Trainer } from "../model/trainer";
import { TrainerService } from "../trainer.service";

@Component({
  selector: "app-trainers-list",
  templateUrl: "./trainers-list.component.html",
  styleUrls: ["./trainers-list.component.scss"],
})
export class TrainersListComponent implements OnInit {
  searchTrainer = "";
  trainersLoading: boolean = false;

  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["name", "trainings"];
  @ViewChild("paginatorListTrainers") paginatorListTrainers: MatPaginator;

  constructor(
    private trainerService: TrainerService,
    private toastr: ToastrService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.getTrainers();
  }
  getTrainers() {
    this.trainersLoading = true;
    this.trainerService.trainerList().subscribe(
      (resp) => {
        this.trainersLoading = false;
        console.log(resp);
        this.changeDetector.detectChanges();
        this.dataSource = new MatTableDataSource(resp);
        this.dataSource.paginator = this.paginatorListTrainers;
      },
      (err) => {
        console.error(err);
        this.trainersLoading = false;
        this.toastr.error("Nie udało się pobrać listy miejsc", "Błąd");
      }
    );
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
