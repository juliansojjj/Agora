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
      class="w-full flex top-0 left-0 z-50 h-[7.5rem]"
      [ngClass]="banner() ? 'lg:fixed bannerHeader max-lg:sticky max-lg:bg-white' : 'sticky bg-white'" 
    >
      <nav class="w-full flex " [ngClass]="banner() ? 'max-lg:justify-between bannerNav' : 'justify-between'">
        <a routerLink="/" class="h-[4rem] xl:block hidden self-center relative">
          <img src="agora-imagotype.svg" class="h-[4rem]" [ngClass]="banner() ? 'normalLogo ml-12' : 'ml-12'"/>
          <img src="negative-isotype.svg" class="h-[4rem]" [ngClass]="banner() ? 'mainBannerLogo mr-12' : 'hidden'"/>
          <div class="absolute right-0 top-0 w-[4rem] h-[4rem] -z-10 mr-12" [ngClass]="banner() ? 'responsiveBannerShadow' : 'hidden'"></div>
        </a>

          <span class="w-fit h-fit self-center hidden 2xl:block text-[1.2rem] font-medium pl-14 pr-2"
          [ngClass]="banner() ? 'bannerArticleTitle' : ''">{{headingInfo()}}</span>

          <div class="xl:w-fit w-full h-full relative md:grid md:grid-rows-2 flex xl:justify-end">
            <div class="w-full flex xl:justify-between"
              [ngClass]="banner() ? 'justify-end' : ' justify-end'">

              <a routerLink="/" class="md:h-[3.5rem] h-[5rem] xl:hidden block self-center mx-7 my-0 md:mt-3 relative">
                <img src="agora-imagotype.svg" class="md:h-[3.5rem] h-[5rem]" [ngClass]="banner() ? 'responsiveNormalLogo' : ''"/>
                <img src="negative-isotype.svg" class="h-[4rem] mt-4 mr-4" [ngClass]="banner() ? 'responsiveBannerLogo' : 'hidden'"/>
                <div class="absolute right-0 top-0 w-[4rem] h-[4rem] mt-4 mr-4 -z-10 " [ngClass]="banner() ? 'responsiveBannerShadow' : 'hidden'"></div>
              </a>

              

              <div class="w-full flex justify-end pr-7"
              [ngClass]="banner() ? 'bannerNavElements max-lg:flex' : 'flex'">
              
                
                @if(search()){
                  <input type="text" class="w-full h-full border-b-2 border-black focus:outline-none sm:block hidden">
                }
                <button (click)="searchTrigger()" class="sm:block hidden" [ngClass]="search() ? 'border-b-2 border-black' : ''">
                  <svg class="h-[1.8rem]" viewBox="0 0 1200 1200">
                    <path
                    stroke="black"
                      d="m1098.1 965.59-267.19-267.26c35.961-59.324 57.039-128.85 57.039-203.32 0-217.24-175.8-393.15-393.04-393.23-217.09 0.078124-393.04 175.99-393.04 393.19 0 217.05 175.99 392.96 393.15 392.96 74.512 0 143.93-21.074 203.25-57.039l267.34 267.34zm-846.26-470.62c0.22266-134.32 108.86-242.96 243.15-243.19 134.25 0.30078 242.93 108.86 243.15 243.19-0.26172 134.21-108.9 242.93-243.15 243.11-134.32-0.1875-242.96-108.9-243.15-243.11z"
                    />
                  </svg>
                </button>
                  <button (click)="menuTrigger()" class="md:hidden block ml-7 active:scale-[85%]">
                    <svg viewBox="0 0 44 36" class="h-[1.55rem]">
                      <path
                        d="M0 18H44M0 3H44M0 33H44"
                        stroke="black"
                        stroke-width="5"
                      />
                    </svg>
                  </button>
                @if (authState()) {
                  <button (click)="menuTrigger()" class="ml-7 active:scale-[85%] md:block hidden">
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
            </div>

            <div class="items-end flex-row justify-self-end"
            [ngClass]="banner() ? 'bannerNavElements max-lg:flex' : 'flex'">
              <ul class="h-full md:flex hidden">
                  <a
                    [routerLink]="['/category/tech' ]"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black xl:w-36 w-28 h-full"
                  ><li>Tech</li></a>
                  <a
                    [routerLink]="['/category/culture']"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black xl:w-36 w-28 h-full"
                  ><li>Culture</li></a>
                  <a
                    [routerLink]="['/category/science' ]"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black xl:w-36 w-28 h-full"
                  ><li>Science</li></a>
                  <a
                    [routerLink]="['/category/entertainment']"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black xl:w-36 w-32 h-full"
                  ><li>Entertainment</li></a>
                  <a
                    [routerLink]="['/category/media']"
                    class="hover:bg-white bg-black text-white text-center font-medium flex justify-center items-center hover:text-black xl:w-36 w-28 h-full"
                  ><li>Media</li></a>
                  @if (!authState()) {
                  <a
                    [routerLink]="['/login']"
                    class=" xl:w-36 w-28 h-full font-medium md:flex hidden justify-center items-center bg-white hover:bg-black hover:text-white active:scale-95"
                    ><li>Login</li></a
                  >
                  }
                
              </ul>

              
            </div>
          </div>
      </nav>
    </header>
  `,
  styles: [
    `
      .bannerHeader {
        @media only screen and (min-width: 1024px){
          animation: headerTransition linear both;
          animation-timeline:scroll(root);
          animation-range: 89vh 89.1vh;
        }
      }

      @keyframes headerTransition {
        from{background-color:transparent;}
        to{
          background-color:white;
        }
      }


      .bannerArticleTitle {
        @media only screen and (min-width: 1024px){
          animation: articleTitleTransition linear both;
          animation-timeline:scroll(root);
          animation-range: 89vh 89.1vh;
        }
      }

      @keyframes articleTitleTransition {
        from{display:none;}
        to{
          @media only screen and (min-width: 1536px) {display:block;}
          }
        }

      .normalLogo{
        display:block;
        @supports (animation-timeline: scroll(root)) {
            display:none;
          }
      }

      .mainBannerLogo {
        display:none;
        @supports (animation-timeline: scroll(root)) {
          @media only screen and (min-width: 1024px){
          display:block;
          animation: mainLogoTransition linear both;
          animation-timeline:scroll(root);
          animation-range: 89vh 89.1vh;
          }
        }
      }
      
      @keyframes mainLogoTransition {
        from{
          margin-left:0;
          filter: brightness(0%) invert(100%);
        }
        to{
          margin-left:3rem;
          filter: brightness(100%);
        }
      }
      .bannerShadow{
        display:none;
        @supports (animation-timeline: scroll(root)) {
          @media only screen and (min-width: 1024px){
            display:block;
            opacity:.2;
            background: radial-gradient(#000000, rgba(255, 0, 0, 0));
            background-repeat: no-repeat;
          }
        }
      }

      .responsiveNormalLogo{
        display:block;
        @supports (animation-timeline: scroll(root)) {
          @media only screen and (min-width: 1024px){
            display:none;
          }
        }
      }
      .responsiveBannerLogo {
        display:none;
        @supports (animation-timeline: scroll(root)) {
          @media only screen and (min-width: 1024px){
            display:block;
            animation: logoTransition linear both;
            animation-timeline:scroll(root);
            animation-range: 89vh 89.1vh;
          }
        }
      }
      @keyframes logoTransition {
        from{
          filter: brightness(0%) invert(100%);
        }
        to{
          filter: brightness(100%);
        }
      }

      .responsiveBannerShadow{
        display:none;
        @supports (animation-timeline: scroll(root)) {
          @media only screen and (min-width: 1024px){
            display:block;
            opacity:.2;
            background: radial-gradient(#000000, rgba(255, 0, 0, 0));
            background-repeat: no-repeat;
          }
        }
      }


      .bannerNav{
        @media only screen and (min-width: 1024px){
          animation: navTransition linear both;
          animation-timeline:scroll(root);
          animation-range: 89vh 89.1vh;
        }
      }
      @keyframes navTransition {
        from{
          justify-content: end;
        }
        to{
          justify-content: space-between;
        }
      }



      .bannerNavElements{
        @media only screen and (min-width: 1024px){
          animation: navElementsTransition linear both;
          animation-timeline:scroll(root);
          animation-range: 89vh 89.1vh;
        }
      }
      @keyframes navElementsTransition {
        from{
          display:none;
        }
        to{
          display:flex;
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
