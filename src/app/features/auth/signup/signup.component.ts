import { Component, inject } from '@angular/core';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirebaseAuthService } from '../../../core/services/firebase-auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div>
      <h4>Register</h4>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col bg-slate-200 w-60">

        <input type="text" formControlName="username" />
        @if (
          form.controls.username.invalid &&
          (form.controls.username.touched || form.controls.username.dirty)
        ) {
          @if (form.controls.username.errors?.['required']) {
            <span>Username is a required field</span>
          }
          @if (form.controls.username.errors?.['minlength']) {
            <span>The min amount of characters is 3</span>
          }
          @if (form.controls.username.errors?.['maxlength']) {
            <span>The max amount of characters is 25</span>
          }
        }

        <input type="email" formControlName="email" />
        @if (
          form.controls.email.invalid &&
          (form.controls.email.touched || form.controls.email.dirty)
        ) {
          @if (form.controls.email.errors?.['required']) {
            <span>Email is a required field</span>
          }
          @if (form.controls.email.errors?.['email']) {
            <span>Please introduce a valid email</span>
          }
        }

        <input type="password" formControlName="password" />
        @if (
          form.controls.password.invalid &&
          (form.controls.password.touched || form.controls.password.dirty)
        ) {
          @if (form.controls.password.errors?.['required']) {
            <span>Password is a required field</span>
          }
        }

        <button type="submit" [disabled]="form.invalid">Enviar</button>
      </form>
      <a [routerLink]="['/login']">Already hace an account? Login</a>

    </div>
  `,
  styles: ``,
})
export class SignupComponent {
  firebaseAuth = inject(FirebaseAuthService)
  router = inject(Router)
  formBuilder = inject(NonNullableFormBuilder);

  form = this.formBuilder.group({
    username:this.formBuilder.control('',{validators:[Validators.required,Validators.maxLength(25),Validators.minLength(3)]}),
    email: this.formBuilder.control('', {
      validators: [Validators.email, Validators.required],
    }),
    password: this.formBuilder.control('', {validators:[Validators.required]}),
  });

  onSubmit() {
    const formValues = this.form.getRawValue()
    this.firebaseAuth.signup(formValues.username,formValues.email,formValues.password).subscribe(res=>{
      console.log(res)
      this.router.navigate(['/'])
    })

  }
}
/* 
https://firebase.google.com/docs/reference/js/auth#autherrorcodes
FirebaseError: Firebase: Error (auth/email-already-in-use).

auth/internal-error

auth/invalid-email

auth/wrong-password
*/