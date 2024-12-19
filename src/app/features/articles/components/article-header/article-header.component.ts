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
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
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
import { MenuComponent } from '../../../../core/components/menu/menu.component';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { authState } from '@angular/fire/auth';
import { toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, filter, map, Observable, switchMap } from 'rxjs';
import { FirestoreCollectionUser } from '../../../../shared/interfaces/firebase.interfaces';
import { Category } from '../../../../shared/interfaces/category.interface';
import { TitleStrategyService } from '../../../../core/services/title-strategy.service';
import { Title } from '@angular/platform-browser';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'app-article-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf, MenuComponent, NgClass],
  template: `
    <header
      class="w-full flex top-0 left-0 z-50 h-[7.5rem]  "
      [ngClass]="banner() ? 'fixed bannerHeader' : 'sticky bg-white'" 
    >
      <nav class="w-full flex  " [ngClass]="banner() ? 'bannerNav' : 'justify-between'">


          <a routerLink="/" class="h-fit self-center ">
            <img src="agora-logo.svg" class="h-[4rem]" [ngClass]="banner() ? 'bannerLogo' : '2xl:pl-12 pl-4'"/>
          </a>

          <span class="h-fit self-center hidden lg:block  text-[1.3rem] font-medium pl-4">{{headingInfo()}}</span>

          <div class=" w-fit h-full relative  grid-rows-2" [ngClass]="banner() ? 'bannerNavElements' : 'grid'">
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
                <button (click)="menuTrigger()" class="ml-7">
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
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-36 h-full"
                  ><li>Tech</li></a>
                  <a
                    [routerLink]="['/category/culture']"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-36 h-full"
                  ><li>Culture</li></a>
                  <a
                    [routerLink]="['/category/science' ]"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-36 h-full"
                  ><li>Science</li></a>
                  <a
                    [routerLink]="['/category/entertainment']"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-36 h-full"
                  ><li>Entertainment</li></a>
                  <a
                    [routerLink]="['/category/media']"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black w-36 h-full"
                  ><li>Media</li></a>
                
              </ul>

              @if (!authState()) {
                <a
                  [routerLink]="['/login']"
                  class=" w-44 h-full font-medium flex justify-center items-center bg-white hover:bg-black hover:text-white active:scale-95"
                  >Login</a
                >
              }
            </div>
          </div>
        
      </nav>
    </header>
  `,
  styles: [
    `
      .bannerHeader {
        animation: headerTransition linear both;
        animation-timeline:scroll(root);
        animation-range:0 1px;
      }

      @keyframes headerTransition {
        from{}
        to{
          background-color:white;
        }
      }

      .bannerLogo {
        animation: logoTransition linear both;
        animation-timeline:scroll(root);
        animation-range:0 1px;
      }
      
      @keyframes logoTransition {
        from{
          margin-left:0;
          filter: brightness(0%) invert(100%);
        }
        to{
          margin-left:3rem;
          filter: brightness(100%);
        }
      }

      .bannerNav{
        animation: navTransition linear both;
        animation-timeline:scroll(root);
        animation-range:0 1px;
      }
      @keyframes navTransition {
        from{
          justify-content: center;
        }
        to{
          justify-content: space-between;
        }
      }

      .bannerNavElements{
        animation: navElementsTransition linear both;
        animation-timeline:scroll(root);
        animation-range:0 1px;
      }
      @keyframes navElementsTransition {
        from{
          display:none;
        }
        to{
          display:grid;
        }
      }
    `,
  ],
})
export class ArticleHeaderComponent implements AfterViewChecked {
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  title = inject(Title);

  banner = input()
  headingInfo = input()

  routeTitle = model<string>('');
  articleRoute = model<boolean>(false);

  authState$ = this.firebaseService.authState$;
  authState = toSignal(this.authState$);

  search = model<boolean>(false)
  menu = model<boolean>();
  visibility = model<boolean>(true);
  reduced = model<boolean>(false);


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
          event.url === '/register' 
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
  
  searchTrigger(){
    this.search.update((value) => !value);

  }
}
