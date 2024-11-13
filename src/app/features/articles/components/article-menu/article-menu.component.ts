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
      <div class="fixed right-0 top-0 w-full z-50 flex justify-end">
        
        <div class="w-[16rem] h-screen  bg-white flex flex-col items-center pt-[1.25rem] text-[1.1rem]">

          <div class="flex w-full justify-end ">
            
            <button (click)="menuTrigger()" class="active:scale-95">
              <svg viewBox="0 0 512 512" class="h-9 pr-[1rem]">
                <polygon  points="328.96 30.2933333 298.666667 1.42108547e-14 164.48 134.4 30.2933333 1.42108547e-14 1.42108547e-14 30.2933333 134.4 164.48 1.42108547e-14 298.666667 30.2933333 328.96 164.48 194.56 298.666667 328.96 328.96 298.666667 194.56 164.48" />
              </svg>
            </button>
          </div>


          <span class="mt-8 mb-10  font-medium">{{(subscriptionState$ | async)?.username}}</span>

          @if (!(subscriptionState$ | async)?.subscription) {
                <a
                  [routerLink]="['/subscription']"
                  class=" w-full h-fit font-medium flex justify-center items-center py-4 bg-brandRed hover:text-brandRed hover:bg-white  active:scale-95 mb-10" (click)="menuTrigger()"
                  >Subscribe for $0</a
                >
          }

          <a class="w-full text-start h-16  pl-6 font-medium hover:underline" [routerLink]="['/favorites']" (click)="menuTrigger()"> 
            Favorites
          </a>
          <a class="w-full text-start h-16  pl-6 font-medium hover:underline " [routerLink]="['/profile' ]" (click)="menuTrigger()"> 
            Account Settings
          </a>
          
          <div class="flex items-end grow w-full">
          <button (click)="onLogout()" class="w-full h-fit font-medium flex justify-center py-4 items-center text-white bg-black hover:text-black hover:bg-white  active:scale-95">Cerrar sesión</button>
          </div>
          
          
        </div>
        

        <div class="-z-10 bg-black bg-opacity-35 w-screen h-screen absolute" (click)="menuTrigger()"></div>
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
