import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/core/auth/auth.service';
import { LoginResponse } from 'src/core/auth/auth.types';
import { UserService } from 'src/core/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{

  @ViewChild('signInNgForm') signInNgForm: NgForm;

  signInForm: UntypedFormGroup;


  constructor(
    private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: UntypedFormBuilder,
    private _router: Router,
    private _userService: UserService,
  ) {
  }

  ngOnInit(): void {

    this.signInForm = this._formBuilder.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      grant_type: ['password'],
      scope: ['*'],
      client_id: [1],
      client_secret: ['u5aIBN3c1ZMnwovs1Mk7zryHfWDEgte8IutNLVuQ'],
    });

  }

  signIn(): void {
    if (this.signInForm.invalid) {
      return;
    }

    this.signInForm.disable();

    this._authService.signIn(this.signInForm.value)
      .subscribe({
        next: (response: LoginResponse) => {

          this._router.navigateByUrl('users');
        },
        error: (response: any) => {
          if(response.status === 403 || response.status === 401 || response.status === 400){
            alert('Email o contraseña incorrectos');
          }
          else{
            alert(response.message);
          }
          console.log(response);
        }

      });
  }
}
