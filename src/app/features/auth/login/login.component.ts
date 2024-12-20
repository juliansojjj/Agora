import { Component, inject, input, model } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../core/services/firebase.service';
import { Router, RouterLink } from '@angular/router';
import { PassInputComponent } from '../../../shared/components/pass-input/pass-input.component';
import { catchError } from 'rxjs';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, PassInputComponent, NgClass],
  template:`
    <div class="relative w-full h-fit">
      <div class="w-full lg:grid lg:grid-cols-[9%_82%_9%] flex flex-col lg:items-start items-center pt-6">

      <a routerLink="/" class="h-fit w-fit justify-self-center sm:mt-4">
            <img src="agora-shade-isotype.svg" class="h-[5rem]" />
          </a>

        <div class="w-full flex justify-center lg:justify-between lg:pl-6 sm:mt-10">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col items-center lg:items-start w-fit">
                <h1 class=" font-bold lg:text-[5rem] sm:text-[3.5rem] xsm:text-[3rem] text-[2.3rem] text-brandViolet sm:mt-14 mt-6 md:text-start text-center">Login</h1>
                
                
                <div class="flex flex-col-reverse sm:mt-8 mt-3">
                  <input type="email" formControlName="email" id="email" 
                  class="peer sm:w-[20rem] w-[12rem] h-[2.5rem] sm:border-[.5rem] border-[.4rem] border-brandShade box-content px-2 focus:outline-none focus:border-brandViolet text-[1.1rem]"/>
                  <label class="sm:text-[1.8rem] text-[1.5rem] font-semibold mb-4 text-brandShade peer-focus:text-brandViolet" for="email">
                    Email
                  </label>
                </div>
                <div class="sm:h-[3rem] h-[2rem] mt-2 w-fit self-start pl-6 sm:pl-0">
                  @if (
                    form.controls.email.invalid &&
                    (form.controls.email.touched || form.controls.email.dirty)
                  ) {
                    @if (form.controls.email.errors?.['required']) {
                      <span class="errorLabel">Email is a required field</span>
                    }
                    @if (form.controls.email.errors?.['email']) {
                      <span class="errorLabel">Please introduce a valid email</span>
                    }
                  }
                </div>
              

                <pass-input [control]="getPass()" />
                <div class="sm:h-[3rem] h-[2rem] mt-2 w-fit self-start pl-6 sm:pl-0">
                  @if (
                  form.controls.password.invalid &&
                  (form.controls.password.touched || form.controls.password.dirty)
                  ) {
                    @if (form.controls.password.errors?.['required']) {
                      <span class="errorLabel">Password is a required field</span>
                    }
                    @if (form.controls.password.errors?.['minlength']) {
                      <span class="errorLabel">The min amount of characters is 6</span>
                    }
                  }
                </div>

                
                <button type="submit" [disabled]="form.invalid" 
                class="bg-brandViolet py-2 px-8 font-semibold mt-1 text-[1.6rem] text-white w-fit hover:bg-brandShade hover:text-black active:scale-95">Send</button>
                
                <div class="sm:h-[3rem] h-[2rem] mt-2 w-fit self-start pl-6 sm:pl-0">
                  <span class="errorLabel">{{error()}}</span>
                </div>

                @if(redirect()){
                  <a [routerLink]="['/register']" [queryParams]="{redirect:redirect()}"
                  class="w-fit font-medium sm:text-[1.2rem] text-[1rem] sm:mt-8 mt-4 px-4 lg:px-0 sm:text-start text-center text-brandViolet hover:underline">Don't have an account? Create one</a>
                }@else {
                  <a [routerLink]="['/register']"
                  class="font-medium text-[1.2rem] sm:mt-8 mt-4 px-4 lg:px-0 sm:text-start text-center text-brandViolet hover:underline">Don't have an account? Create one</a>
                }
            </form>   
            
            <div class="w-fit h-full lg:flex hidden flex-col mt-5">
              <div class="aspect-square bg-brandShade w-[6rem]  self-end"></div>
              <div class="aspect-square bg-brandShade w-[6rem]  mr-[6rem]"></div>
              <div class="aspect-square bg-brandShade w-[6rem]  self-end"></div>
              <div class="aspect-square bg-brandShade w-[6rem]"></div>
              <div class="aspect-square bg-brandShade w-[6rem]  self-end"></div>
              <div class="aspect-square bg-brandShade w-[6rem]"></div>
              <div class="aspect-square bg-brandShade w-[6rem]  self-end"></div>
              <div class="aspect-square bg-brandShade w-[6rem]"></div>
              </div>
        </div>

        <div></div>
      </div>
    </div>
    `,
  styles:`
  .triangleShape{
    clip-path: polygon(
      0% 100%,
      50% 0%,
      100% 100%);
  }
  .errorLabel{
    font-size:1.2rem;
    font-weight:500;
    color:#FD7E7E;
    width:fit-content;
  }
`
})
export class LoginComponent {
  firebaseAuth = inject(FirebaseService)
  router = inject(Router)
  formBuilder = inject(NonNullableFormBuilder);

  error = model<string>('')

  redirect  = input<string>();

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
    .subscribe((res) => {
      if(!this.redirect()){
        this.router.navigate(['/'])
      } 
      if(this.redirect()?.split('-')[0] == 'article') this.router.navigate([`/article/${this.redirect()?.split('-')[1]}`])
    });

  }

  getPass() {
    return this.form.controls['password'] as FormControl;
  }

}
