import { Component, inject, input, model } from '@angular/core';
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
import { FirestoreCollectionUser } from '../../../shared/interfaces/firebase.interfaces';
import { NgIf } from '@angular/common';


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
          @if (form.controls.username.errors?.['required'] || form.controls.username.errors?.['blankText']) {
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
          @if (form.controls.password.errors?.['required'] ) {
            <span>Password is a required field</span>
          }
          @if (form.controls.password.errors?.['minlength']) {
            <span>The min amount of characters is 6</span>
          }
        }
        
        <button type="submit" [disabled]="form.invalid">Enviar</button>
        {{ errorMessage }}
        {{ error() }}
      </form>

      @if(redirect()){
      <a [routerLink]="['/login']" [queryParams]="{redirect:redirect()}">Already hace an account? Login</a>
      }@else {
        <a [routerLink]="['/login']">Already hace an account? Login</a>
      }
    </div>
  `,
  styles: ``,
})
export class SignupComponent {
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  formBuilder = inject(NonNullableFormBuilder);

  redirect  = input<string>();


  errorMessage = '';
  error = model<string>('')

  form = this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.maxLength(25),
        Validators.minLength(3),
        this.trimValidator
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
    this.firebaseService
      .signup(formValues.username, formValues.email, formValues.password)
      .pipe(
        catchError((err:Error) => {
          switch (err.message) {
            case ('Firebase: Error (auth/email-already-in-use).'):
              this.error.set('That email is already in use')
              break;

            case ('Firebase: Error (auth/invalid-email).'):
              this.error.set('Please enter a valid email')
              break;
            
              case ('Firebase: Error (auth/internal-error).'):
              this.error.set('There was an error in your request, please try again later')
              break;
          }
          throw new Error(err.message);
        }),
      )
      .subscribe((res) => {
        if(!this.redirect()){
          this.router.navigate(['/'])
        } 
        if(this.redirect() == 'subscription') this.router.navigate(['/subscription/checkout'])
        else if(this.redirect()?.split('-')[0] == 'article') this.router.navigate([`/article/${this.redirect()?.split('-')[1]}`])
      });
  }

  getPass() {
    return this.form.controls['password'] as FormControl;
  }
  // tambien funciona
  // getPass2(){
  //   return this.form.get('password') as FormControl
  // }
  trimValidator(control:AbstractControl){
    return control.value.trim().length >= 3 ? null : {blankText:true}
  }

}
/* 
https://firebase.google.com/docs/reference/js/auth#autherrorcodes


auth/internal-error


auth/wrong-password

*/

//TODO valid characters username