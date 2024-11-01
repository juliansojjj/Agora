import {
  AfterViewChecked,
  AfterViewInit,
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
import { TitleStrategyService } from '../../services/title-strategy.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf, MenuComponent, NgClass],
  template: `
    <header
      class="w-full  flex flex-col justify-between  items-center sticky top-0 left-0 z-10    bg-white"
      [ngClass]="reduced() ? 'h-[5rem]' : 'h-[11rem]'"
    >
      <nav class="w-full flex justify-center">
        @if (!visibility()) {
          <ul class=" w-full relative flex justify-center">
            <li class="place-self-center">
              <a routerLink="/">
                <img
                  src="agora-logo.svg"
                  [ngClass]="reduced() ? 'h-[3rem]' : 'h-[5.5rem]'"
                />
              </a>
            </li>
          </ul>
        }@else {
          <ul
          class=" w-full lg:w-3/5 relative grid grid-cols-[1fr_1fr_1fr]  my-auto" [ngClass]="reduced() ? 'h-[5rem]' : 'h-[8.5rem]'"
          
        >
            <li class="place-self-start flex h-full items-center">
              <span>busqueda</span>
              @if (articleRoute()) {
                <span>{{ routeTitle() == 'Agora' ? '' : routeTitle() }}</span>
              }
            </li>

          <li class="place-self-center">
            <a routerLink="/">
              <img
                src="agora-logo.svg"
                [ngClass]="reduced() ? 'h-[3rem]' : 'h-[5.5rem]'"
              />
            </a>
          </li>

            <li class=" place-content-end flex items-center">
              @if(!authState()){
                <a [routerLink]="['/subscription']" class="bg-brandRed text-white w-fit font-medium h-7 pt-1 px-3 rounded-lg hover:text-orange-900 active:scale-95 ">Subscribe for $0</a>
                <a [routerLink]="['/login']" class="bg-white text-gray-300 font-medium w-fit h-7 pt-[.05rem] px-3 rounded-lg border-2 border-gray-200 hover:bg-slate-50 active:scale-95 ml-3">Login</a>
              }
              @else if(!(subscriptionState$ | async)?.subscription) {
                <a [routerLink]="['/subscription']">Subscribe for $0</a>
              }
              @else {
              <button (click)="menuTrigger()">Account</button>
              }
              



              <!-- <ng-container *ngIf="authState(); else login">
                <ng-container *ngIf="subscriptionState$ | async as subscription">
                  <ng-container *ngIf="!subscription.subscription">
                    <a [routerLink]="['/subscription']">SUBSCRIBE FOR $0</a>
                  </ng-container>
                </ng-container>

                <button (click)="menuTrigger()">Account</button>
              </ng-container> -->
<!-- 
  si esta logueado 
    si hay data suscripcion
      si no esta suscrito   
              button
    button   
  else 
    botton
    botton
-->

            </li>
        </ul>
        }
        
      </nav>



        <hr>


        @if(visibility() && !reduced()){
          <ul class="flex justify-between items-center lg:w-3/5 w-full flex-grow relative ">
          @for (item of categories(); track $index) {
            <li>
              <a [routerLink]="['/category', item.url]">{{ item.name }}</a>
            </li>
          }
        </ul>
        }
        

      <!-- <ng-template #login>
        <a [routerLink]="['/subscription']">SUBSCRIBE FOR $0</a>
        <a [routerLink]="['/login']">Login</a>
      </ng-template> -->
    </header>
  `,
  styles: ``,
})
export class HeaderComponent implements AfterViewChecked {
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  asd = inject(TitleStrategyService);
  title = inject(Title);

  routeTitle = model<string>('');
  articleRoute = model<boolean>(false);

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

  ngAfterViewChecked(): void {
    this.routeTitle.set(this.title.getTitle());
  }

  constructor() {
    // this.routeTitle.set(this.title.getTitle())

    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.routeTitle.set('');
        this.articleRoute.set(false);
        if (
          event.url === '/login' ||
          event.url === '/register' ||
          event.url === '/subscription'
        ) {
          this.visibility.set(false);
        } else {
          this.visibility.set(true);
        }
        if (event.url.split('/')[1] === 'article') {
          this.articleRoute.set(true);
          this.reduced.set(true);
        } else {
          this.reduced.set(false);
        }
      });
  }

  menuTrigger() {
    this.menu.update((value) => !value);
  }
}
