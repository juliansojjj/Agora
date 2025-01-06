import { Component, inject, model, OnInit } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { async, BehaviorSubject, combineLatest, debounceTime, from, map, Observable, of, Subject, switchMap, take } from 'rxjs';
import { FirestoreCollectionUser } from '../../../../shared/interfaces/firebase.interfaces';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, AsyncPipe, NgClass],
  template:`
  <div class="w-full min-h-[75vh] xl:grid xl:grid-cols-[9%_82%_9%]  flex flex-col max-xl:items-center md:pt-6 xl:px-0 sm:px-6 px-0">
    <div></div>

    <section class="flex flex-col">
      <h1 class="font-bold text-center mt-14 text-brandViolet
      lg:text-[5rem] 
      md:text-start
      sm:text-[3.5rem]
      xsm:text-[3rem]   
      text-[2.3rem]">
        Profile
      </h1>
      @if(firestoreUser$ | async){
        <form [formGroup]="usernameForm" (ngSubmit)="onUsernameSubmit()" class="flex flex-col w-fit">
          <div class="flex items-center flex-row-reverse sm:mt-8 mt-3">
            <button type="submit" [disabled]="usernameForm.invalid" [ngClass]="usernameForm.controls.username.dirty ? 'bg-brandViolet' : 'bg-slate-300'"
            class=" py-1 px-3 ml-4 font-medium sm:text-[1.2rem] text-[1rem] text-white w-fit active:scale-95">Change</button>
          
            <input type="text" formControlName="username" id="username" 
            class="peer sm:w-[20rem] w-[12rem] h-[2rem] border-[.2rem] border-slate-300 text-slate-400 focus:text-black box-content px-2 focus:outline-none focus:border-brandViolet"/>
            
            <label class="sm:text-[1.5rem] text-[1rem] mr-4 font-medium text-slate-300 peer-focus:text-brandViolet" for="username">
              Username
            </label>
           </div>

          <div class="h-fit mt-2 w-fit flex flex-col">
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
          
          <div class="h-[2rem] mt-4 w-fit self-start pl-6 sm:pl-0">
            <span class="errorLabel">{{error()}}</span>
          </div>
        </form>
      } 
    </section>

    <div></div>
  </div>
  `,
  styles:`
  .errorLabel{
    font-size:1.2rem;
    font-weight:500;
    color:#FD7E7E;
    width:fit-content;
  }`
})
export class ProfileComponent {
  firebaseService = inject(FirebaseService);

  formBuilder = inject(NonNullableFormBuilder);

  authState$ = this.firebaseService.authState$;

  initialUsername$: BehaviorSubject<string> = new BehaviorSubject<string>('initalValue');

  firestoreUser$: Observable<FirestoreCollectionUser> =
    this.authState$.pipe(
      switchMap((auth: any) => {
        return this.firebaseService.getUserInfo(auth.uid);
      }),
      map((res:FirestoreCollectionUser)=>{
        this.usernameForm.controls.username.setValue(res.username)
        this.initialUsername$.next(res.username)
        return res
      })
    );


  error = model<string>('')

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

  emailForm = this.formBuilder.group({
    email: this.formBuilder.control('', {
      validators: [Validators.email, Validators.required],
    })
  });

  passwordForm = this.formBuilder.group({
    password: this.formBuilder.control('', {
      validators: [Validators.required, Validators.minLength(6)],
    })
  });

  onUsernameSubmit() {
    console.log(this.usernameForm.getRawValue())

    // const formValues = this.form.getRawValue();
    // this.firebaseService
    //   .signup(formValues.username, formValues.email, formValues.password)
    //   .pipe(
    //     catchError((err:Error) => {
    //       switch (err.message) {
    //         case ('Firebase: Error (auth/email-already-in-use).'):
    //           this.error.set('That email is already in use')
    //           break;

    //         case ('Firebase: Error (auth/invalid-email).'):
    //           this.error.set('Please enter a valid email')
    //           break;
            
    //           case ('Firebase: Error (auth/internal-error).'):
    //           this.error.set('There was an error in your request, please try again later')
    //           break;
    //       }
    //       throw new Error(err.message);
    //     }),
    //   )
    //   .subscribe((res) => {
    //     if(!this.redirect()){
    //       this.router.navigate(['/'])
    //     } 
    //     if(this.redirect()?.split('-')[0] == 'article') this.router.navigate([`/article/${this.redirect()?.split('-')[1]}`])
    //   });
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
