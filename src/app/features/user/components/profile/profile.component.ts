import { Component, inject, model, OnInit } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { async, BehaviorSubject, combineLatest, debounceTime, from, map, Observable, of, Subject, switchMap, take } from 'rxjs';
import { FirestoreCollectionUser } from '../../../../shared/interfaces/firebase.interfaces';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
    selector: 'app-profile',
    imports: [ReactiveFormsModule, AsyncPipe, NgClass],
    template: `
  <div class="w-full min-h-[75vh] xl:grid xl:grid-cols-[9%_82%_9%]  flex flex-col max-xl:items-center md:pt-6 xl:px-0 sm:px-6 px-0">
    <div></div>

    <section class="flex flex-col">
      <h1 class="md:font-semibold font-medium text-center xsm:mt-14 mt-0 text-brandViolet
      lg:text-[5rem] 
      md:text-start
      sm:text-[3.5rem]
      xsm:text-[3rem]   
      text-[2.3rem]">
        Profile
      </h1>
      @if(firestoreUser$ | async; as firestoreUser){
        <form [formGroup]="usernameForm" (ngSubmit)="onUsernameSubmit()" class="md:mt-14 mt-8 md:grid md:grid-cols-[9rem_20rem_2rem_6rem] flex flex-col max-md:items-center max-md:place-content-center md:gap-y-2">

          <div class="flex h-fit md:items-center flex-col-reverse md:flex-row-reverse col-span-2">
            <input type="text" formControlName="username" id="username" [ngClass]="usernameForm.controls.username.touched ? 'border-brandShade text-black' : 'border-slate-300 text-slate-400 '"
            class="peer xsm:w-[20rem] w-[15rem] h-[2.5rem] border-[.2rem]  focus:text-black box-border px-2 focus:outline-none focus:border-brandViolet"/>
            
            <label [ngClass]="usernameForm.controls.username.touched ? 'text-brandShade' : 'text-slate-300'"
            class="sm:text-[1.5rem] text-[1.2rem] min-w-[9rem] h-fit font-medium  peer-focus:text-brandViolet" for="username">
              Username
            </label>
          </div>
          <div></div>

          <button type="submit" [disabled]="usernameForm.invalid || usernameForm.pending" 
          [ngClass]="usernameForm.controls.username.touched ? 'bg-black hover:bg-brandShade hover:text-black active:scale-95' : 'bg-slate-300 '"
          class="w-[6rem] h-[2.5rem] text-white hidden md:flex items-center justify-center font-medium text-[1.2rem]">
            @if(this.userFormState() === 'submitting'){...}@else{Update}
          </button>
          <div></div>

          <div class="md:w-[22rem] xsm:w-[20rem] w-[15rem] h-[3.5rem] flex flex-col col-span-2 hyphens-auto md:break-all" [ngClass]="{'invisible' : userFormState() == 'submitting'}">
            <span class="errorLabel">{{userFormError()}}</span>
            @if(this.userFormState() === 'successful'){
                <span class="text-green-400 font-medium">Username updated successfully!</span>
              }
            @if (
              usernameForm.controls.username.invalid &&
              (usernameForm.controls.username.touched || usernameForm.controls.username.dirty)
            ) {
                @if (usernameForm.controls.username.errors?.['repeatUsername']) {
                <span class="errorLabel">Please write a different username</span>
              }
                @if (usernameForm.controls.username.errors?.['usernameTaken']) {
                <span class="errorLabel">That username has been already taken</span>
              }
              
              @if (usernameForm.controls.username.errors?.['pattern']) {
                <span class="errorLabel">Please enter the username in a valid format</span>
              }
              @if (usernameForm.controls.username.errors?.['required'] || usernameForm.controls.username.errors?.['blankText']) {
                <span class="errorLabel">Username is a required field</span>
              }
              @if (usernameForm.controls.username.errors?.['minlength']) {
                <span class="errorLabel">The min amount of characters is 3</span>
              }
              @if (usernameForm.controls.username.errors?.['maxlength']) {
                <span class="errorLabel">The max amount of characters is 25</span>
              }
            }
          </div>
          
          <div class="w-[15rem] xsm:w-[20rem] md:w-fit h-fit max-md:mt-1 max-md:flex">
            <button type="submit" [disabled]="usernameForm.invalid || usernameForm.pending" 
            [ngClass]="usernameForm.controls.username.touched ? 'max-md:block hidden hover:bg-brandShade hover:text-black text-white active:scale-95' : 'hidden'"
            class="w-[6rem] h-[2.5rem] bg-black items-center justify-center font-medium text-[1.2rem]">
              @if(this.userFormState() === 'submitting'){...}@else{Update}
            </button>
            <button (click)="onUsernameCancel()" [ngClass]="usernameForm.controls.username.touched? 'block' : 'hidden'" type="button"
            class="w-[6rem] h-[2.5rem] max-md:ml-3 flex items-center justify-center bg-white text-brandShade hover:bg-brandRed hover:text-white active:scale-95 font-medium text-[1.2rem]">
              Cancel
            </button>
          </div>
          
        </form>

        <!-- ------------------------------------------------------ -->
         @if(firestoreUser.providerId == 'none'){

          <form [formGroup]="emailForm" (ngSubmit)="onEmailSubmit()" class="mt-3 md:grid md:grid-cols-[9rem_20rem_2rem_6rem] flex flex-col max-md:items-center max-md:place-content-center md:gap-y-2">

            <div class="flex h-fit md:items-center flex-col-reverse md:flex-row-reverse col-span-2">
              <input type="text" formControlName="email" id="emailForm" placeholder="********" 
              [ngClass]="emailForm.controls.email.touched ? 'border-brandShade text-black' : 'border-slate-300 text-slate-400 '"
              class="peer xsm:w-[20rem] w-[15rem] h-[2.5rem] border-[.2rem]  focus:text-black box-border px-2 focus:outline-none focus:border-brandViolet"/>
              
              <label [ngClass]="emailForm.controls.email.touched ? 'text-brandShade' : 'text-slate-300'"
              class="sm:text-[1.5rem] text-[1.2rem] min-w-[9rem] h-fit font-medium  peer-focus:text-brandViolet" for="emailForm">
                Email
              </label>
            </div>
            <div></div>

            <button type="submit" [disabled]="emailForm.invalid || emailForm.pending || !emailForm.controls.email.dirty" 
            [ngClass]="emailForm.controls.email.touched ? 'bg-black  hover:bg-brandShade hover:text-black active:scale-95' : 'bg-slate-300'"
            class="w-[6rem] h-[2.5rem] hidden md:flex items-center justify-center text-white  font-medium text-[1.2rem]">
              @if(this.emailFormState() === 'submitting'){...}@else{Update}
            </button>
            <div></div>

              <div class="md:w-[22rem] xsm:w-[20rem] w-[15rem] h-[3.5rem] flex flex-col col-span-2 hyphens-auto md:break-all">
                <span class="errorLabel">{{emailFormError()}}</span>
                @if(this.emailFormState() === 'successful'){
                  <span class="text-green-400 font-medium">Email updated successfully!</span>
                }

                @if (
                  emailForm.controls.email.invalid &&
                  (emailForm.controls.email.touched || emailForm.controls.email.dirty)
                ) {
                  @if (emailForm.controls.email.errors?.['required']) {
                    <span class="errorLabel">Email is a required field</span>
                  }
                  @if (emailForm.controls.email.errors?.['email']) {
                    <span class="errorLabel">Please introduce a valid email</span>
                  }
                }
              </div>
            
            
            <div class="w-[15rem] xsm:w-[20rem] md:w-fit h-fit max-md:mt-1 max-md:flex">
              <button type="submit" [disabled]="emailForm.invalid || emailForm.pending || !emailForm.controls.email.dirty" 
              [ngClass]="emailForm.controls.email.touched ? 'max-md:block hidden hover:bg-brandShade hover:text-black active:scale-95' : 'hidden'"
              class="w-[6rem] h-[2.5rem] bg-black items-center justify-center  text-white  font-medium text-[1.2rem]">
                @if(this.emailFormState() === 'submitting'){...}@else{Update}
              </button>
              <button (click)="onEmailCancel()" [ngClass]="emailForm.controls.email.touched ? 'block' : 'hidden'" type="button"
              class="w-[6rem] h-[2.5rem] max-md:ml-3 flex items-center justify-center bg-white text-brandShade hover:bg-brandRed hover:text-white active:scale-95 font-medium text-[1.2rem]">
                Cancel
              </button>
            </div>
            
          </form>
                
          <!-- ------------------------------------------------------ -->

          <form [formGroup]="passwordForm" (ngSubmit)="onPasswordSubmit()" class="mt-3 md:grid md:grid-cols-[9rem_20rem_2rem_6rem] flex flex-col max-md:items-center max-md:place-content-center md:gap-y-2">

            <div class="flex h-fit md:items-center flex-col-reverse md:flex-row-reverse col-span-2">
              <input type="password" formControlName="password" id="passwordForm" placeholder="********" [ngClass]="passwordForm.controls.password.touched ? 'border-brandShade text-black' : 'border-slate-300 text-slate-400 '"
              class="peer xsm:w-[20rem] w-[15rem] h-[2.5rem] border-[.2rem]  focus:text-black box-border px-2 focus:outline-none focus:border-brandViolet"/>
              
              <label [ngClass]="passwordForm.controls.password.touched ? 'text-brandShade' : 'text-slate-300'"
              class="sm:text-[1.5rem] text-[1.2rem] min-w-[9rem] h-fit font-medium  peer-focus:text-brandViolet" for="passwordForm">
                Password
              </label>
            </div>
            <div></div>

            <button type="submit" [disabled]="passwordForm.invalid || passwordForm.pending" 
            [ngClass]="passwordForm.controls.password.touched ? 'bg-black hover:bg-brandShade hover:text-black active:scale-95' : 'bg-slate-300'"
            class="w-[6rem] h-[2.5rem] hidden md:flex items-center justify-center  text-white  font-medium text-[1.2rem]">
              @if(this.passwordFormState() === 'submitting'){...}@else{Update}
            </button>
            <div></div>

              <div class="md:w-[22rem] xsm:w-[20rem] w-[15rem] h-[3.5rem] flex flex-col col-span-2 hyphens-auto md:break-all">
              <span class="errorLabel">{{passwordFormError()}}</span>
              @if(this.passwordFormState() === 'successful'){
              <span class="text-green-400 font-medium">Password updated successfully!</span>
              }
              @if (
                    passwordForm.controls.password.invalid &&
                    (passwordForm.controls.password.touched || passwordForm.controls.password.dirty)
                    ) {
                      @if (passwordForm.controls.password.errors?.['required']) {
                        <span class="errorLabel">Password is a required field</span>
                      }
                      @if (passwordForm.controls.password.errors?.['minlength']) {
                        <span class="errorLabel">The min amount of characters is 6</span>
                      }
                      @if (passwordForm.controls.password.errors?.['maxlength']) {
                        <span class="errorLabel">The max amount of characters is 4096</span>
                      }
                    }
              </div>
            
            
            <div class="w-[15rem] xsm:w-[20rem] md:w-fit h-fit max-md:mt-1 max-md:flex">
              <button type="submit" [disabled]="passwordForm.invalid || passwordForm.pending" 
              [ngClass]="passwordForm.controls.password.touched ? 'max-md:block hidden hover:bg-brandShade hover:text-black text-white active:scale-95' : 'hidden'"
              class="w-[6rem] h-[2.5rem] bg-black items-center justify-center font-medium text-[1.2rem]">
                @if(this.passwordFormState() === 'submitting'){...}@else{Update}
              </button>
              <button (click)="onPasswordCancel()" [ngClass]="passwordForm.controls.password.touched ? 'block' : 'hidden'" type="button"
              class="w-[6rem] h-[2.5rem] max-md:ml-3 flex items-center justify-center bg-white text-brandShade hover:bg-brandRed hover:text-white active:scale-95 font-medium text-[1.2rem]">
                Cancel
              </button>
            </div>
            
          </form>
        }
      } 
    </section>

    <div></div>
  </div>
  `,
    styles: `
  .errorLabel{
    font-size:1.2rem;
    line-height:normal;
    font-weight:500;
    color:#FD7E7E;
    width:fit-content;
    @media (max-width:768px){
      font-size:1rem;
      line-height:95%;
      margin-top:.15rem;
    }
  }`
})
export class ProfileComponent {
  firebaseService = inject(FirebaseService);

  formBuilder = inject(NonNullableFormBuilder);

  authState$ = this.firebaseService.authState$;

  initialUsername$: BehaviorSubject<string> = new BehaviorSubject<string>('initalValue');
  initialEmail = model<string>()

  firestoreUser$: Observable<FirestoreCollectionUser> =
    this.authState$.pipe(
      switchMap((auth: any) => {
        this.emailForm.controls.email.setValue(auth.email)
        this.initialEmail.set(auth.email)

        return this.firebaseService.getUserInfo(auth.uid);
      }),
      map((res:FirestoreCollectionUser)=>{
        this.initialUsername$.next(res.username)
        this.usernameForm.controls.username.setValue(res.username)

        this.initialEmail.set(res.email)
        this.emailForm.controls.email.setValue(res.email)

        return res
      })
    );



  userFormState = model<'submitting'|'successful'|''>('')
  userFormError = model<string>('')

  usernameForm = this.formBuilder.group({
    username: this.formBuilder.control('', {
      validators: [
        Validators.required,
        Validators.pattern("^(?!.*([._'¨]{3}))[a-zA-Z0-9@._'¨]*(?:[._'¨]{0,2}[a-zA-Z0-9]*)*$"),
        Validators.maxLength(32),
        Validators.minLength(3),
        this.trimValidator
      ],
      asyncValidators: [this.usernameValidator()],
    })
  });

  onUsernameCancel(){
    this.usernameForm.reset()
    this.userFormError.set('')
    this.usernameForm.controls.username.setValue(this.initialUsername$.value)
  }
  onUsernameSubmit() {
    this.userFormState.set('submitting')
    this.firebaseService.updateUsername(this.usernameForm.getRawValue().username).subscribe({
      next: () => {
        this.userFormState.set('successful')
        setTimeout(()=>this.userFormState.set(''),3000)
        this.userFormError.set('')
        this.usernameForm.reset()
        this.usernameForm.controls.username.setValue(this.initialUsername$.value)
      },
      error: (err) => {
        this.userFormState.set('')
        this.userFormError.set(err.message)
      }
    })
  }


  emailFormState = model<'submitting'|'successful'|''>('')
  emailFormError = model<string>()

  emailForm = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.email, Validators.required],
    })
  });

  onEmailCancel(){
    this.emailForm.reset()
    this.emailFormError.set('')
    this.emailForm.controls.email.setValue(this.initialEmail()!)
  }
  onEmailSubmit() {
    this.emailFormState.set('submitting')
    this.firebaseService.updateUserEmail(this.emailForm.getRawValue().email).subscribe({
      next: (res) => {
        this.emailFormState.set('successful')
        setTimeout(()=>this.emailFormState.set(''),3000)
        this.emailFormError.set('')
        this.emailForm.reset()
        this.emailForm.controls.email.setValue(this.initialEmail()!)
      },
      error: (err) => {
        this.emailFormState.set('')
        this.emailFormError.set(err.message)
      }
    })
  }

  passwordFormState = model<'submitting'|'successful'|''>('')
  passwordFormError = model<string>()

  passwordForm = this.formBuilder.group({
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6), Validators.maxLength(4096)],
    })
  });

  onPasswordCancel(){
    this.passwordForm.reset()
    this.passwordFormError.set('')
  }
  onPasswordSubmit() {
    this.passwordFormState.set('submitting')
    this.firebaseService.updateUserPassword(this.passwordForm.getRawValue().password).subscribe({
      next: (res) => {
        this.passwordFormState.set('successful')
        setTimeout(()=>this.passwordFormState.set(''),3000)
        this.passwordFormError.set('')
        this.passwordForm.reset()
      },
      error: (err) => {
        this.passwordFormState.set('')
        this.passwordFormError.set(err.message)
        if(err.message === 'Firebase: Error (auth/requires-recent-login).') this.passwordFormError.set('Your current session is to old, please login again')
        else this.passwordFormError.set(err.message)
      }
    })
  }
  

  trimValidator(control:AbstractControl){
    return control.value.trim().length >= 3 ? null : {blankText:true}
  }
  usernameValidator() {
    return (control: AbstractControl) => {
      return combineLatest([
        this.initialUsername$,
        this.firebaseService.getUsers(),
      ]).pipe(
        take(2),
        map(([initialUsername, users]) => {
          if (control.value.toLowerCase() === initialUsername.toLowerCase()) {
            return { repeatUsername: true };
          }
          else return users.filter(
            (item: FirestoreCollectionUser) =>
              item.username.toLowerCase() == control.value.toLowerCase(),
          ).length
            ? { usernameTaken: true }
            : null
        }),
      );
    };
  }
}
