import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormControlName,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { Router, RouterLink } from '@angular/router';
import { PassInputComponent } from '../../../shared/components/pass-input/pass-input.component';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { FirestoreCollectionUser } from '../../../models/firebase.models';
import { NgIf } from '@angular/common';

// export class UsernameAsyncValidator{
//   static userCheck(firebaseService:any){
//     return (control:AbstractControl)=>{
//       const user = control.value.toLowerCase()
//       this.firebaseService?.checkUsername(user)
//       .pipe(map(item=>{item.length ? {usernameAvailable:false} : null}))

//     }
//   }
// }

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PassInputComponent, NgIf],
  template: `
    <div>
      <h4>Register</h4>
      <form
        [formGroup]="form"
        (ngSubmit)="onSubmit()"
        class="flex flex-col bg-slate-200 w-60"
      >
        <input type="text" formControlName="username" />
        @if (
          form.controls.username.invalid &&
          (form.controls.username.touched || form.controls.username.dirty)
        ) {
          @if (form.controls.username.errors?.['usernameTaken']) {
            <span>That username has been already taken</span>
          }
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

        <pass-input [control]="getPass()" />
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
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  formBuilder = inject(NonNullableFormBuilder);

  form = this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.maxLength(25),
        Validators.minLength(3),
      ],
      asyncValidators: [this.firebaseService.checkUsername()],
    }),
    email: this.formBuilder.control('', {
      validators: [Validators.email, Validators.required],
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  onSubmit() {
    const formValues = this.form.getRawValue();
    // this.firebaseService.checkUsername(formValues.username)
    // .subscribe((res:any)=>console.log(res))
    this.firebaseService
      .signup(formValues.username, formValues.email, formValues.password)
      .pipe(
        catchError((err) => {
          console.log(err);
          throw new Error(err);
        }),
      )
      .subscribe((res) => {
        console.log(res);
        // this.router.navigate(['/'])
      });
  }

  getPass() {
    return this.form.controls['password'] as FormControl;
  }
  // tambien funciona
  // getPass2(){
  //   return this.form.get('password') as FormControl
  // }
}
/* 
https://firebase.google.com/docs/reference/js/auth#autherrorcodes

FirebaseError: Firebase: Error (auth/email-already-in-use).

auth/internal-error

auth/invalid-email

auth/wrong-password

FirebaseError: Firebase: Password should be at least 6 characters (auth/weak-password).





contraseña corta      LISTO
contraseña incorrecta LISTO
mail invalido         LISTO
mail en uso           LISTO
*/
