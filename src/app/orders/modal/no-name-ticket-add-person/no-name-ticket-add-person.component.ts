import { Component, OnInit, Inject } from '@angular/core';
import { OrderService } from '../../order.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-no-name-ticket-add-person',
  templateUrl: './no-name-ticket-add-person.component.html',
  styleUrls: ['./no-name-ticket-add-person.component.scss']
})
export class NoNameTicketAddPersonComponent implements OnInit {

  formOptions: FormGroup;
  personFromHS;
  filteredOptions;
  personChoiseId = '';

  constructor(private orderService: OrderService, public dialogEvent: MatDialogRef<NoNameTicketAddPersonComponent>, @Inject(MAT_DIALOG_DATA) public data, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.formOptions = new FormGroup({
      getPerson: new FormControl('', [Validators.minLength(4), Validators.required])
    });
  }

  onSearchChange(event) {
    this.personChoiseId = '';
    if (event.length > 3) {
      this.orderService.findPersonFromHS(event).subscribe(resp => {
        this.filteredOptions = resp.contacts;
      }, err => {
        this.filteredOptions = [];
      })
    }
  }
  onEnter(newId) {
    this.personChoiseId = newId;
  }
  addPerson() {
    if (this.personChoiseId) {
      this.dialogEvent.close(this.personChoiseId);
    } else {
      this.toastr.error('Nie wybrano nowej osoby', 'Error');
    }
  }
  exitDialog() {
    this.dialogEvent.close();
  }

}
