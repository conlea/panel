import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { FormGroup, FormControl, Validators, FormGroupDirective } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  formOptions: FormGroup;
  isLoadingToLogIn: boolean = true;
  hide = true;

  constructor(private authService: AuthService, private router: Router, private toastr: ToastrService) {
  }

  ngOnInit() {
    if (this.authService.isUser.value) {
      this.router.navigate(['/training-dates']);
    }
    this.isLoadingToLogIn = false;
    this.formOptions = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required)
    });

  }
  login(formDirective: FormGroupDirective) {
    this.isLoadingToLogIn = true;
    this.authService.login(this.formOptions.get('email').value, this.formOptions.get('password').value).subscribe(access => {
      this.isLoadingToLogIn = false;
      formDirective.resetForm();
      this.router.navigate(['/training-dates']);
    }, err => {
      this.isLoadingToLogIn = false;
      this.toastr.error("Błędny adres email lub hasło", 'Błąd');
    });
  }
  signup() {
  }
  logout() {
    this.authService.logout();
  }

}
