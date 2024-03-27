import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { MethodService } from '../method.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-methods-details',
  templateUrl: './methods-details.component.html',
  styleUrls: ['./methods-details.component.scss']
})
export class MethodsDetailsComponent implements OnInit {

  idMethod: number;
  formOptions: FormGroup;
  method: any = [];
  methodLoading: boolean = true;

  constructor(private methodService: MethodService, private route: ActivatedRoute, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.idMethod = Number(this.route.snapshot.paramMap.get('id'));

    this.formOptions = new FormGroup({
      name_pl: new FormControl('', Validators.required),
      name_list_pl: new FormControl(''),
      link_pl: new FormControl(''),
      name_en: new FormControl('', Validators.required),
      name_list_en: new FormControl(''),
      link_en: new FormControl(''),
      ico: new FormControl(''),
      rank: new FormControl('', Validators.required),
      active: new FormControl(0),
    });

    if (this.idMethod) {
      this.methodService.getMethodID(this.idMethod).subscribe(resp => {
        this.methodLoading = false;
        this.method = resp;
        this.formOptions.controls['name_pl'].setValue(this.method.name_pl);
        this.formOptions.controls['name_list_pl'].setValue(this.method.name_list_pl);
        this.formOptions.controls['link_pl'].setValue(this.method.link_pl);
        this.formOptions.controls['name_en'].setValue(this.method.name_en);
        this.formOptions.controls['name_list_en'].setValue(this.method.name_list_en);
        this.formOptions.controls['link_en'].setValue(this.method.link_en);
        this.formOptions.controls['ico'].setValue(this.method.ico);
        this.formOptions.controls['rank'].setValue(this.method.rank);
        this.formOptions.controls['active'].setValue(this.method.active);
      }, err => {
        console.error(err);
        this.methodLoading = false;
        this.toastr.error('Nie udało się pobrać metod szkoleń', 'Błąd');
      });
    } else {
      this.methodLoading = false;
    }
  }
  updateMethod(formDirective: FormGroupDirective) {
    if (this.idMethod > 0) { // gdy edytujemy metode
      if (this.formOptions.valid) {
        this.methodLoading = true;
        this.method = formDirective.form.value;
        this.methodService.updateMethod(this.idMethod, this.method).subscribe(resp => {
          this.methodLoading = false;
          this.method = resp;
          this.toastr.success('Poprawnie zapisano metode szkoleń', 'Success');
        }, err => {
          console.error(err);
          this.methodLoading = false;
          this.toastr.error('Wystąpił błąd podczas zapisywania', 'Błąd');
        });
      }
    } else { // gdy dodajemy nową metode
      if (this.formOptions.valid) {
        this.methodLoading = true;
        this.method = formDirective.form.value;
        this.method.active = 1;
        this.methodService.addMethod(this.method).subscribe(resp => {
          this.methodLoading = false;
          this.method = resp;
          this.router.navigate(['methods', resp.id, 'details']);
        }, err => {
          this.methodLoading = false;
          this.toastr.error('Wystąpił błąd podczas zapisywania', 'Błąd');
        });
      }
    }
  }
  removeMethod(id: number) {
    this.methodService.removeMethod(id).subscribe(resp => {
      this.router.navigate(['methods']);
      this.toastr.success('Poprawnie usunięto metode szkoleń', 'Success');
    }, err => {
      this.toastr.error('Błąd podczas usuwania metody szkoleń', 'Error');
    });
  }
}
