import { Component, inject, input, model, OnInit, output, Signal } from '@angular/core';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FirestoreCollectionUser } from '../../../../shared/interfaces/firebase.interfaces'; 
import { Observable, switchMap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-menu',
  standalone: true,
  imports: [AsyncPipe, RouterLink],
  template: `
    @if (menu() ) {
      <div class="fixed left-0 top-0 w-screen h-screen overflow-hidden z-[100] flex justify-end ">
        
        <div class="lg:w-[16rem] md:w-3/4 w-screen h-screen  bg-white flex flex-col items-center pt-[1.25rem] text-[1.1rem]">
            

          <div class="flex w-full justify-end ">
            <button (click)="menuTrigger()" class="active:scale-95">
              <svg viewBox="0 0 512 512" class="h-9 pr-[1rem]">
                <polygon  points="328.96 30.2933333 298.666667 1.42108547e-14 164.48 134.4 30.2933333 1.42108547e-14 1.42108547e-14 30.2933333 134.4 164.48 1.42108547e-14 298.666667 30.2933333 328.96 164.48 194.56 298.666667 328.96 328.96 298.666667 194.56 164.48" />
              </svg>
            </button>
          </div>

          <span class="mt-8 md:mb-10 mb-2  font-medium">{{(subscriptionState$ | async)?.username}}</span>

          @if(authState()){
            <ul class="h-fit w-full md:hidden flex flex-col">
              <a
              [routerLink]="['/favorites']" (click)="menuTrigger()"
                class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-full h-fit py-4"
              ><li>Favorites</li></a>
              <a
              [routerLink]="['/profile' ]" (click)="menuTrigger()"
                class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-full h-fit py-4"
              ><li>Account Settings</li></a>
            </ul>

            <a class="w-full md:block hidden text-start h-16  pl-6 font-medium hover:underline" [routerLink]="['/favorites']" (click)="menuTrigger()"> 
              Favorites
            </a>
            <a class="w-full md:block hidden text-start h-16  pl-6 font-medium hover:underline " [routerLink]="['/profile' ]" (click)="menuTrigger()"> 
              Account Settings
            </a>
          }

          <span class="font-medium my-2 block sm:hidden">Search</span>


          <span class="font-medium my-2 block md:hidden">Categories</span>
          <ul class="h-fit w-full md:hidden flex flex-col">
            
            <a
              [routerLink]="['/category/tech' ]" (click)="menuTrigger()"
              class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-full h-fit py-4"
            ><li>Tech</li></a>
            <a
              [routerLink]="['/category/culture']" (click)="menuTrigger()"
              class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-full h-fit py-4"
            ><li>Culture</li></a>
            <a
              [routerLink]="['/category/science' ]" (click)="menuTrigger()"
              class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-full h-fit py-4"
            ><li>Science</li></a>
            <a
              [routerLink]="['/category/entertainment']" (click)="menuTrigger()"
              class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-full h-fit py-4"
            ><li>Entertainment</li></a>
            <a
              [routerLink]="['/category/media']" (click)="menuTrigger()"
              class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-full h-fit py-4"
            ><li>Media</li></a>
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
  styles: ``,
})
export class ArticleMenuComponent{
  firebaseService = inject(FirebaseService);
  menu = model<boolean>();
  firebaseAuth = inject(FirebaseService)

  user= toSignal(this.firebaseAuth.user$)
  authState$ = this.firebaseService.authState$;

  authState = toSignal(this.authState$);
  subscriptionState$: Observable<FirestoreCollectionUser> =
    this.authState$.pipe(
      switchMap((auth: any) => {
        return this.firebaseService.getUserInfo(auth.uid);
      }),
    );
  

  onLogout (){
    this.firebaseAuth.logout()
    this.menuTrigger()
  }

  menuTrigger() {
    this.menu.update((value) => !value);
  }
}
