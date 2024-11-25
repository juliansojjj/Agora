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
      class="sticky top-0 left-0 z-50 h-[7.5rem]   bg-white"
      [ngClass]="visibility() ? 'flex' : 'hidden'"
    >
      <nav class="w-full flex  justify-between">
        @if (reduced()) {
          <ul class=" w-full relative flex justify-center">
            <li class="place-self-center">
              <a routerLink="/">
                <img src="agora-logo.svg" class="h-[5.5rem]" />
              </a>
            </li>
          </ul>
        } @else {
          <a routerLink="/" class="h-fit self-center ml-12">
            <img src="agora-logo.svg" class="h-[4rem]" />
          </a>

          <div class=" w-fit h-full relative  grid grid-rows-2">
            <div class="flex justify-end pr-7">
              @if(search()){
                <input type="text" class="w-full h-full border-b-2 border-black focus:outline-none">
              }
              <button (click)="searchTrigger()" [ngClass]="search() ? 'border-b-2 border-black' : ''">
                <svg class="h-[1.8rem]" viewBox="0 0 1200 1200">
                  <path
                  stroke="black"
                    d="m1098.1 965.59-267.19-267.26c35.961-59.324 57.039-128.85 57.039-203.32 0-217.24-175.8-393.15-393.04-393.23-217.09 0.078124-393.04 175.99-393.04 393.19 0 217.05 175.99 392.96 393.15 392.96 74.512 0 143.93-21.074 203.25-57.039l267.34 267.34zm-846.26-470.62c0.22266-134.32 108.86-242.96 243.15-243.19 134.25 0.30078 242.93 108.86 243.15 243.19-0.26172 134.21-108.9 242.93-243.15 243.11-134.32-0.1875-242.96-108.9-243.15-243.11z"
                  />
                </svg>
              </button>
              @if (authState()) {
                <button (click)="menuTrigger()" class="ml-7 active:scale-[85%]">
                  <svg viewBox="0 0 44 36" class="h-[1.55rem]">
                    <path
                      d="M0 18H44M0 3H44M0 33H44"
                      stroke="black"
                      stroke-width="5"
                    />
                  </svg>
                </button>
              }
            </div>

            <div class="flex items-end">
              <ul class="flex h-full">
                  <a
                    [routerLink]="['/category/tech' ]"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-24 h-full"
                  ><li>Tech</li></a>
                  <a
                    [routerLink]="['/category/culture']"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-24 h-full"
                  ><li>Culture</li></a>
                  <a
                    [routerLink]="['/category/science' ]"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-24 h-full"
                  ><li>Science</li></a>
                  <a
                    [routerLink]="['/category/media']"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-24 h-full"
                  ><li>Media</li></a>
                
              </ul>

              @if (!authState()) {
                <a
                  [routerLink]="['/subscription']"
                  class=" w-44 h-full text-white font-medium flex justify-center items-center bg-brandViolet hover:text-brandViolet hover:bg-white  active:scale-95 "
                  >Subscribe for $0</a
                >
                <a
                  [routerLink]="['/login']"
                  class=" w-44 h-full font-medium flex justify-center items-center bg-white hover:bg-black hover:text-white active:scale-95"
                  >Login</a
                >
              } @else if (!(subscriptionState$ | async)?.subscription) {
                <a
                  [routerLink]="['/subscription']"
                  class=" w-44 h-full text-white font-medium flex justify-center items-center bg-brandViolet hover:text-brandViolet hover:bg-white  active:scale-95 "
                  >Subscribe for $0</a
                >
              }
            </div>
          </div>
        }
      </nav>
    </header>
  `,
  styles: ``,
})
export class HeaderComponent implements AfterViewChecked {
  firebaseService = inject(FirebaseService);
  router = inject(Router);
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

  search = model<boolean>(false)
  menu = model<boolean>();
  reduced = model<boolean>(true);
  visibility = model<boolean>(false);

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
          this.reduced.set(true);
        } else {
          this.reduced.set(false);
        }
        if (event.url.split('/')[1] === 'article') {
          this.articleRoute.set(true);
          this.visibility.set(false);
        } else {
          this.visibility.set(true);
        }
      });
  }

  menuTrigger() {
    this.menu.update((value) => !value);
  }

  searchTrigger(){
    this.search.update((value) => !value);

  }
}
