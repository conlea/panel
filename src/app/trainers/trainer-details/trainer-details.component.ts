import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { environment } from "src/environments/environment";
import { Trainer } from "../model/trainer";
import { TrainerService } from "../trainer.service";
import { faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-trainer-details",
  templateUrl: "./trainer-details.component.html",
  styleUrls: ["./trainer-details.component.scss"],
})
export class TrainerDetailsComponent implements OnInit {
  constructor(
    private trainerService: TrainerService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}
  isLoading: boolean = false;
  trainer: Trainer;
  idTrainer = Number(this.route.snapshot.paramMap.get("id"));
  faLinkedIn = faLinkedin;

  ngOnInit(): void {
    this.isLoading = true;
    this.trainerService.getTrainer(this.idTrainer).subscribe(
      (resp) => {
        this.isLoading = false;
        console.log(resp);
        this.trainer = resp;
      },
      (err) => {
        console.log(err);
        this.isLoading = false;
      }
    );
  }
  removeTrainer(id) {
    this.isLoading = true;
    this.trainerService.removeTrainer(id).subscribe(
      (resp) => {
        this.isLoading = false;
        this.toastr.success("Usunięto trenera", "Success");
        this.router.navigate(["trainers"]);
      },
      (err) => {
        this.isLoading = false;
        this.toastr.error("Błąd podczas usuwania trenera", "Error");
      }
    );
  }
}
