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
    @if (visibility()) {
      <header class="w-full h-20 flex-col justify-between flex p-2 bg-slate-200 sticky top-0 left-0 z-50"
      >
        <nav  >
          <ul class="grid grid-cols-[1fr_1fr_1fr] w-full relative">
            <li class="place-self-start">dsa</li>
            <li class="place-self-center">
              <a routerLink="/">
              <object data="agora-logo.svg" type="image/svg+xml"  class="h-14">
              <!-- <img src="yourfallback.jpg" /> -->
            </object>
              </a>
            </li>
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
          </ul>
        </nav>
        <ul class="flex justify-evenly w-full h-4 relative bg-slate-300">
          <li><a [routerLink]="['/category', 'politics']">Politics</a></li>
          <li><a [routerLink]="['/category', 'economy']">Economy</a></li>
          <li><a [routerLink]="['/category', 'sports']">Sports</a></li>
          <li><a [routerLink]="['/category', 'tech']">Tech</a></li>
          <li>
            <a [routerLink]="['/category', 'entertainment']">Entertainment</a>
          </li>
        </ul>

        <ng-template #login>
          <a [routerLink]="['/subscription']">SUBSCRIBE FOR $0</a>
          <a [routerLink]="['/login']">Login</a>
        </ng-template>
      </header>
    } @else {
      <header class="h-[7rem] w-full  flex-col justify-between flex">
        <nav class="flex justify-center w-full bg-red-500 place">
          <a routerLink="/">
            <object data="agora-logo.svg" type="image/svg+xml"  class="h-14">
              <!-- <img src="yourfallback.jpg" /> -->
            </object>
          </a>
        </nav>
      </header>
    }
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
        return this.firebaseService.checkSubscription(auth.uid);
      }),
    );

  menu = model<boolean>();
  visibility = model<boolean>(true);

  constructor() {
    this.authState$.subscribe((res: any) => console.log(res));

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
      });
  }

  menuTrigger() {
    this.menu.update((value) => !value);
  }
}
