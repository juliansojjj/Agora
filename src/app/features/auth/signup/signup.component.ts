import { NgClass } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { FirebaseService } from '../../../core/services/firebase.service';
import { PassInputComponent } from '../../../shared/components/pass-input/pass-input.component';


@Component({
    selector: 'app-signup',
    imports: [ReactiveFormsModule, RouterLink, PassInputComponent, NgClass],
    template: `
  <div class="relative w-full h-fit">
      <div class="w-full lg:grid lg:grid-cols-[9%_82%_9%] flex flex-col lg:items-start items-center pt-6">

      <a routerLink="/" class="h-fit w-fit justify-self-center sm:my-4">
            <img src="agora-shade-isotype.svg" class="sm:h-[5rem] xsm:h-[4rem] h-[3.2rem]" />
          </a>

        <div class="w-full flex justify-center lg:justify-between lg:pl-6 mt-1 lg:mt-10">
          <div class="w-fit flex flex-col max-lg:items-center">
            <form [formGroup]="form" (ngSubmit)="onSubmit()" class="flex flex-col items-center lg:items-start  w-fit">
                <h1 class="font-semibold lg:font-bold lg:text-[5rem] md:text-[3.5rem] sm:text-[3rem] text-[2.5rem] text-brandViolet lg:mt-10  md:text-start text-center">Register</h1>
                
                <div class="flex flex-col-reverse mt-3 sm:mt-6">
                  <input type="text" formControlName="username" id="username" 
                  [ngClass]="form.controls.username.dirty && form.controls.username.errors ? 'border-brandRed' : 'border-brandShade'"
                  class="peer sm:w-[20rem] xsm:w-[17rem] xxsm:w-[15rem] w-[12rem] sm:h-[2.15rem] h-[1.8rem] sm:border-[.4rem] border-[.35rem]  box-content px-2 focus:outline-none focus:border-brandViolet xsm:text-[1.1rem] text-[1rem]"/>
                  
                  <label [ngClass]="form.controls.username.dirty && form.controls.username.errors ? 'text-brandRed' : 'text-brandShade'"
                  class="sm:text-[1.7rem] text-[1.3rem] font-medium mb-2 peer-focus:text-brandViolet" for="username">
                    Username
                  </label>
                </div>
                
                <div class="flex flex-col h-[2rem] mt-1 mb-1 sm:w-full xsm:w-[18.5rem] xxsm:w-[16.5rem] w-[13.5rem]">
                    @if (
                      form.controls.username.invalid &&
                      (form.controls.username.touched || form.controls.username.dirty)
                    ) {
                      @if (form.controls.username.errors?.['usernameTaken']) {
                        <span class="errorLabel">That username has been already taken</span>
                      }
                      @if (form.controls.username.errors?.['pattern']) {
                        <span class="errorLabel">Please enter the username in a valid format</span>
                      }
                      @if (form.controls.username.errors?.['required'] || form.controls.username.errors?.['blankText']) {
                        <span class="errorLabel">Username is a required field</span>
                      }
                      @if (form.controls.username.errors?.['minlength']) {
                        <span class="errorLabel">The min amount of characters is 3</span>
                      }
                      @if (form.controls.username.errors?.['maxlength']) {
                        <span class="errorLabel">The max amount of characters is 25</span>
                      }
                    }
                </div>


                <div class="flex flex-col-reverse ">
                  <input type="email" formControlName="email" id="email" 
                  [ngClass]="form.controls.email.dirty && form.controls.email.errors ? 'border-brandRed' : 'border-brandShade'"
                  class="peer sm:w-[20rem] xsm:w-[17rem] xxsm:w-[15rem] w-[12rem] sm:h-[2.15rem] h-[1.8rem] sm:border-[.4rem] border-[.35rem] border-brandShade box-content px-2 focus:outline-none focus:border-brandViolet xsm:text-[1.1rem] text-[1rem]"/>
                  
                  <label [ngClass]="form.controls.email.dirty && form.controls.email.errors ? 'text-brandRed' : 'text-brandShade'"
                  class="sm:text-[1.7rem] text-[1.3rem] font-medium  mb-2 text-brandShade peer-focus:text-brandViolet" for="email">
                    Email
                  </label>
                </div>
                <div class="flex flex-col h-[2rem] mt-1 mb-1 sm:w-full xsm:w-[18.5rem] xxsm:w-[16.5rem] w-[13.5rem]">
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
                <div class="flex flex-col h-[2rem] mt-1 mb-2 sm:w-full xsm:w-[18.5rem] xxsm:w-[16.5rem] w-[13.5rem]">
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
                class="bg-brandViolet flex items-center justify-center h-[2.2rem] sm:h-[2.8rem] sm:px-8 px-6 sm:text-[1.2rem] text-[1rem] font-medium mt-1 text-white w-fit hover:bg-brandShade hover:text-black active:scale-95">
                  @if(isFormSubmitting()){. . .}@else{Register}
                </button>
                
                <div class="flex flex-col sm:items-center lg:items-start h-[1.5rem] mt-2 mb-1 sm:w-full xsm:w-[18.5rem] xxsm:w-[16.5rem] w-[13.5rem]">
                  <span class="errorLabel">{{formError()}}</span>
                </div>

                @if(redirect()){
                  <a [routerLink]="['/login']" [queryParams]="{redirect:redirect()}"
                  class="w-fit font-medium sm:text-[1.2rem] text-[1rem] mt-1 px-4 lg:px-0 sm:text-start text-center text-brandViolet hover:underline">Already hace an account? Login</a>
                }@else {
                  <a [routerLink]="['/login']"
                  class="font-medium sm:text-[1.2rem] text-[1rem] mt-1 px-4 lg:px-0 sm:text-start text-center text-brandViolet hover:underline">Already hace an account? Login</a>
                }
            </form>   
            <div class="h-[2rem] w-full"></div>
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
    font-size:1rem;
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
export class SignupComponent {
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  formBuilder = inject(NonNullableFormBuilder);

  redirect  = input<string>();

  formError = model<string>('')
  isFormSubmitting = model<boolean>(false)

  form = this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.pattern("^(?!.*([._'¨]{3}))[a-zA-Z0-9@._'¨]*(?:[._'¨]{0,2}[a-zA-Z0-9]*)*$"),
        Validators.maxLength(32),
        Validators.minLength(3),
        this.trimValidator
      ],
      asyncValidators: [this.firebaseService.checkUsername()],
    }),
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
    this.firebaseService.signup(formValues.username, formValues.email, formValues.password).subscribe({
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
          case ('Firebase: Error (auth/email-already-in-use).'):
            this.formError.set('That email is already in use')
            break;

          case ('Firebase: Error (auth/invalid-email).'):
            this.formError.set('Please enter a valid email')
            break;
          
          case ('Firebase: Error (auth/internal-error).'):
            this.formError.set('There was an error in your request, please try again later')
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
  trimValidator(control:AbstractControl){
    return control.value.trim().length >= 3 ? null : {blankText:true}
  }

}