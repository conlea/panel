import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormGroupDirective, FormControl, Validators } from '@angular/forms';
import { PleceService } from '../plece.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.component.html',
  styleUrls: ['./place-details.component.scss']
})
export class PlaceDetailsComponent implements OnInit {

  idPlace: number;
  formOptions: FormGroup;
  places: any = [];
  placeLoading: boolean = true;

  constructor(private route: ActivatedRoute, private placeService: PleceService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.idPlace = Number(this.route.snapshot.paramMap.get('id'));

    this.formOptions = new FormGroup({
      name_pl: new FormControl('', Validators.required),
      name_short_pl: new FormControl('', Validators.required),
      name_en: new FormControl('', Validators.required),
      name_short_en: new FormControl('', Validators.required),
      country_pl: new FormControl('', Validators.required),
      country_en: new FormControl('', Validators.required),
      remote: new FormControl(''),
      rank: new FormControl('', Validators.required),
      active: new FormControl('')
    });
    if (this.idPlace) {
      this.placeService.getPlaceId(this.idPlace).subscribe(resp => {
        this.placeLoading = false;
        this.places = resp;
        this.formOptions.controls['name_pl'].setValue(this.places.name_pl);
        this.formOptions.controls['name_short_pl'].setValue(this.places.name_short_pl);
        this.formOptions.controls['name_en'].setValue(this.places.name_en);
        this.formOptions.controls['name_short_en'].setValue(this.places.name_short_en);
        this.formOptions.controls['country_pl'].setValue(this.places.country_pl);
        this.formOptions.controls['country_en'].setValue(this.places.country_en);
        this.formOptions.controls['remote'].setValue(this.places.remote);
        this.formOptions.controls['rank'].setValue(this.places.rank);
        this.formOptions.controls['active'].setValue(this.places.active);
      }, err => {
        console.error(err);
        this.placeLoading = false;
        this.toastr.error('Nie udało się pobrać Miejsca', 'Błąd');
      });
    } else {
      this.placeLoading = false;
    }

  }
  updatePlace(formDirective: FormGroupDirective) {
    if (this.idPlace > 0) { // gdy edytujemy miejsce
      if (this.formOptions.valid) {
        this.placeLoading = true;
        this.places = formDirective.form.value;
        this.placeService.updatePlace(this.idPlace, this.places).subscribe(resp => {
          this.placeLoading = false;
          this.places = resp;
          this.toastr.success('Poprawnie zapisano miejsce', 'Success');
        }, err => {
          console.error(err);
          this.placeLoading = false;
          this.toastr.error('Wystąpił błąd podczas zapisywania', 'Błąd');
        });
      }
    } else { // gdy dodajemy nowe miejsce
      if (this.formOptions.valid) {
        this.placeLoading = true;
        this.places = formDirective.form.value;
        this.places.active = 1;
        this.placeService.addNewPlace(this.places).subscribe(resp => {
          this.placeLoading = false;
          this.places = resp;
          this.router.navigate(['places', resp.id, 'details']);
          this.toastr.success('Poprawnie zapisano nowe miejsce', 'Success');
        }, err => {
          console.error(err);
          this.placeLoading = false;
          this.toastr.error('Wystąpił błąd podczas zapisywania', 'Błąd');
        });
      }
    }
  }
  removePlace(id: number) {
    this.placeService.removePlace(id).subscribe(resp => {
      this.router.navigate(['places']);
      this.toastr.success('Poprawnie usunięto miejsce', 'Success');
    }, err => {
      this.toastr.error('Błąd podczas usuwania miejsca', 'Error');
    });
  }
}
