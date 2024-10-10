import {
  Component,
  effect,
  inject,
  input,
  model,
  OnInit,
  output,
} from '@angular/core';
import {
  AsyncPipe,
  DOCUMENT,
  isPlatformBrowser,
  Location,
  NgClass,
  NgIf,
} from '@angular/common';
import {
  ActivatedRoute,
  NavigationEnd,
  Router,
  RouterLink,
} from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { FirebaseService } from '../../services/firebase.service';
import { authState } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, filter, Observable, switchMap } from 'rxjs';
import { FirestoreCollectionUser } from '../../../shared/interfaces/firebase.interfaces';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf, MenuComponent, NgClass],
  template: `
    <header
      class="w-full  flex-col justify-between flex p-2 sticky top-0 left-0 z-10 bg-white" [ngClass]="reduced() ? 'h-[4.5rem]' : 'h-28' "
    >
      <nav>
        <ul class=" w-full relative" [ngClass]="visibility() ? 'grid grid-cols-[1fr_1fr_1fr]' : 'flex justify-center' ">

          <ng-container *ngIf="visibility()">
            <li class="place-self-start">dsa</li>
          </ng-container>

          <li class="place-self-center">
            <a routerLink="/">
              <img src="agora-logo.svg" class="h-12 mt-1" />
            </a>
          </li>

          <ng-container *ngIf="visibility()">
            <li class="place-self-end flex">
              <ng-container *ngIf="authState(); else login">
                <ng-container
                  *ngIf="subscriptionState$ | async as subscription"
                >
                  <ng-container *ngIf="!subscription.subscription">
                    <a [routerLink]="['/subscription']">SUBSCRIBE FOR $0</a>
                  </ng-container>
                </ng-container>
                <button (click)="menuTrigger()">Account</button>
              </ng-container>
            </li>
          </ng-container>
        </ul>
      </nav>

      <ng-container *ngIf="visibility() && !reduced()">
      <ul class="flex justify-evenly w-full h-4 relative bg-slate-300">
          <li><a [routerLink]="['/category', 'politics']">Politics</a></li>
          <li><a [routerLink]="['/category', 'economy']">Economy</a></li>
          <li><a [routerLink]="['/category', 'sports']">Sports</a></li>
          <li><a [routerLink]="['/category', 'tech']">Tech</a></li>
          <li>
            <a [routerLink]="['/category', 'entertainment']">Entertainment</a>
          </li>
        </ul>
      </ng-container>


      <ng-template #login>
        <a [routerLink]="['/subscription']">SUBSCRIBE FOR $0</a>
        <a [routerLink]="['/login']">Login</a>
      </ng-template>
    </header>
  `,
  styles: ``,
})
export class HeaderComponent {
  firebaseService = inject(FirebaseService);
  router = inject(Router);

  authState$ = this.firebaseService.authState$;
  authState = toSignal(this.authState$);
  subscriptionState$: Observable<FirestoreCollectionUser> =
    this.authState$.pipe(
      switchMap((auth: any) => {
        return this.firebaseService.getUserInfo(auth.uid);
      }),
    );

  menu = model<boolean>();
  visibility = model<boolean>(true);
  reduced = model<boolean>(false);

  constructor() {
    // this.authState$.subscribe((res: any) => console.log(res));

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (
          event.url === '/login' ||
          event.url === '/register' ||
          event.url === '/subscription'
        ) {
          this.visibility.set(false);
        } else {
          this.visibility.set(true);
        } 
        if(event.url.split('/')[1] === 'article'){
          this.reduced.set(true);
        }
        else{ 
          this.reduced.set(false);
        }
      });
  }

  menuTrigger() {
    this.menu.update((value) => !value);
  }
}
