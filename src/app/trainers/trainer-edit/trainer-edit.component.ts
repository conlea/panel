import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Trainer } from "../model/trainer";
import { TrainerService } from "../trainer.service";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-trainer-edit",
  templateUrl: "./trainer-edit.component.html",
  styleUrls: ["./trainer-edit.component.scss"],
})
export class TrainerEditComponent implements OnInit {
  trainer_id: number = null;
  trainerLoading: boolean = false;
  fileUpload: boolean = false;
  formOptions: FormGroup;
  trainer: Trainer;
  trainingList: any = [];
  file: any;

  constructor(
    private trainerService: TrainerService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trainer_id = Number(this.route.snapshot.paramMap.get("id"));
    this.formOptions = new FormGroup({
      active: new FormControl(1),
      thumb: new FormControl(""),
      name: new FormControl("", Validators.required),
      lastName: new FormControl("", Validators.required),
      phone: new FormControl(""),
      position: new FormControl(""),
      bio_pl: new FormControl(""),
      bio_en: new FormControl(""),
      trainings_id: new FormControl(""),
      linkedin: new FormControl(""),
    });
    this.trainer = this.formOptions.value;
    if (this.trainer_id) {
      this.getTrainer(this.trainer_id);
    } else {
      this.trainerLoading = true;
      this.trainerService.getParamsTrainer().subscribe(
        (resp) => {
          this.trainerLoading = false;
          this.trainingList = resp;
        },
        (err) => {
          this.trainerLoading = false;
        }
      );
    }
  }
  getTrainer(id) {
    this.trainerLoading = true;
    this.trainerService.editTrainer(id).subscribe(
      (resp) => {
        console.log(resp);
        this.trainer = resp.trainer;
        this.trainingList = resp.trainingList;
        this.trainerLoading = false;
        this.formOptions.controls["active"].setValue(this.trainer.active);
        this.formOptions.controls["thumb"].setValue(this.trainer.thumb);
        this.formOptions.controls["name"].setValue(this.trainer.name);
        this.formOptions.controls["lastName"].setValue(this.trainer.lastName);
        this.formOptions.controls["phone"].setValue(this.trainer.phone);
        this.formOptions.controls["position"].setValue(this.trainer.position);
        this.formOptions.controls["bio_pl"].setValue(this.trainer.bio_pl);
        this.formOptions.controls["bio_en"].setValue(this.trainer.bio_en);
        this.formOptions.controls["trainings_id"].setValue(
          this.trainer.trainings_id
        );
        this.formOptions.controls["linkedin"].setValue(this.trainer.linkedin);
      },
      (err) => {
        console.error(err);
        this.trainerLoading = false;
      }
    );
  }
  getFile(event) {
    this.file = event.target.files[0];
    if (this.file) {
      console.log(this.file);
      let fileOptions = {
        access: "PUBLIC_INDEXABLE",
        ttl: "P3M",
        overwrite: false,
        duplicateValidationStrategy: "NONE",
        duplicateValidationScope: "ENTIRE_PORTAL",
      };
      let formData = new FormData();
      formData.set("file", this.file);
      this.fileUpload = true;
      this.trainerService.sendTrainerImg(formData).subscribe(
        (resp) => {
          this.fileUpload = false;
          this.trainer.thumb = resp.imgUrl;
          this.formOptions.controls["thumb"].setValue(resp.imgUrl);
        },
        (err) => {
          console.log(err);
          this.fileUpload = false;
        }
      );
    }
  }
  saveTrainer(formDirective: FormGroupDirective) {
    if (this.formOptions.valid) {
      this.trainerLoading = true;
      let trainerData = formDirective.form.value;
      console.log(trainerData);
      if (this.trainer_id) {
        trainerData.id = this.trainer.id;
        this.trainerService.updateTrainer(trainerData).subscribe(
          (resp) => {
            this.trainerLoading = false;
            this.router.navigate(["trainers", resp.id, "details"]);
            this.toastr.success("Zapisano zmiany", "Success");
          },
          (err) => {
            console.error(err);
            this.trainerLoading = false;
          }
        );
      } else {
        this.trainerService.createNewTrainer(trainerData).subscribe(
          (resp) => {
            console.log(resp);
            this.trainerLoading = false;
            this.router.navigate(["trainers", resp.id, "details"]);
            this.toastr.success("Poprawnie dodano trenera", "Success");
          },
          (err) => {
            console.error(err);
            this.trainerLoading = false;
          }
        );
      }
    } else {
      this.toastr.error("Wypełnij wymagane pola", "Error");
    }
  }
  removeThumb() {
    this.trainer.thumb = "";
    this.formOptions.controls["thumb"].setValue("");
  }
  removeTrainer(id) {
    console.log("remove trainer");
    this.trainerLoading = true;
    this.trainerService.removeTrainer(id).subscribe(
      (resp) => {
        this.trainerLoading = false;
        this.router.navigate(["trainers"]);
      },
      (err) => {
        this.trainerLoading = false;
        this.toastr.error("Błąd podczas usuwania trenera", "Error");
      }
    );
  }
}
