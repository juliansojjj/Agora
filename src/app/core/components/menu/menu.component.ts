import { Component, inject, input, model, OnInit, output, Renderer2, Signal } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FirebaseAuthUser, FirestoreCollectionUser } from '../../../shared/interfaces/firebase.interfaces';
import { Observable, switchMap } from 'rxjs';
import { AsyncPipe, DOCUMENT, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
    selector: 'app-menu',
    imports: [AsyncPipe, RouterLink, ReactiveFormsModule, NgClass],
    template: `
    @if (menu() ) {
      <div class="fixed left-0 top-0 w-screen h-screen overflow-x-hidden z-[100] flex justify-end overflow-y-scroll">
        
        <div class="lg:w-[16rem] md:w-3/4 w-screen min-h-screen bg-white flex flex-col items-center pt-[1.25rem] text-[1.1rem]">
            

          <div class="flex w-full justify-end ">
            <button (click)="menuTrigger()" class="active:scale-95">
              <svg viewBox="0 0 335 335" class="h-6 pr-7">
                <polygon  points="328.96 30.2933333 298.666667 1.42108547e-14 164.48 134.4 30.2933333 1.42108547e-14 1.42108547e-14 30.2933333 134.4 164.48 1.42108547e-14 298.666667 30.2933333 328.96 164.48 194.56 298.666667 328.96 328.96 298.666667 194.56 164.48" />
              </svg>
            </button>
          </div>

          <div class="w-full text-center min-h-[2.4rem] mt-8 md:mb-10 mb-2">
            <span class="text-[1.5rem] font-semibold">{{(subscriptionState$ | async)?.username}}</span>
          </div>

          @if(authState()){
            <ul class="h-fit w-full md:hidden flex flex-col">
              <a
              [routerLink]="['/favorites']" (click)="menuTrigger()"
                class="hover:bg-black text-center font-medium flex justify-center items-center hover:text-white w-full h-fit py-4"
              ><li>Favorites</li></a>
              <a
              [routerLink]="['/profile' ]" (click)="menuTrigger()"
                class="hover:bg-black text-center font-medium flex justify-center items-center hover:text-white w-full h-fit py-4"
              ><li>Account Settings</li></a>
            </ul>

            <a class="w-full md:block hidden text-start h-16 py-4 pl-6 font-medium hover:underline" [routerLink]="['/favorites']" (click)="menuTrigger()"> 
              Favorites
            </a>
            <a class="w-full md:block hidden text-start h-16 py-4 pl-6 font-medium hover:underline " [routerLink]="['/profile' ]" (click)="menuTrigger()"> 
              Account Settings
            </a>
          }

          <span class="bg-white font-semibold mt-6 mb-2 block w-full text-center text-[1.5rem] sm:hidden">Search</span>

          <form class="bg-white xsm:w-[68%] w-[80%] sm:hidden flex max-h-fit justify-center relative" [formGroup]="searchForm" (ngSubmit)="onSearchSubmit()">
            <button (click)="searchForm.reset()" [ngClass]="searchForm.controls.search.touched || searchForm.controls.search.dirty ? 'block' : 'invisible'"
            class="active:scale-95  border-black border-b-2 h-[1.8rem]" type="button">
              <svg viewBox="0 0 335 335" class="h-5">
                <polygon  points="328.96 30.2933333 298.666667 1.42108547e-14 164.48 134.4 30.2933333 1.42108547e-14 1.42108547e-14 30.2933333 134.4 164.48 1.42108547e-14 298.666667 30.2933333 328.96 164.48 194.56 298.666667 328.96 328.96 298.666667 194.56 164.48" />
              </svg>
            </button>

            <input type="text" placeholder="Search" formControlName="search"
            class="peer w-full h-[1.8rem] border-b-2 pl-1 border-black focus:outline-none">
            
            <button class="border-b-2 h-[1.8rem] border-black"  type="submit" [disabled]="searchForm.invalid || searchForm.pending">
              <svg class="h-full" viewBox="0 0 1200 1200">
                <path
                stroke="black"
                  d="m1098.1 965.59-267.19-267.26c35.961-59.324 57.039-128.85 57.039-203.32 0-217.24-175.8-393.15-393.04-393.23-217.09 0.078124-393.04 175.99-393.04 393.19 0 217.05 175.99 392.96 393.15 392.96 74.512 0 143.93-21.074 203.25-57.039l267.34 267.34zm-846.26-470.62c0.22266-134.32 108.86-242.96 243.15-243.19 134.25 0.30078 242.93 108.86 243.15 243.19-0.26172 134.21-108.9 242.93-243.15 243.11-134.32-0.1875-242.96-108.9-243.15-243.11z"
                />
              </svg>
            </button>
          </form>


          <span class="bg-white font-semibold mt-6 mb-2 block max-h-fit text-center text-[1.5rem] md:hidden">Categories</span>
          <ul class="h-fit w-full md:hidden flex flex-col">
            <a
              [routerLink]="['/category/tech' ]" (click)="menuTrigger()"
              class="bg-white hover:bg-black text-center font-medium flex justify-center items-center hover:text-white w-full h-fit py-4"
            ><li>Tech</li></a>
            <a
              [routerLink]="['/category/media']" (click)="menuTrigger()"
              class="bg-white hover:bg-black text-center font-medium flex justify-center items-center hover:text-white w-full h-fit py-4">
              <li>Media</li>
            </a>
            <a
              [routerLink]="['/category/culture']" (click)="menuTrigger()"
              class="bg-white hover:bg-black text-center font-medium flex justify-center items-center hover:text-white w-full h-fit py-4">
              <li>Culture</li>
            </a>
            <a
              [routerLink]="['/category/science' ]" (click)="menuTrigger()"
              class="bg-white hover:bg-black text-center font-medium flex justify-center items-center hover:text-white w-full h-fit py-4">
              <li>Science</li>
            </a>
            <a
              [routerLink]="['/category/entertainment']" (click)="menuTrigger()"
              class="bg-white hover:bg-black text-center font-medium flex justify-center items-center hover:text-white w-full h-fit py-4">
              <li>Entertainment</li>
            </a>
            
          </ul>

          @if(authState()){
            <div class="flex items-end grow w-full">
              <button (click)="onLogout()" class="w-full h-fit font-medium flex justify-center py-4 items-center bg-brandShade hover:bg-white hover:text-black  active:scale-95">Cerrar sesión</button>
            </div>
          } @else {
            <div class="flex items-end grow w-full">
              <a [routerLink]="['/login']"  (click)="menuTrigger()"
              class=" w-full h-fit py-4 font-medium flex justify-center items-center bg-brandShade hover:bg-white hover:text-black active:scale-95">
              Login
              </a>
            </div>
          }
          

        </div>
        

        <div class="-z-10 bg-black bg-opacity-35 w-full h-screen absolute" (click)="menuTrigger()"></div>
      </div>
    }
  `,
    styles: ``
})
export class MenuComponent{
  firebaseService = inject(FirebaseService);
  menu = model<boolean>();
  firebaseAuth = inject(FirebaseService)
  router = inject(Router)
  formBuilder = inject(NonNullableFormBuilder)

  renderer = inject(Renderer2);
  document = inject(DOCUMENT);

  user= toSignal(this.firebaseAuth.user$)
  authState$ = this.firebaseService.authState$;

  authState = toSignal(this.authState$);
  subscriptionState$: Observable<FirestoreCollectionUser> =
    this.authState$.pipe(
      switchMap((auth: any) => {
        return this.firebaseService.getUserInfo(auth.uid);
      }),
    );

  searchForm = this.formBuilder.group({
    search: this.formBuilder.control('', {
      validators: [Validators.required, this.trimValidator],
    })
  });
  onSearchSubmit(){
    this.router.navigate(['/search'], { queryParams: {search: this.searchForm.controls.search.getRawValue()} });
    this.searchForm.reset()
    this.menuTrigger()
  }

  trimValidator(control:AbstractControl){
    return control.value.trim().length >= 2 ? null : {blankText:true}
  }
  

  onLogout (){
    this.firebaseAuth.logout()
    this.menuTrigger()
  }

  menuTrigger() {
    if(this.menu()){
      this.renderer.removeStyle(this.document.body, 'overflow');
    } else{
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    }
    this.menu.update((value) => !value);
  }

}
