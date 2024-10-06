import { Component, inject, input, model } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { Router, RouterLink } from '@angular/router';
import { PassInputComponent } from '../../../shared/components/pass-input/pass-input.component';
import { catchError } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PassInputComponent],
  template:`
  <div>
      <h4>Login</h4>
      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col bg-slate-200 w-60">

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
          @if (form.controls.password.errors?.['minlength']) {
            <span>The min amount of characters is 6</span>
          }
        }


        
        <button type="submit" [disabled]="form.invalid" >Enviar</button>
      </form>

        {{error()}}

        @if(subscriptionRedirect()){
      <a [routerLink]="['/register']" [queryParams]="{subscriptionRedirect:true}">Don't have an account? Create one</a>
      }@else {
        <a [routerLink]="['/register']">Don't have an account? Create one</a>
      }
    </div>`,
  styles: ``
})
export class LoginComponent {
  firebaseAuth = inject(FirebaseService)
  router = inject(Router)
  formBuilder = inject(NonNullableFormBuilder);

  error = model<string>('')

  subscriptionRedirect  = input<boolean>();


  form = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.email, Validators.required],
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6)],
    }),
  });

  onSubmit() {
    const formValues = this.form.getRawValue()
    this.firebaseAuth.login(formValues.email,formValues.password)
    .pipe(
      catchError((err:Error) => {
        switch (err.message) {
          case ('Firebase: Error (auth/invalid-credential).'):
            this.error.set('Password is incorrect')
            break;
          
            case ('Firebase: Error (auth/internal-error).'):
            this.error.set('There was an error in your request, please try again later')
            break;
        }
        throw new Error(err.message);
      }),
    )
    .subscribe(res=>{
      if(this.subscriptionRedirect()){
        this.router.navigate(['/subscription/checkout'])
      } else this.router.navigate(['/'])
    })

  }

  getPass() {
    return this.form.controls['password'] as FormControl;
  }

}
