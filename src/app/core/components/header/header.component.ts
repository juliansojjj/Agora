import { Component, effect, inject, input, model, OnInit, output } from '@angular/core';
import { AsyncPipe, DOCUMENT, isPlatformBrowser, Location, NgClass, NgIf } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { authState } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf, MenuComponent, NgClass],
  template: `
    <header class="h-[7rem] w-full  flex-col justify-between " [ngClass]="pepe ? 'flex' : 'hidden' ">
      <nav>
        <ul class="grid grid-cols-[1fr_1fr_1fr] w-full bg-red-500 place">
          <li class="place-self-start">Busqueda</li>
          <li class="place-self-center"><a routerLink="/">Logo</a></li>
          <li class="place-self-end flex">
            <ng-container *ngIf="user(); else login">
              <button (click)="menuTrigger()">Account</button>
            </ng-container>
          </li>
        </ul>
      </nav>
      <ul class="flex justify-evenly w-full bg-green-500">
        <li><a [routerLink]="['/category', 'politics']">Politics</a></li>
        <li><a [routerLink]="['/category', 'economy']">Economy</a></li>
        <li><a [routerLink]="['/category', 'sports']">Sports</a></li>
        <li><a [routerLink]="['/category', 'tech']">Tech</a></li>
        <li>
          <a [routerLink]="['/category', 'entertainment']">Entertainment</a>
        </li>
      </ul>

      <ng-template #login>
        <a [routerLink]="['/login']">Login</a>
      </ng-template>
    </header>
  `,
  styles: ``,
})
export class HeaderComponent {
  firebaseAuth = inject(FirebaseAuthService)
  router = inject(Router)

  authState$ = inject(FirebaseAuthService).authState$
  user= toSignal(this.authState$)

  menu = model<boolean>();
  visibility = model<boolean>(true)
  pepe = false

  document = inject(DOCUMENT)
  location = inject(Location)

  constructor(){
    console.log(this.location)
    effect(()=>{
      if(this.document.location.pathname === "/login" || this.document.location.pathname === "/register"){

        console.log('anda')
        this.pepe = false

        // this.visibility.set(false)
      }
      else{
        console.log('anda?')
        this.pepe = true
        // this.visibility.set(true)
      }
    })

    
  }

  menuTrigger() {
    this.menu.update((value) => !value);
  }


}
