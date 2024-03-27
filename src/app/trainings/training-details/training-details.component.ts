import { ChangeDetectorRef, Component, OnInit } from "@angular/core";
import { TrainingService } from "../training.service";
import { ToastrService } from "ngx-toastr";
import { Router, ActivatedRoute } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { GroupService } from "src/app/groups/group.service";
import { MatTableDataSource } from "@angular/material/table";
import { AddEditDefaultTicketsComponent } from "../modal/add-edit-default-tickets/add-edit-default-tickets.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-training-details",
  templateUrl: "./training-details.component.html",
  styleUrls: ["./training-details.component.scss"],
})
export class TrainingDetailsComponent implements OnInit {
  training: any = [];
  formOptions: FormGroup;
  idTraining: number;
  trainingLoading = true;
  groupList = [];
  currencyList: any = [];
  ticketAttr: any = [];
  langList: any = [];
  formsHS: any = [];
  allDefaultTickets = [];
  ticketDataSource: MatTableDataSource<any>;
  ticketColumns: string[] = ["name", "price_PLN", "limit", "action"];

  constructor(
    private trainingService: TrainingService,
    private router: Router,
    private dialog: MatDialog,
    private groupService: GroupService,
    private route: ActivatedRoute,
    private changeDetector: ChangeDetectorRef,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.idTraining = Number(this.route.snapshot.paramMap.get("id"));
    this.formOptions = new FormGroup({
      //Informacje ogólne
      status: new FormControl("", Validators.required),
      name_pl: new FormControl("", Validators.required),
      name_en: new FormControl("", Validators.required),
      name_short_pl: new FormControl("", Validators.required),
      name_short_en: new FormControl("", Validators.required),
      alias_pl: new FormControl(""),
      alias_en: new FormControl(""),
      file_pdf_pl: new FormControl(""),
      file_pdf_en: new FormControl(""),
      kod: new FormControl("", Validators.required),
      gtuCode: new FormControl(""),
      grupa_id: new FormControl("", Validators.required),
      logo: new FormControl(""),
      formIdHS: new FormControl(""),
      rank: new FormControl(""),

      // Pozostałe
      is_Take2_available: new FormControl(false),
      is_blended: new FormControl(""),
      price_blended: new FormControl("0"),

      //Cena egzaminu
      is_exam_available: new FormControl(false),
      is_exam_required: new FormControl(false),
      exam_lang: new FormControl("", Validators.required),
      // price_exam: new FormControl('0', Validators.required),
      // price_Take2_exam: new FormControl('0', Validators.required),
      price_exam_desc_pl: new FormControl(""),
      price_exam_desc_en: new FormControl(""),

      // Certyfikat
      is_ecert_available: new FormControl(false),
      price_ecert_papier: new FormControl(0),

      //Podręcznik
      is_book_available: new FormControl(false),
      is_book_required: new FormControl(false),

      // price_book: new FormControl('0', Validators.required),
      book_iso: new FormControl(""),
      book_pl: new FormControl(""),
      book_en: new FormControl(""),

      //Język
      lang: new FormControl("", Validators.required),
      lang_materials: new FormControl("", Validators.required),
    });

    this.training = this.formOptions.value;
    this.training.is_blended = false;

    if (this.idTraining > 0) {
      this.trainingService.getTraining(this.idTraining).subscribe(
        (resp) => {
          this.training = resp.training;
          this.groupList = resp.groups;
          this.currencyList = resp.currency;
          this.langList = resp.langs;
          this.formsHS = resp.sendForms;
          this.ticketAttr = resp.ticketAttr;
          this.allDefaultTickets = resp.defaultTickets;

          this.ticketDataSource = new MatTableDataSource(
            this.allDefaultTickets
          );

          // dodanie validacji kwot w różnych walutach
          this.currencyList.forEach((currency) => {
            if (currency.active > 0) {
              this.formOptions.addControl(
                "price_exam_" + currency.name,
                new FormControl(
                  this.training["price_exam_" + currency.name],
                  Validators.required
                )
              );
              this.formOptions.addControl(
                "price_Take2_exam_" + currency.name,
                new FormControl(
                  this.training["price_Take2_exam_" + currency.name],
                  Validators.required
                )
              );
              this.formOptions.addControl(
                "price_book_" + currency.name,
                new FormControl(
                  this.training["price_book_" + currency.name],
                  Validators.required
                )
              );
            }
          });

          // Informacje ogólne
          this.formOptions.controls["status"].setValue(this.training.status);
          this.formOptions.controls["name_pl"].setValue(this.training.name_pl);
          this.formOptions.controls["name_en"].setValue(this.training.name_en);
          this.formOptions.controls["name_short_pl"].setValue(
            this.training.name_short_pl
          );
          this.formOptions.controls["name_short_en"].setValue(
            this.training.name_short_en
          );
          this.formOptions.controls["alias_pl"].setValue(
            this.training.alias_pl
          );
          this.formOptions.controls["alias_en"].setValue(
            this.training.alias_en
          );
          this.formOptions.controls["file_pdf_pl"].setValue(
            this.training.file_pdf_pl
          );
          this.formOptions.controls["file_pdf_en"].setValue(
            this.training.file_pdf_en
          );
          this.formOptions.controls["kod"].setValue(this.training.kod);
          this.formOptions.controls["gtuCode"].setValue(this.training.gtuCode);
          this.formOptions.controls["grupa_id"].setValue(
            this.training.grupa_id
          );
          this.formOptions.controls["logo"].setValue(this.training.logo);
          this.formOptions.controls["rank"].setValue(this.training.rank);
          this.formOptions.controls["formIdHS"].setValue(
            this.training.formIdHS
          );

          // Pozostałe
          this.formOptions.controls["is_Take2_available"].setValue(
            this.training.is_Take2_available
          );
          this.formOptions.controls["is_blended"].setValue(
            this.training.is_blended
          );
          this.formOptions.controls["price_blended"].setValue(
            this.training.price_blended
          );

          // Cena egzaminu
          let examLang = "";
          if (this.training.exam_lang != "") {
            this.training.exam_lang = this.training.exam_lang
              .replace(" ", "")
              .toUpperCase();
            examLang = this.training.exam_lang.toUpperCase().split("||");
            if (examLang.length == 1) {
              examLang = this.training.exam_lang.toUpperCase().split(",");
            }
          }
          this.formOptions.controls["is_exam_available"].setValue(
            this.training.is_exam_available
          );
          this.formOptions.controls["is_exam_required"].setValue(
            this.training.is_exam_required
          );
          this.formOptions.controls["exam_lang"].setValue(examLang);
          // this.formOptions.controls['price_exam'].setValue(this.training.price_exam);
          // this.formOptions.controls['price_Take2_exam'].setValue(this.training.price_Take2_exam);
          this.formOptions.controls["price_exam_desc_pl"].setValue(
            this.training.price_exam_desc_pl
          );
          this.formOptions.controls["price_exam_desc_en"].setValue(
            this.training.price_exam_desc_en
          );

          //Certyfikat
          this.formOptions.controls["is_ecert_available"].setValue(
            this.training.is_ecert_available
          );
          this.formOptions.controls["price_ecert_papier"].setValue(
            this.training.price_ecert_papier
          );

          //Podręcznik
          this.formOptions.controls["is_book_available"].setValue(
            this.training.is_book_available
          );
          this.formOptions.controls["is_book_required"].setValue(
            this.training.is_book_required
          );
          // this.formOptions.controls['price_book'].setValue(this.training.price_book);
          this.formOptions.controls["book_iso"].setValue(
            this.training.book_iso
          );
          this.formOptions.controls["book_pl"].setValue(this.training.book_pl);
          this.formOptions.controls["book_en"].setValue(this.training.book_en);

          //Język
          let lang = "";
          if (this.training.lang != "") {
            this.training.lang = this.training.lang
              .replace(" ", "")
              .toUpperCase();
            lang = this.training.lang.split("||");
            if (lang.length == 1) {
              lang = this.training.lang.split(",");
            }
          }
          this.formOptions.controls["lang"].setValue(lang);
          let lang_materials = "";
          if (this.training.lang_materials != "") {
            this.training.lang_materials = this.training.lang_materials
              .replace(" ", "")
              .toUpperCase();
            lang_materials = this.training.lang_materials
              .toUpperCase()
              .split("||");
            if (lang_materials.length == 1) {
              lang_materials = this.training.lang_materials
                .toUpperCase()
                .split(",");
            }
          }
          this.formOptions.controls["lang_materials"].setValue(lang_materials);
          this.trainingLoading = false;
        },
        (err) => {
          console.error(err);
          this.trainingLoading = false;
          this.toastr.error("Nie udało się pobrać szkolenia", "Błąd");
        }
      );
    } else {
      this.trainingService.getTrainingToAdd().subscribe(
        (resp) => {
          this.trainingLoading = false;
          this.groupList = resp.groups;
          this.currencyList = resp.currency;
          this.langList = resp.langs;
          this.formsHS = resp.sendForms;

          // dodanie validacji kwot w różnych walutach
          this.currencyList.forEach((currency) => {
            if (currency.active > 0) {
              this.formOptions.addControl(
                "price_exam_" + currency.name,
                new FormControl("0", Validators.required)
              );
              this.formOptions.addControl(
                "price_book_" + currency.name,
                new FormControl("0", Validators.required)
              );
              this.formOptions.addControl(
                "price_Take2_exam_" + currency.name,
                new FormControl("0", Validators.required)
              );
            }
          });
        },
        (err) => {
          console.error(err);
          this.trainingLoading = false;
          this.toastr.error(
            "Nie udało się pobrać parametrów szkolenia",
            "Błąd"
          );
        }
      );
    }
  }
  updateTraining(formDirective: FormGroupDirective) {
    console.log(this.formOptions);

    if (this.formOptions.valid) {
      this.trainingLoading = true;
      this.training = formDirective.form.value;
      this.training.lang = this.training.lang.toString();
      this.training.exam_lang = this.training.exam_lang.toString();
      this.training.lang_materials = this.training.lang_materials.toString();

      if (this.idTraining > 0) {
        this.trainingService
          .updateTraining(this.idTraining, this.training)
          .subscribe(
            (resp) => {
              this.trainingLoading = false;
              this.training = resp.training;
              this.groupList = resp.groups;
              this.toastr.success("Poprawnie zapisano szkolenie", "Success");
            },
            (err) => {
              console.error(err);
              this.trainingLoading = false;
              this.toastr.error("Wystąpił błąd podczas zapisywania", "Błąd");
            }
          );
      } else {
        this.trainingService.addTraining(this.training).subscribe(
          (resp) => {
            this.trainingLoading = false;
            this.router.navigate(["trainings", resp, "details"]);
            this.toastr.success("Dodano nowe szkolenie", "Success");
          },
          (err) => {
            console.error(err);
            this.trainingLoading = false;
            this.toastr.error(
              "Wystąpił błąd podczas dodawania szkolenia",
              "Błąd"
            );
          }
        );
      }
    }
  }
  addDefaultTicket() {
    let activeCurrency = this.currencyList.filter((e) => e.active === 1);
    const addDefaultTrainingTicket = this.dialog.open(
      AddEditDefaultTicketsComponent,
      {
        maxWidth: "650px",
        minWidth: "600px",
        data: {
          header: "Dodaj nowy domyślny pakiet",
          trainingId: this.training.id,
          ticketAttr: this.ticketAttr,
          currency: activeCurrency,
        },
      }
    );
    addDefaultTrainingTicket.afterClosed().subscribe((defaultTicketList) => {
      if (defaultTicketList) {
        this.allDefaultTickets = defaultTicketList;
        this.changeDetector.detectChanges();
        this.ticketDataSource = new MatTableDataSource(this.allDefaultTickets);
      }
    });
  }
  editDefaultTicket(ticketToEdit) {
    console.log(ticketToEdit);
    let activeCurrency = this.currencyList.filter((e) => e.active === 1);
    const editDefaultTrainingTicket = this.dialog.open(
      AddEditDefaultTicketsComponent,
      {
        maxWidth: "650px",
        minWidth: "600px",
        data: {
          header: "Edytuj dane domyślnego pakietu",
          ticket: ticketToEdit,
          ticketAttr: this.ticketAttr,
          currency: activeCurrency,
        },
      }
    );
    editDefaultTrainingTicket.afterClosed().subscribe((defaultTickets) => {
      if (defaultTickets) {
        this.allDefaultTickets = defaultTickets;
        this.changeDetector.detectChanges();
        this.ticketDataSource = new MatTableDataSource(this.allDefaultTickets);
      }
    });
  }
  remove() {
    console.log();
    this.trainingService.removeTraining(this.idTraining).subscribe(
      (resp) => {
        this.toastr.success("Szkolenie zostało usunięte", "Success");
        this.router.navigate(["trainings"]);
      },
      (err) => {
        console.error(err);
        this.toastr.error("Wystąpił błąd usuwania szkolenia szkolenia", "Błąd");
      }
    );
  }
}
