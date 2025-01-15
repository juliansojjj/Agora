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
import { debounceTime, filter, map, Observable, of, switchMap } from 'rxjs';
import { FirestoreCollectionUser } from '../../../../shared/interfaces/firebase.interfaces';
import { Category } from '../../../../shared/interfaces/category.interface';
import { TitleStrategyService } from '../../../../core/services/title-strategy.service';
import { Title } from '@angular/platform-browser';
import { ElementRef } from '@angular/core';
import { AbstractControl, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Fuse, { FuseResult } from 'fuse.js';
import { Article } from 'app/shared/interfaces/article.interface';

@Component({
    selector: 'app-article-header',
    imports: [RouterLink, AsyncPipe, NgIf, MenuComponent, NgClass, ReactiveFormsModule],
    template: `
    <header
      class="w-full flex top-0 left-0 z-50 h-[7.5rem]"
      [ngClass]="banner() ? 'lg:fixed bannerHeader max-lg:sticky max-lg:bg-white' : 'sticky bg-white'" 
    >
      <nav class="w-full flex " [ngClass]="banner() ? 'max-lg:justify-between bannerNav' : 'justify-between'">
        <a routerLink="/" class="h-[4rem] xl:block hidden self-center relative">
          <img src="agora-imagotype.svg" class="h-[4rem]" [ngClass]="banner() ? 'normalLogo ml-12' : 'ml-12'"/>
          <img src="negative-isotype.svg" class="h-[4rem]" [ngClass]="banner() ? 'bannerLogo mr-12' : 'hidden'"/>
          <div class="absolute right-0 top-0 w-[4rem] h-[4rem] -z-10 mr-12" [ngClass]="banner() ? 'bannerShadow' : 'hidden'"></div>
        </a>

          <span class="w-fit h-fit self-center hidden 2xl:block text-[1.2rem] font-medium pl-14 pr-2"
          [ngClass]="banner() ? 'bannerArticleTitle' : ''">{{headingInfo()}}</span>

          <div class="xl:w-fit w-full h-full relative md:grid md:grid-rows-2 flex xl:justify-end">
            <div class="w-full flex xl:justify-between"
              [ngClass]="banner() ? 'justify-end' : ' justify-end'">

              <a routerLink="/" class="md:h-[3.5rem] h-[5rem] xl:hidden block self-center mx-7 my-0 md:mt-3 relative">
                <img src="agora-imagotype.svg" class="md:h-[3.5rem] h-[5rem]" [ngClass]="banner() ? 'normalLogo' : ''"/>
                <img src="negative-isotype.svg" class="h-[4rem] mt-4 mr-4" [ngClass]="banner() ? 'bannerLogo' : 'hidden'"/>
                <div class="absolute right-0 top-0 w-[4rem] h-[4rem] mt-4 mr-4 -z-10 " [ngClass]="banner() ? 'bannerShadow' : 'hidden'"></div>
              </a>

              

              <div class="w-full flex justify-end pr-7"
              [ngClass]="banner() ? 'bannerNavElements max-lg:flex' : 'flex'">
              
                
              <form class="w-full flex justify-end relative" [formGroup]="searchForm" (ngSubmit)="onSearchSubmit()" [ngClass]="search() ? 'block':'hidden'">
                  <input type="text" placeholder="Search" formControlName="search"
                  class="peer w-full h-full border-b-2 border-white focus:border-black focus:outline-none sm:block hidden pl-[2rem]">
                  
                  <button class="sm:block hidden border-b-2 peer-focus:border-black border-white"  type="submit" [disabled]="searchForm.invalid || searchForm.pending">
                    <svg class="h-[1.8rem]" viewBox="0 0 1200 1200">
                      <path
                      stroke="black"
                        d="m1098.1 965.59-267.19-267.26c35.961-59.324 57.039-128.85 57.039-203.32 0-217.24-175.8-393.15-393.04-393.23-217.09 0.078124-393.04 175.99-393.04 393.19 0 217.05 175.99 392.96 393.15 392.96 74.512 0 143.93-21.074 203.25-57.039l267.34 267.34zm-846.26-470.62c0.22266-134.32 108.86-242.96 243.15-243.19 134.25 0.30078 242.93 108.86 243.15 243.19-0.26172 134.21-108.9 242.93-243.15 243.11-134.32-0.1875-242.96-108.9-243.15-243.11z"
                      />
                    </svg>
                  </button>

                  <button (click)="searchTrigger()" class="sm:block hidden active:scale-95 absolute h-fit left-0 top-0 bottom-0 my-auto z-20" type="button">
                    <svg viewBox="0 0 335 335" class="h-5">
                      <polygon  points="328.96 30.2933333 298.666667 1.42108547e-14 164.48 134.4 30.2933333 1.42108547e-14 1.42108547e-14 30.2933333 134.4 164.48 1.42108547e-14 298.666667 30.2933333 328.96 164.48 194.56 298.666667 328.96 328.96 298.666667 194.56 164.48" />
                    </svg>
                  </button>

                  @if(articleSearchList() && authorSearchList()){
                    <div class="sm:block hidden absolute md:top-[3.5rem] top-[7.5rem] right-0 left-0 w-full z-20">
                      @for (item of articleSearchList(); track $index) {
                        <a [routerLink]="['/article',urlFormat(item.item.articleID!, item.item.heading)]" (click)="searchTrigger()"
                        class="md:h-[3.75rem] h-[4.75rem] px-2 pt-1 bg-white min-w-full block hover:bg-brandGrey">
                          {{item.item.heading}}
                        </a>
                      }
                      @for (item of authorSearchList(); track $index) {
                        <a [routerLink]="['/author',item.authorID]" 
                        class="md:h-[3.75rem] h-[4.75rem] px-2 pt-1 bg-white min-w-full block hover:bg-brandGrey" (click)="searchTrigger()">
                          <span class="font-bold">Author:</span><span> {{item.authorName}}</span>
                        </a>
                      }
                    </div>
                  }
                </form>
                
                <button (click)="searchTrigger()" [ngClass]="search() ? 'hidden':'sm:block hidden'">
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
                    [routerLink]="['/category/tech']"
                    class="hover:bg-white bg-brandShade text-black text-center font-medium flex justify-center items-center hover:text-black xl:w-36 w-28 h-full"
                  ><li>Tech</li></a>
                  <a
                    [routerLink]="['/category/culture']"
                    class="hover:bg-white bg-brandShade text-black text-center font-medium flex justify-center items-center hover:text-black xl:w-36 w-28 h-full"
                  ><li>Culture</li></a>
                  <a
                    [routerLink]="['/category/science']"
                    class="hover:bg-white bg-brandShade text-black text-center font-medium flex justify-center items-center hover:text-black xl:w-36 w-28 h-full"
                  ><li>Science</li></a>
                  <a
                    [routerLink]="['/category/entertainment']"
                    class="hover:bg-white bg-brandShade text-black text-center font-medium flex justify-center items-center hover:text-black xl:w-36 w-32 h-full"
                  ><li>Entertainment</li></a>
                  <a
                    [routerLink]="['/category/media']"
                    class="hover:bg-white bg-brandShade text-black text-center font-medium flex justify-center items-center hover:text-black xl:w-36 w-28 h-full"
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
          @media only screen and (min-width: 1024px){
            animation: normalLogoTransition linear both;
            animation-timeline:scroll(root);
            animation-range: 89vh 89.1vh;
          }
          }
      }
      @keyframes normalLogoTransition {
        from{
          display:none;

        }
        to{
          display:block;
        }
      }

      .bannerLogo {
        display:none;
        @supports (animation-timeline: scroll(root)) {
          @media only screen and (min-width: 1024px){
          display:block;
          animation: bannerLogoTransition linear both;
          animation-timeline:scroll(root);
          animation-range: 89vh 89.1vh;
          }
        }
      }
      
      @keyframes bannerLogoTransition {
        from{
          display:block;

        }
        to{
          display:none;
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

      .bannerShadow{
        display:none;
        @supports (animation-timeline: scroll(root)) {
          @media only screen and (min-width: 1024px){
            animation: shadowTransition linear both;
            animation-timeline:scroll(root);
            animation-range: 89vh 89.1vh;
            opacity:0.2;
            display:block;
            background: radial-gradient(#000000, rgba(255, 0, 0, 0));
            background-repeat: no-repeat;
          }
        }
      }
      @keyframes shadowTransition {
        from{
          display:block;

        }
        to{
          display:none;
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
    ]
})
export class ArticleHeaderComponent implements AfterViewChecked, OnInit {
  firebaseService = inject(FirebaseService);
  router = inject(Router);
  title = inject(Title);

  renderer = inject(Renderer2);
  document = inject(DOCUMENT);

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

  formBuilder = inject(NonNullableFormBuilder)

  articlesList = model<Article[]>([])
  articleSearchList = model<FuseResult<Article>[]>([])
  authorSearchList = model<{authorID:string,authorName:string}[]>([])

  searchForm = this.formBuilder.group({
    search: this.formBuilder.control('', {
      validators: [Validators.required, this.trimValidator],
    })
  });
  onSearchSubmit(){
    this.router.navigate(['/search'], { queryParams: {search: this.searchForm.controls.search.getRawValue()} });
    this.searchTrigger()
  }

  trimValidator(control:AbstractControl){
    return control.value.trim().length >= 2 ? null : {blankText:true}
  }
  ngOnInit(): void {
    if(!localStorage.getItem('articles')) {
      this.firebaseService.getSearchArticles().subscribe(res=>{
        localStorage.setItem('articles', JSON.stringify(res));
        this.articlesList.set(res)
      })
    }else this.articlesList.set(JSON.parse(localStorage.getItem('articles')!))
    
    
  
     this.searchForm.controls.search.valueChanges.pipe(
      debounceTime(200),
      switchMap(input=>{
        const fuseArticleOptions = {
          includeScore: true,
          // useExtendedSearch: true,
          keys: [
            "heading",
            "subheading",
            "authorName"
          ]
        };
        const articlesFuse = new Fuse(this.articlesList(), fuseArticleOptions);
        
        const fuseAuthorOptions = {
          includeScore: true,
          // useExtendedSearch: true,
          keys: [
            "authorName"
          ]
        };
        const authorFuse = new Fuse(this.articlesList(), fuseAuthorOptions);
  
        this.articleSearchList.set(articlesFuse.search(input).splice(0,8))
  
        const authorsArray = authorFuse.search(input).map(res=>{
          return {authorID:res.item.authorID,authorName:res.item.authorName}
        }
        )
        this.authorSearchList.set(authorsArray.splice(0,1))
  
        return of([])
      })
     ).subscribe()
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
    if(this.menu()){
      this.renderer.removeStyle(this.document.body, 'overflow');
    } else{
      this.renderer.setStyle(this.document.body, 'overflow', 'hidden');
    }
    this.menu.update((value) => !value);
  }
  
  searchTrigger(){
    this.searchForm.reset()
    this.search.update((value) => !value);

  }
  urlFormat(id: string, title: string) {
    const formatTitle = title
      .split(' ')
      .join('-')
      .replace(/[^A-Za-z0-9-._~:/?#\[\]@!$&'()*+]+/g, '')
      .toLowerCase(); //valid url characters
    return `${id}-${formatTitle}`;
  }
}
