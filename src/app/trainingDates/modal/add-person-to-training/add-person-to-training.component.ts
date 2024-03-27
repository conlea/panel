import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TrainingDatesService } from '../../training-dates.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-person-to-training',
  templateUrl: './add-person-to-training.component.html',
  styleUrls: ['./add-person-to-training.component.scss']
})
export class AddPersonToTrainingComponent implements OnInit {

  formOptions: FormGroup;
  personFromHS;
  filteredOptions;
  options = [];
  personChoiseId = '';

  constructor(private toastr: ToastrService, private trainingDateDetails: TrainingDatesService, public dialogEvent: MatDialogRef<AddPersonToTrainingComponent>, @Inject(MAT_DIALOG_DATA) public data) { }


  ngOnInit(): void {
    this.formOptions = new FormGroup({
      getPerson: new FormControl('', [Validators.minLength(4), Validators.required])
    });

  }
  onSearchChange(event) {
    this.personChoiseId = '';
    if (event.length > 3) {
      this.trainingDateDetails.findPersonFromHS(event).subscribe(resp => {
        this.filteredOptions = resp.contacts;
      }, err => {
        this.filteredOptions = [];
      })
    } else {
      this.options = [];
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
