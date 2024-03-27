import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { FormGroup, FormControl } from "@angular/forms";
import { OrderService } from "../../order.service";
import { ToastrService } from "ngx-toastr";
import { DatePipe } from "@angular/common";

@Component({
  selector: "app-pay-link-generate",
  templateUrl: "./pay-link-generate.component.html",
  styleUrls: ["./pay-link-generate.component.scss"],
})
export class PayLinkGenerateComponent implements OnInit {
  newOrder: any;
  formOptions: FormGroup;
  isLoading = false;

  constructor(
    private orderService: OrderService,
    public dialogEvent: MatDialogRef<PayLinkGenerateComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    console.log(this.data);

    this.formOptions = new FormGroup({
      payuLink: new FormControl(this.data.order.payuLink),
      orderIDPayu: new FormControl(this.data.order.orderIDPayu),
      orderPayUStatus: new FormControl(this.data.order.orderPayUStatus),
      orderPayDate: new FormControl(this.data.order.orderPayDate),
    });
  }
  generateLink() {
    this.isLoading = true;
    let univOrderID = new Date().getTime();
    this.data.payu.externalId = `${this.data.payu.externalId}/${univOrderID}`;
    this.orderService
      .generateNewPayULink(this.data.order.id, this.data.payu)
      .subscribe(
        (resp) => {
          this.isLoading = false;
          this.dialogEvent.close(resp);
          this.toastr.success(
            "Wygenerowano i zapisano nowy link płatności",
            "Success"
          );
          // if (resp.redirectUrl) {
          //   this.formOptions.controls['payuLink'].setValue(resp.redirectUrl);
          //   this.formOptions.controls['orderIDPayu'].setValue(resp.paymentId);
          //   this.formOptions.controls['orderPayUStatus'].setValue(resp.status);
          //   this.formOptions.controls['orderPayDate'].setValue('');
          //   this.toastr.success('Wygenerowano i zapisano nowy link płatności', 'Success');
          // }
        },
        (err) => {
          console.error(err);
          this.isLoading = false;
          this.toastr.error("Błąd podczas generowania linku", "Error");
        }
      );
  }
  editPayU() {
    this.isLoading = true;
    let dataToSend = this.formOptions.value;
    dataToSend.orderPayDate = this.datePipe.transform(
      this.formOptions.get("orderPayDate").value,
      "yyyy-MM-dd"
    );
    console.log(dataToSend);

    this.orderService.orderUpdate(this.data.order.id, dataToSend).subscribe(
      (resp) => {
        this.isLoading = false;
        this.dialogEvent.close(resp);
        this.toastr.success("Zapisano zmiany", "Success");
      },
      (err) => {
        console.error(err);
        this.isLoading = false;
        this.toastr.error(
          "Błąd podczas zapisywania nowego linku płatności",
          "Error"
        );
      }
    );
  }
  exitDialog() {
    this.dialogEvent.close();
  }
}
