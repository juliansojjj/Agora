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
import { debounceTime, filter, map, Observable, switchMap } from 'rxjs';
import { FirestoreCollectionUser } from '../../../shared/interfaces/firebase.interfaces';
import { Category } from '../../../shared/interfaces/category.interface';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf, MenuComponent, NgClass],
  template: `
    <header
      class="w-full  flex-col justify-between flex p-2 sticky top-0 left-0 z-10 bg-red-100" [ngClass]="reduced() ? 'h-[4.5rem]' : 'h-[12rem]' "
    >
      <nav>
        <ul class=" w-full relative" [ngClass]="visibility() ? 'grid grid-cols-[1fr_1fr_1fr]' : 'flex justify-center' ">

          <ng-container *ngIf="visibility()">
            <li class="place-self-start">dsa</li>
          </ng-container>

          <li class="place-self-center">
            <a routerLink="/">
              <img src="agora-logo.svg" class="h-[4.5rem] mt-4" />
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

      <hr>

      <ng-container *ngIf="visibility() && !reduced()">
      <ul class="flex justify-evenly w-full h-4 relative bg-slate-300">
        @for (item of categories(); track $index) {
          <li><a [routerLink]="['/category', item.url]">{{item.name}}</a></li>
        }
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

  categories = toSignal<Category[]>(
    this.firebaseService.getCategories().pipe(
      map((res) => {
        return res;
      }),
    ),
  );

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
