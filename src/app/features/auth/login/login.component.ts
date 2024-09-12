import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
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

        <input type="text" formControlName="password" />

        <button type="submit">Enviar</button>
      </form>

        <a [routerLink]="['/register']">Don't have an account? Create one</a>
    </div>`,
  styles: ``
})
export class LoginComponent {
  firebaseAuth = inject(FirebaseService)
  router = inject(Router)
  formBuilder = inject(NonNullableFormBuilder);

  form = this.formBuilder.group({
    username:this.formBuilder.control('',{validators:[Validators.required,Validators.maxLength(25),Validators.minLength(3)]}),
    email: this.formBuilder.control('', {
      validators: [Validators.email, Validators.required],
    }),
    password: this.formBuilder.control(''),
  });

  onSubmit() {
    const formValues = this.form.getRawValue()
    this.firebaseAuth.login(formValues.email,formValues.password).subscribe(res=>{
      console.log(res)
      this.router.navigate(['/'])
    })

  }
}
