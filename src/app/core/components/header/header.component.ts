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
          class=" w-full lg:w-3/5 relative grid grid-cols-[1fr_1fr_1fr] pt-6" [ngClass]="reduced() ? 'h-[5rem]' : 'h-[8.5rem]'"
          
        >
            <li class="place-self-start flex ">
              <span>busqueda</span>
              @if (articleRoute()) {
                <span>{{ routeTitle() == 'Agora' ? '' : routeTitle() }}</span>
              }
            </li>

          <li class="mx-auto">
            <a routerLink="/">
              <img
                src="agora-logo.svg"
                [ngClass]="reduced() ? 'h-[3rem]' : 'h-[5.5rem]'"
              />
            </a>
          </li>

            <li class=" place-content-end flex items-start">
              @if(!authState()){
                <a [routerLink]="['/subscription']" class=" min-w-fit font-medium h-7 flex items-center px-3 bg-brandRed text-white hover:text-brandRed hover:bg-white hover:border-2 hover:border-brandRed active:scale-95 ">Subscribe for $0</a>
                <a [routerLink]="['/login']" class=" font-medium min-w-fit h-7  flex items-center px-3  bg-white text-gray-400 border-2 border-gray-200 hover:text-black hover:border-brandRed active:scale-95 ml-3">Login</a>
              }
              @else if(!(subscriptionState$ | async)?.subscription) {
                <a [routerLink]="['/subscription']" class=" min-w-fit font-medium h-7 flex items-center px-3 bg-brandRed text-white hover:text-brandRed hover:bg-white hover:border-2 hover:border-brandRed active:scale-95 ">Subscribe for $0</a>
              }
              @else {
              <button (click)="menuTrigger()">Account</button>
              }
            

            </li>
        </ul>
        }
        
      </nav>



        <hr>


        @if(visibility() && !reduced()){
          <ul class="flex justify-between items-center lg:w-3/5 w-full flex-grow relative ">
          @for (item of categories(); track $index) {
              <a [routerLink]="['/category', item.url]" class="hover:bg-black flex-grow text-center hover:text-white">{{ item.name }}</a>
          }
        </ul>
        }
     
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
