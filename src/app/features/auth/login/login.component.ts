import { NgClass } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';
import { FormControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../../core/services/firebase.service';
import { PassInputComponent } from '../../../shared/components/pass-input/pass-input.component';

@Component({
    selector: 'app-login',
    imports: [ReactiveFormsModule, RouterLink, PassInputComponent],
    template: `
    <div class="relative w-full h-fit">
      <div class="w-full lg:grid lg:grid-cols-[9%_82%_9%] flex flex-col lg:items-start items-center pt-6">

        <a routerLink="/" class="h-fit w-fit justify-self-center sm:my-4">
            <img src="agora-shade-isotype.svg" class="sm:h-[5rem] xsm:h-[4rem] h-[3.2rem]" />
          </a>

        <div class="w-full flex justify-center lg:justify-between lg:pl-6 mt-1 lg:mt-10">
          <div class="w-fit flex flex-col max-lg:items-center">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col items-center lg:items-start w-fit">
                <h1 class="font-semibold lg:font-bold lg:text-[5rem] md:text-[3.5rem] sm:text-[3rem] text-[2.5rem] text-brandViolet lg:mt-10  md:text-start text-center">Login</h1>
                
                
                <div class="flex flex-col-reverse mt-3 sm:mt-6">
                  <input type="email" formControlName="email" id="email" 
                  class="peer sm:w-[20rem] xsm:w-[17rem] xxsm:w-[15rem] w-[12rem] sm:h-[2.15rem] h-[1.8rem] sm:border-[.4rem] border-[.35rem] border-brandShade box-content px-2 focus:outline-none focus:border-brandViolet xsm:text-[1.1rem] text-[1rem]"/>
                  <label class="sm:text-[1.7rem] text-[1.3rem] font-medium  mb-2 text-brandShade peer-focus:text-brandViolet" for="email">
                    Email
                  </label>
                </div>
                <div class="flex flex-col h-[2rem] mt-1 mb-1 sm:w-full xsm:w-[18.5rem] xxsm:w-[16.5rem] w-[13.5rem] sm:pl-2 lg:pl-0">
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
              

                <pass-input [control]="getPass()" [inputErrors]="form.controls.password.errors" [dirtyInput]="form.controls.password.dirty"/>
                <div class="flex flex-col h-[2rem] mt-1 mb-2 sm:w-full xsm:w-[18.5rem] xxsm:w-[16.5rem] w-[13.5rem] sm:pl-2 lg:pl-0">
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
                    @if (form.controls.password.errors?.['maxlength']) {
                      <span class="errorLabel">The max amount of characters is 4096</span>
                    }
                  }
                </div>

                <button type="submit" [disabled]="form.invalid || form.pending" 
                class="bg-brandViolet flex items-center justify-center h-[2.2rem] sm:h-[2.8rem] w-[6rem] xsm:w-[8rem] sm:text-[1.2rem] text-[1rem] font-medium mt-1 text-white hover:bg-brandShade hover:text-black active:scale-95">
                  @if(isFormSubmitting()){. . .}@else{Login}
                </button>
                  

                <div class="flex flex-col sm:items-center lg:items-start h-[1.5rem] mt-2 mb-1 sm:w-full xsm:w-[18.5rem] xxsm:w-[16.5rem] w-[13.5rem]">
                  <span class="errorLabel">{{formError()}}</span>
                </div>

                @if(redirect()){
                  <a [routerLink]="['/register']" [queryParams]="{redirect:redirect()}"
                  class="w-fit font-medium sm:text-[1.2rem] text-[1rem] mt-1 px-4 lg:px-0 sm:text-start text-center text-brandViolet hover:underline">
                    Don't have an account? Create one
                  </a>
                }@else {
                  <a [routerLink]="['/register']"
                  class="font-medium sm:text-[1.2rem] text-[1rem] mt-1 px-4 lg:px-0 sm:text-start text-center text-brandViolet hover:underline">
                    Don't have an account? Create one
                  </a>
                }
            </form>   
          </div>
            
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
    styles: `
  .errorLabel{
    font-size:1.2rem;
    font-weight:500;
    color:#FD7E7E;
    width:fit-content;
    @media (max-width:768px){
      font-size:1rem;
      line-height:105%;
      margin-top:.15rem;
    }
  }
`
})
export class LoginComponent {
  firebaseService = inject(FirebaseService)
  router = inject(Router)
  formBuilder = inject(NonNullableFormBuilder);

  formError = model<string>('')
  isFormSubmitting = model<boolean>(false)

  redirect  = input<string>();

  form = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.email, Validators.required],
    }),
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(4096)],
    }),
  });

  onSubmit() {
    this.formError.set('')
    this.isFormSubmitting.set(true)
    const formValues = this.form.getRawValue()
    this.firebaseService.login(formValues.email,formValues.password).subscribe({
      next: () => {
      this.isFormSubmitting.set(false)
        if(!this.redirect()){
          this.router.navigate(['/'])
        } 
        if(this.redirect()?.split('-')[0] == 'article') this.router.navigate([`/article/${this.redirect()?.split('-')[1]}`])
      },
      error: (err) => {
        this.isFormSubmitting.set(false)
        switch (err.message) {
          case ('Firebase: Error (auth/internal-error).'):
            this.formError.set('There was an error in your request, please try again later')
            break;

          case ('Firebase: Error (auth/user-not-found).'):
            this.formError.set('User not found')
            break;
          
          case ('Firebase: Error (auth/wrong-password).'):
            this.formError.set('Wrong password')
            break;

          default:this.formError.set(err.message)
        }
        throw new Error(err.message);
      }
    })
  }

  getPass() {
    return this.form.controls['password'] as FormControl;
  }

}
