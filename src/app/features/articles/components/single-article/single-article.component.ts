import { AsyncPipe, DatePipe, NgClass, TitleCasePipe } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  inject,
  input,
  model,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { MenuComponent } from 'app/core/components/menu/menu.component';
import { filter, map, of, pairwise, switchMap } from 'rxjs';
import { FirebaseService } from '../../../../core/services/firebase.service';
import {
  Article
} from '../../../../shared/interfaces/article.interface';
import { Author } from '../../../../shared/interfaces/author.interface';
import {
  FirestoreCollectionUser
} from '../../../../shared/interfaces/firebase.interfaces';
import { TextAreaResizeDirective } from '../../directives/text-area-resize.directive';
import { CommentsLengthPipe } from '../../pipes/comments-length.pipe';
import { TypeofPipe } from '../../pipes/typeof.pipe';
import { ArticleHeaderComponent } from '../article-header/article-header.component';
import { StandardGridComponent } from "../grids/standard-grid/standard-grid.component";
import { ArticleSkeletonComponent } from "../skeletons/article-skeleton/article-skeleton.component";
import { Comment } from 'app/shared/interfaces/comment.interface';
import { MatchUsernamePipe } from "../../pipes/match-username.pipe";

@Component({
    selector: 'app-single-article',
    imports: [
    AsyncPipe,
    TypeofPipe,
    DatePipe,
    TitleCasePipe,
    NgClass,
    RouterLink,
    ReactiveFormsModule,
    TextAreaResizeDirective,
    CommentsLengthPipe,
    RouterLink,
    ArticleHeaderComponent,
    MenuComponent,
    StandardGridComponent,
    ArticleSkeletonComponent,
    MatchUsernamePipe
],
    template: `
    @if (data$ | async; as data) {
      <app-article-header [banner]="data.frontImageBanner" [headingInfo]="headingInfo()" [(menu)]="menu"/>
      <app-menu  [(menu)]="menu"/>

      <article class="w-full  min-h-screen relative flex flex-col items-center">
          @if (data.frontImageBanner) {
            <section class="h-full w-full flex-col items-center relative bannerLanding">
              <div class="w-full h-full absolute z-10 left-0 bottom-0 grid grid-cols-[14rem_4rem_4rem] grid-rows-[1fr_4rem]" >
                <div class="bg-brandShade col-span-2 h-full flex flex-col p-7 pt-12">
                  <h1 class="font-semibold text-[2.8rem] leading-[3.5rem] mb-8">{{data.heading}}</h1>
                  <h2 class="font-medium text-[1.6rem]">{{data.subheading}}</h2>
                </div>
                <div class="flex flex-col w-full place-self-end relative">
                  <div class="h-[4rem] w-full bannerTriangle bg-white rotate-180"></div>
                  <div class="h-[34rem] w-full bg-white flex items-center justify-center">
                    <span class="[writing-mode:vertical-lr] rotate-180 text-[1.6rem]">{{data.authorName}} on {{data.date.toDate() | date:'MMMM d, y'}}</span> 
                  </div>
                </div>

                <div class="h-[4rem] w-full bg-white"></div>
                <div class="h-[4rem] w-full bannerTriangle bg-white"></div>
                <div class="h-[4rem] w-full bannerTriangle bg-white"></div>
              </div>
              
              <img
                src="{{ data.frontImage }}"
                alt="{{ data.frontImageAlt }}"
                class="relative w-full h-screen object-cover"
              />
            </section>
          } 
            <div class="w-full justify-between items-start 
                lg:w-1/2 lg:p-0 
                sm:mt-4
                xsm:px-6
                mt-0 px-5" 
                [ngClass]="data.frontImageBanner ? 'normalLanding' : 'flex'">
                <div #domHeading class="w-full">
                  <h1
                    class="font-semibold text-left
                    xl:text-[3.5rem]
                    md:text-[2.5rem]
                    sm:text-[2.25rem]
                    text-[2rem] mb-4"  
                  >
                    {{ data.heading }}
                  </h1>
                  <h2 class="
                  xl:text-[1.5rem] 
                  xsm:text-[1.4rem] xsm:mb-9
                  text-[1.1rem] mb-5">{{ data.subheading }}</h2>
                  <span class="xsm:text-[1.25rem] text-[1rem]">
                    <a [routerLink]="['/author', data.authorID]" class="mr-2 font-medium underline hover:no-underline hover:bg-black hover:text-white">{{data.authorName}}</a>
                    <span>on {{data.date.toDate() | date:'MMMM d, y'}}</span>  
                  </span>

                  <div class=" mt-3 flex justify-between">
                    <span class="xsm:text-[1.25rem] text-[1rem]">
                      Original source <a [href]="data.source" class="font-medium underline hover:no-underline hover:bg-black hover:text-white">here</a>
                    </span>
                    @if (
                    (userInfo$ | async)?.favorites?.includes(id().split('-')[0])
                    ) {
                      <button (click)="favoriteHandle(false)">
                      <svg class="xsm:h-8 h-7 max-lg:mr-2 fill-black" viewBox="0 0 166 232">
                          <path d="M77.8192 169.537L9.5 213.986V9.5H156.5V213.986L88.1808 169.537L83 166.166L77.8192 169.537Z" />
                        </svg>
                      </button>
                    } @else if (userInfo$ | async) {
                      <button (click)="favoriteHandle(true)">
                        <svg class="xsm:h-8 h-7 max-lg:mr-2 stroke-black stroke-[21] fill-none" viewBox="0 0 166 232">
                          <path d="M77.8192 169.537L9.5 213.986V9.5H156.5V213.986L88.1808 169.537L83 166.166L77.8192 169.537Z" />
                        </svg>
                      </button>
                    } @else {
                      <a
                        [routerLink]="['/login']"
                        [queryParams]="{
                          redirect: 'article-' + id().split('-')[0],
                        }"
                        class="hover:bg-transparent hover:p-0"
                      >
                      <svg class="xsm:h-8 h-7 max-lg:mr-2 stroke-black stroke-[21] fill-none" viewBox="0 0 166 232">
                          <path d="M77.8192 169.537L9.5 213.986V9.5H156.5V213.986L88.1808 169.537L83 166.166L77.8192 169.537Z" />
                        </svg>
                      </a>
                    }
                  </div>
                </div>

                
              </div>
              <img
                src="{{ data.frontImage }}"
                alt="{{ data.frontImageAlt }}"
                class="relative w-full  lg:w-1/2 object-cover mt-9"
                [ngClass]="{'normalImage': data.frontImageBanner}"
              />
              <span class=" w-full  lg:w-1/2 self-start lg:self-center mt-3 mb-4 max-lg:px-6" 
              [ngClass]="{'normalImageAlt': data.frontImageBanner}">
                {{data.frontImageAlt}}
              </span>

          <!-- ------------------------------------------------------------------- -->
        <section class="w-full lg:p-0 xsm:px-6 px-5 flex flex-col items-center">
          
          @if(data.frontImageBanner){
            <div class="contentElement mt-5 mb-3 pr-1 flex justify-between bannerInfo">
              <span class="text-[1.25rem]">
                Original source <a [href]="data.source" class="font-medium hover:bg-black hover:text-white">here</a>
              </span>

              @if ((userInfo$ | async)?.favorites?.includes(id().split('-')[0])) {
                <button (click)="favoriteHandle(false)">
                  <svg class="h-8 fill-black" viewBox="0 0 166 232">
                      <path d="M77.8192 169.537L9.5 213.986V9.5H156.5V213.986L88.1808 169.537L83 166.166L77.8192 169.537Z" />
                  </svg>
                </button>
              } @else if (userInfo$ | async) {
                <button (click)="favoriteHandle(true)">
                  <svg class="h-8 stroke-black stroke-[21] fill-none" viewBox="0 0 166 232">
                    <path d="M77.8192 169.537L9.5 213.986V9.5H156.5V213.986L88.1808 169.537L83 166.166L77.8192 169.537Z" />
                  </svg>
                </button>
              } @else {
              <a [routerLink]="['/login']" [queryParams]="{redirect: 'article-' + id().split('-')[0]}" class="hover:bg-transparent hover:p-0">
                <svg class="h-8 stroke-black stroke-[21] fill-none" viewBox="0 0 166 232">
                  <path d="M77.8192 169.537L9.5 213.986V9.5H156.5V213.986L88.1808 169.537L83 166.166L77.8192 169.537Z" />
                </svg>
              </a>
              }
            </div>
          }
          @for (item of data.content; track $index) {

            @if ((item | typeof) !== 'image' && (item | typeof) !== 'quote') {

              @if($index == data.content.length-1){

                @if(recommendations$ | async; as recommendations){
                  <a [routerLink]="['/article',urlFormat(recommendationsFiltered()![articleRecommendationIndex()!].articleID!, recommendationsFiltered()![articleRecommendationIndex()!].heading)]" 
                    class="min-h-fit italic text-[1.2rem] my-4 underline hover:text-brandViolet
                    2xl:w-1/4 lg:w-1/3 md:w-1/2 xsm:w-4/5 w-full">
                      Read also: {{recommendationsFiltered()![articleRecommendationIndex()!].heading}}
                  </a>
                }
              }
            }

            @if ((item | typeof) == 'paragraph') {
              <p class="my-4 xsm:text-[1.2rem] text-[1.1rem] contentElement">
                {{ $any(item).paragraph }}
              </p>
            }
            @if ((item | typeof) == 'htmlParagraph') {
              <p class="my-4 xsm:text-[1.2rem] text-[1.1rem] contentElement" #htmlContent [innerHTML]="$any(item).htmlParagraph">
              </p>
            }
            @if ((item | typeof) == 'htmlContent') {
              <div #htmlContent [innerHTML]="$any(item).htmlContent">
              </div>
            }
            @if ((item | typeof) == 'quote') {
              <blockquote
                class="border-brandViolet contentElement 
                md:text-[1.3rem]
                sm:pl-7 sm:border-l-[4px]
                xsm:text-[1.2rem]  
                text-[1.1rem] my-5 pl-3 border-l-[2px]"
              >
                <i> {{ $any(item).quote }} </i>
              </blockquote>
            }
            @if ((item | typeof) == 'image') {
                <div class="my-9 2xl:w-1/3 lg:w-1/2 md:w-3/4 w-full flex flex-col">
                  <img
                    class="w-full object-cover"
                    src="{{ $any(item).imageUrl }}"
                    alt="{{ $any(item).imageAlt }} "
                  />
                  <span class="w-full">{{ $any(item).imageAlt }}</span>
                </div>
            }
            @if ((item | typeof) == 'title') {
              <h3 class="font-semibold md:text-[1.9rem] text-[1.6rem] mt-7 contentElement">
                {{ $any(item).title }}
              </h3>
            }
            @if ((item | typeof) == 'subtitle') {
              <h4 class="font-semibold md:text-[1.5rem] text-[1.35rem] mt-4 xsm:-mb-4 contentElement">
                {{ $any(item).subtitle }}
              </h4>
            }
          }
          <div class="h-fit mb-8 contentElement xsm:text-[1.2rem] text-[1.1rem]">
            <span class="mr-1 font-semibold">Topics</span>
            @for (item of data.topics; track $index) {
                <a
                  [routerLink]="['/category/' + item.url]"
                  class="font-normal articleLink inline mx-1">
                  {{ item.name }}
                </a>
            }
          </div>

          <hr class="contentElement h-[.05rem] bg-slate-200">

          <section class="contentElement flex flex-col items-center my-6">
            <div class="w-full h-fit flex sm:flex-row flex-col items-center">
              <img [src]="authorData()?.authorImage" alt="fake image of author"
              class="h-[7rem] w-[7rem] max-sm:mb-4 sm:mr-8 rounded-full">

              <a [routerLink]="['/author',data.authorID]"
                class=" w-fit h-fit font-semibold text-left text-[2rem] underline hover:no-underline hover:bg-black hover:text-white">
                {{data.authorName}}
              </a>
            </div>
            <p class="mt-4 xsm:text-[1.2rem] text-[1.1rem]">{{authorData()?.authorDescription}}</p>
          </section>

          <hr class="contentElement h-[.05rem] bg-slate-200">

        </section>

        <section class="contentElement flex flex-col my-6 lg:p-0 xsm:px-6 px-5">
          
          
          <span class="md:text-[1.9rem] text-[1.6rem] font-semibold self-center">{{ (comments$ | async)! | commentsLength }} Comments</span>

          @if (!(userInfo$ | async)) {
            <div class="flex flex-col mt-2 w-full ">
              <a
                [routerLink]="['/login']"
                [queryParams]="{
                  redirect: 'article-' + id().split('-')[0],
                }"
                class="focus:outline-none focus:border-b-2 resize-none h-fit w-full overflow-y-clip 
                hover:text-gray-400 text-gray-400 hover:cursor-text font-normal hover:bg-transparent hover:p-0"
              >
                Write your comment here...</a>
            </div>
          } @else {
            <form
              [formGroup]="commentForm"
              (ngSubmit)="onCommentSubmit()"
              class="flex flex-col mt-6 w-full "
              >
              <textarea
                formControlName="text"
                class="focus:outline-none border-b-2 py-1 resize-none h-fit w-full overflow-y-clip"
                appTextAreaResize
                #textAreaResize="appTextAreaResize"
                placeholder="Write your comment here..."
              ></textarea>

              @if (commentForm.controls.text.touched || commentForm.controls.text.dirty) {

                <div class="h-5 w-full mt-2">
                  @if (commentForm.controls.text.errors?.['maxlength']) {
                    <span class="errorLabel">The max amount of characters is 280</span>
                  }
                </div>
              
                <div class="flex items-end self-end h-10 mt-7">
                    @if(!isCommentFormLoading()){
                      <button
                      type="reset"
                      (click)="onCancel()"
                      class="h-10 w-[6rem] sm:w-[8rem] mt-4 font-medium self-end mr-4
                      bg-white text-brandShade hover:bg-brandRed hover:text-white active:scale-95 text-[1rem] sm:text-[1.2rem]">
                        Cancel
                      </button>
                    }
                    <button
                      [type]="isCommentFormLoading() ? 'button' : 'submit'"
                      [disabled]="commentForm.invalid || commentForm.pending"
                      class="h-10 w-[6rem] sm:w-[8rem] mt-4 font-medium box-border
                      hover:bg-brandShade hover:text-black text-white active:scale-95 bg-black text-[1rem] sm:text-[1.2rem]">
                        @if(isCommentFormLoading()){. . .}@else{Comment}
                    </button>
                </div>
              }
            </form>
          }

          @if (comments$ | async ; as comments) {
            @for (item of comments; track $index) {
              @if(!item.deletedByUser){
                <div class="flex flex-col mt-8 h-fit">
                  <div class="flex justify-between items-center">
                    <div>
                      <div class="font-medium text-[1.2rem] mr-[.6rem] inline">
                        @if(users()){
                          <div class="inline" [innerHTML]="users()! | matchUsername : item.uid"></div>
                        }@else{<div class="w-full skeletonElement h-[1.1rem]"></div>}
                      </div>
                      <span>{{ item.date.toDate() | date: 'MM/dd/yyyy' }}</span> 
                    </div>
                    @if (item.uid === uid()) {
                      <button (click)="onCommentDelete(item.commentId!)">
                        <svg
                          viewBox="0 0 24 24"
                          class="stroke-slate-500 fill-none stroke-2 h-6 hover:stroke-none hover:fill-brandRed active:scale-75">
                          <g>
                            <path
                              d="M18 6L17.1991 18.0129C17.129 19.065 17.0939 19.5911 16.8667 19.99C16.6666 20.3412 16.3648 20.6235 16.0011 20.7998C15.588 21 15.0607 21 14.0062 21H9.99377C8.93927 21 8.41202 21 7.99889 20.7998C7.63517 20.6235 7.33339 20.3412 7.13332 19.99C6.90607 19.5911 6.871 19.065 6.80086 18.0129L6 6M4 6H20M16 6L15.7294 5.18807C15.4671 4.40125 15.3359 4.00784 15.0927 3.71698C14.8779 3.46013 14.6021 3.26132 14.2905 3.13878C13.9376 3 13.523 3 12.6936 3H11.3064C10.477 3 10.0624 3 9.70951 3.13878C9.39792 3.26132 9.12208 3.46013 8.90729 3.71698C8.66405 4.00784 8.53292 4.40125 8.27064 5.18807L8 6"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            ></path>
                          </g>
                        </svg>
                      </button>
                    }
                  </div>
                  <p class="text-[1.1rem]">{{ item.content }}</p>
                </div>
              }
            }
          }
          
        </section>

        <hr class="contentElement h-[.05rem] bg-slate-200">

        <section class="flex flex-col items-center 2xl:w-1/2 lg:w-3/4 w-full mt-6 lg:p-0 xsm:px-6 px-5">

          @if(authorArticles$ | async; as authorArticles){
            <h4 class="md:text-[1.9rem] text-[1.6rem] md:mb-6 mb-3 font-semibold">More from {{authorData()?.authorName}}</h4>
            <app-standard-grid [articles]="authorArticles"/>
          }

          @if(recommendations$ | async; as recommendations){
            <h4 class="md:text-[1.9rem] text-[1.6rem] mt-6 md:mb-6 mb-3 font-semibold">More from {{category() | titlecase}}</h4>
            <app-standard-grid [articles]="recommendationsFiltered()!.slice(0,9)"/>
          }
        </section>
      </article>

    } @else {
      <app-article-header [headingInfo]="headingInfo()" [(menu)]="menu"/>
      <app-article-skeleton />
    }
  `,
    styles: `
      .bannerLanding{
        display:none;
        @media (min-width: 1024px){
          display:none;
          @supports (animation-timeline: scroll(root)) {
            display:flex;
          } 
        }
      }
      .bannerInfo{
        display:none;
        @media (min-width: 1024px){
          display:none;
          @supports (animation-timeline: scroll(root)) {
            display:flex;
          } 
        }
      }
      .normalLanding{
        display:flex;
        @media (min-width: 1024px){
          display:flex;
          margin-top:7.5rem;
          @supports (animation-timeline: scroll(root)) {
            display:none;
            margin-top:0;
          } 
        }
      }
      .normalImage{
        display:block;
        @media (min-width: 1024px){
          display:block;
          @supports (animation-timeline: scroll(root)) {
            display:none;
          } 
        }
      }
      .normalImageAlt{
        display:block;
        @media (min-width: 1024px){
          display:block;
          @supports (animation-timeline: scroll(root)) {
            display:none;
          } 
        }
      }

      .contentElement {
        width: 100%;

        @media (min-width: 640px) {
          width: 80%;
        }

        @media (min-width: 768px) {
          width: 50%;
        }

        @media (min-width: 1024px) {
          width: 33.33%;
        }

        @media (min-width: 1536px) {
          width: 25%;
        }
      }

      .articleLink {
        font-weight: 600;
        color: #5E0060;
      }
      .articleLink:hover {
        color: #ffffff;
        background-color: #5E0060;
        padding: 0.1rem 0 0.1rem 0;
      }

      .bannerTitle{
        color:white;
        text-shadow: 5px 0px 0px black;
      }
      .bannerTriangle{
        clip-path: polygon(
          0% 0%,
          100% 0%,
          100% 100%);
      }
      .errorLabel{
        font-size:1.2rem;
        line-height:normal;
        font-weight:500;
        color:#FD7E7E;
        width:fit-content;
        @media (max-width:768px){
          font-size:1rem;
          line-height:95%;
          margin-top:.15rem;
        }
      }
    `,
    encapsulation: ViewEncapsulation.None
})
export class SingleArticleComponent implements OnInit {
  firebaseService = inject(FirebaseService);
  router = inject(Router)
  id = input.required<string>();
  title = inject(Title);
  menu:boolean = false;
  
  @ViewChild('domHeading') domHeading?:ElementRef;
  @ViewChild(TextAreaResizeDirective) textAreaResizeDirective!: TextAreaResizeDirective;

  constructor() {
    effect(() => {
      this.title.setTitle(this.heading()?.heading!);
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd),pairwise())
      .subscribe((events) => {
        const previousUrl = events[0].urlAfterRedirects;
        const currentUrl = events[1].urlAfterRedirects;
        
        if(previousUrl.split('/')[1] == 'article' && currentUrl.split('/')[1] == 'article'){
          this.commentForm.reset()
        }
      }); 
  }

  ngOnInit(): void {
    document.addEventListener('scroll', () => {
      this.headingCheck()
    })  
    
  }

  headingInfo = model('')
  headingCheck(){
    const top = this.domHeading?.nativeElement.getBoundingClientRect().top
    const height = this.domHeading?.nativeElement.getBoundingClientRect().height

    if(top <= -height*.45) this.headingInfo.set(this.heading()?.heading!)
    else this.headingInfo.set('')
  }




  
  // -------------- User --------------

  authUser$ = this.firebaseService.authState$;
  uid = model<string>();
  userInfo = model<FirestoreCollectionUser>();
  userInfo$ = this.authUser$.pipe(
    map(auth => {
      return auth ? auth : null
    }),
    switchMap((auth) => {
      if(auth) {
        this.uid.set(auth.uid);

        return this.firebaseService.getUserInfo(auth.uid).pipe(
          map((res) => {
            this.userInfo.set(res);
            return res;
          }),
        )
      } else return of()

    }),
  );




  
  // -------------- Articles --------------

  data$ = toObservable(this.id).pipe(
    map((url: string) => {
      const id = url.split('-');
      return id[0];
    }),
    switchMap((id) => this.firebaseService.getSingleArticle(id).pipe(
      map((res:Article)=>{
        if(!res) this.router.navigate(['/not-found'])
        this.category.set(res.category)
        return res
      })
    )),
  );

  authorData = model<Author>()
  authorArticles$ = this.data$.pipe(
    switchMap((article:Article)=>this.firebaseService.getAuthor(article.authorID).pipe(
      map((res:Author)=>{
        this.authorData.set(res)

        return article.authorID
      })
    )),
    switchMap((authorID:string) => this.firebaseService.getAuthorArticles(authorID,10).pipe(
      map(res=> res.filter(val=>val.articleID !== this.id().split('-')[0]))
    ))
  );

  category = model<string>('')
  articleRecommendationIndex = model<number>()
  recommendationsFiltered = model<Article[]>()
  recommendations$ = toObservable(this.category).pipe(
    switchMap(category=> this.firebaseService.getMainCategoryArticles(category,15).pipe(
      map((res:Article[])=>{
        this.articleRecommendationIndex.set(Math.round((Math.random()*10)*((res.length-1)/10)))
        this.recommendationsFiltered.set(res.filter(val=>val.articleID && val.articleID !== this.id().split('-')[0]))
        return res
      })
    ))
  )

  heading = toSignal(this.data$);




  
  // -------------- Comments --------------

  users = model<{username: string,uid: string}[]>()

  comments$ = toObservable(this.id).pipe(
    map((url: string) => {
      const id = url.split('-');
      return id[0];
    }),
    switchMap((id) => this.firebaseService.getArticleComments(id).pipe(map(res=>{
      const usersArr = res.map(val=>val.uid)
      this.firebaseService.getUsernames(Array.from(new Set(usersArr))).subscribe(list=>{
        this.users.set(list.map(obj=>{return {username:obj.username,uid:obj.uid!}}))
      })
      return res
    }))),
  );

  isCommentFormLoading = model(false)
  formBuilder = inject(NonNullableFormBuilder);
  commentForm = this.formBuilder.group({
    text: this.formBuilder.control('', {
      validators: [
        Validators.maxLength(250),
        Validators.pattern("^(?!.*[^\u0000-\u007F])[a-zA-Z0-9@#$%&\\(\\)\\[\\]\\{\\}\\*\\+\\-\\=\\.\\!\\?\\,\\;:\\~`'\"\\s]*$"),
        Validators.required,
        this.trimValidator,
      ],
    }),
  });

  trimValidator(control: AbstractControl) {
    return control.value.trim() ? null : { blankText: true };
  }

  onCancel() {
    this.commentForm.reset();
    this.textAreaResizeDirective.resetHeight();
  }
  onCommentSubmit() {
    const formValues = this.commentForm.getRawValue();
    this.isCommentFormLoading.set(true)

    if (this.userInfo() && this.uid()) {
      const articleID = this.id().split('-');

      this.firebaseService
        .addComment(
          this.userInfo()?.username!,
          this.uid()!,
          articleID[0],
          formValues.text,
        )
        .subscribe({
          next: (res) => {
            this.commentForm.reset();
            this.isCommentFormLoading.set(false)
          },
          error: (err) => console.error(err)
        });
    }
  }

  onCommentDelete(commentId: string) {
    const articleID = this.id().split('-');

    if (commentId) {
      this.firebaseService.deleteComment(articleID[0], commentId);
    }
  }

  
  
  
  
  
  
  
  favoriteHandle(operation: boolean) {
    const articleID = this.id().split('-');

    this.firebaseService.handleFavorite(this.uid()!, operation, articleID[0]);
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