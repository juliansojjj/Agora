import {
  AfterContentInit,
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  input,
  model,
  ModelSignal,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  Signal,
  signal,
  ViewChild,
  ViewChildren,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import {
  Article,
  contentItems,
  paragraph,
} from '../../../../shared/interfaces/article.interface';
import { catchError, EMPTY, map, Observable, switchMap, take } from 'rxjs';
import { NgIf, AsyncPipe, NgClass, DecimalPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { DocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { DataSnapshot } from '@angular/fire/database';
import { Title } from '@angular/platform-browser';
import { TypeofPipe } from '../../pipes/typeof.pipe';
import { OrderByDatePipe } from '../../pipes/order-by-date.pipe';
import {
  FirebaseAuthUser,
  FirestoreCollectionUser,
} from '../../../../shared/interfaces/firebase.interfaces';
import { RouterLink } from '@angular/router';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TextAreaResizeDirective } from '../../directives/text-area-resize.directive';
import { CommentsLengthPipe } from '../../pipes/comments-length.pipe';
import { CustomDecimalPipePipe } from '../../pipes/custom-decimal-pipe.pipe';
import { ArticleHeaderComponent } from '../article-header/article-header.component';
import { ArticleMenuComponent } from '../article-menu/article-menu.component';

@Component({
  selector: 'app-single-article',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TypeofPipe,
    DatePipe,
    NgClass,
    OrderByDatePipe,
    RouterLink,
    ReactiveFormsModule,
    TextAreaResizeDirective,
    CommentsLengthPipe,
    RouterLink,
    DecimalPipe,
    CustomDecimalPipePipe,
    ArticleHeaderComponent,
    ArticleMenuComponent
  ],
  template: `
    @if (data$ | async; as data) {
      <app-article-header [banner]="data.frontImageBanner" [headingInfo]="headingInfo()" [(menu)]="menu"/>
      <app-article-menu  [(menu)]="menu"/>

      <article class="w-full  min-h-screen relative flex flex-col items-center">
          @if (data.frontImageBanner) {
            <section class=" w-full flex-col items-center relative lg:flex hidden">
              <div class="w-full absolute z-10 bottom-0 text-white  " >
                <div class="mb-20 pl-16" #domHeading>
                <h1
                    class=" font-bold text-[1.8rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[2.8rem] text-left leading-[3.6rem] mb-6 "
                  >
                    {{ data.heading }}
                  </h1>
                  <h2 class="text-[1rem] md:text-[1rem] lg:text-[1.3rem] xl:text-[1.4rem]">{{ data.subheading }}</h2>
                </div>
              
                  <div class="bg-gradient-to-t w-full h-96 from-black absolute bottom-0 -z-10"></div>
              </div>
              
              <img
                src="{{ data.frontImage }}"
                alt="{{ data.frontImageAlt }}"
                class="relative w-full h-screen object-cover"
              />
            </section>
          } 
            <div class="w-full flex justify-between items-start 
                lg:w-1/2 lg:p-0 
                sm:mt-4
                mt-0 px-2" 
                [ngClass]="{'lg:hidden flex': data.frontImageBanner}">
                <div #domHeading>
                  <h1
                    class=" font-bold text-left
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
                    <a [routerLink]="['/author', data.authorID]" class="mr-2 font-medium hover:bg-black hover:text-white">{{data.authorName}}</a>
                    <span>on {{data.date.toDate() | date:'MMMM d, y'}}</span>  
                  </span>

                  <div class=" mt-3 flex justify-between">
                    <span class="xsm:text-[1.25rem] text-[1rem]">
                      Original source <a [href]="data.source" class="font-medium hover:bg-black hover:text-white">here</a>
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
                class="relative w-full  lg:w-1/2 object-cover mt-6"
                [ngClass]="{'lg:hidden block': data.frontImageBanner}"
              />
              <span class=" w-full  lg:w-1/2 self-start lg:self-center mt-3 mb-4 max-lg:px-2" 
              [ngClass]="{'lg:hidden block': data.frontImageBanner}">
                {{data.frontImageAlt}}
              </span>

          <!-- ------------------------------------------------------------------- -->
        <section class="w-full lg:p-0 px-2 flex flex-col items-center">
          @if(data.frontImageBanner){
            
            <div class="text-[1.25rem] mt-5 mb-3 flex justify-between">
              <div>
              <a [routerLink]="['/author', data.authorID]" class="mr-2 font-medium hover:bg-black hover:text-white  ">{{data.authorName}}</a>
              <span>on {{data.date.toDate() | date:'MMMM d, y'}}</span>  
              </div>
                  

                  @if (
                (userInfo$ | async)?.favorites?.includes(id().split('-')[0])
              ) {
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
                <a
                  [routerLink]="['/login']"
                  [queryParams]="{
                    redirect: 'article-' + id().split('-')[0],
                  }"
                  class="hover:bg-transparent hover:p-0"
                >
                <svg class="h-8 stroke-black stroke-[21] fill-none" viewBox="0 0 166 232">
                    <path d="M77.8192 169.537L9.5 213.986V9.5H156.5V213.986L88.1808 169.537L83 166.166L77.8192 169.537Z" />
                  </svg>
                </a>
              }
            </div>


                <span class="text-[1.25rem]"
                  >Original source
                  <a
                    [href]="data.source"
                    class="font-medium hover:bg-black hover:text-white"
                    >here</a
                  ></span>
          }
          @for (item of data.content; track $index) {

            @if ((item | typeof) !== 'image' && (item | typeof) !== 'quote') {

              @if($index == data.content.length-1){

                @if(recommendations$ | async; as recommendations){
                    <a [routerLink]="['/article',urlFormat(recommendations[articleRecommendationIndex()!].articleID!, recommendations[articleRecommendationIndex()!].heading)]" 
                      class="min-h-fit italic text-[1.2rem] my-4 underline hover:text-brandViolet
                      2xl:w-1/4 lg:w-1/3 md:w-1/2 xsm:w-4/5 w-full">
                        Read also: {{recommendations[articleRecommendationIndex()!].heading}}
                  </a>
                }
                

              }
            }

            @if ((item | typeof) == 'paragraph') {
              <p class="xsm:my-7 my-4 xsm:text-[1.2rem] text-[1.1rem] contentElement">
                {{ $any(item).paragraph }}
              </p>
            }
            @if ((item | typeof) == 'htmlParagraph') {
              <p class="xsm:my-7 my-4 xsm:text-[1.2rem] text-[1.1rem] contentElement" #htmlContent>
                {{ $any(item).htmlParagraph }}
              </p>
            }
            @if ((item | typeof) == 'htmlContent') {
              <div #htmlContent>
                {{ $any(item).htmlContent }}
              </div>
            }
            @if ((item | typeof) == 'quote') {
              <blockquote
                class="border-brandViolet contentElement 
                md:text-[1.3rem]
                sm:pl-7 sm:border-l-[4px]
                xsm:mb-7 xsm:text-[1.2rem]  
                text-[1.1rem] mb-4 pl-3 border-l-[2px]"
              >
                <i> {{ $any(item).quote }} </i>
              </blockquote>
            }
            @if ((item | typeof) == 'image') {
                <div class="my-12 2xl:w-1/3 lg:w-1/2 md:w-3/4 w-full flex flex-col">
                  <img
                    class="w-full object-cover"
                    src="{{ $any(item).imageUrl }}"
                    alt="{{ $any(item).imageAlt }} "
                  />
                  <span class="w-full">{{ $any(item).imageAlt }}</span>
                </div>
            }
            @if ((item | typeof) == 'title') {
              <h3 class="font-bold md:text-[1.9rem] text-[1.6rem] mt-12 contentElement">
                {{ $any(item).title }}
              </h3>
            }
            @if ((item | typeof) == 'subtitle') {
              <h4 class="font-bold md:text-[1.5rem] text-[1.35rem] mt-4 xsm:-mb-4 contentElement">
                {{ $any(item).subtitle }}
              </h4>
            }
          }
          <div class="h-fit mb-8 contentElement xsm:text-[1.2rem] text-[1.1rem]">
            <span class="mr-1 font-bold">Topics</span>
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
              <img src="https://thispersondoesnotexist.com/" alt="fake image of author"
              class="h-[7rem] w-[7rem] sm:mr-8 rounded-full">

              <a [routerLink]="['/author',data.authorID]"
                class=" w-fit h-fit font-bold text-left text-[2rem] hover:bg-black hover:text-white">
                {{data.authorName}}
              </a>
            </div>
            <p class="mt-4 xsm:text-[1.2rem] text-[1.1rem]">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique nostrum eligendi doloremque repellat aliquam? Ducimus est perspiciatis autem, id beatae commodi illum placeat! Possimus quod vitae, animi dolorem laborum expedita.
            </p>
          </section>

          <hr class="contentElement h-[.05rem] bg-slate-200">

        </section>

        <section
          class="self-start h-fit lg:self-center  lg:w-1/3 2xl:w-1/4 w-full mt-6 px-2 lg:p-0"
        >
          @if (comments$ | async | orderByDate; as comments) {
            <span class="text-[1.3rem] font-bold"
              >{{ comments | commentsLength }} Comments</span
            >

            @if (!(userInfo$ | async)) {
              <div class="flex flex-col mt-2 w-full ">
                <a
                  [routerLink]="['/login']"
                  [queryParams]="{
                    redirect: 'article-' + id().split('-')[0],
                  }"
                  class="focus:outline-none focus:border-b-2 resize-none h-fit w-full overflow-y-clip hover:text-gray-400 text-gray-400 hover:cursor-text font-normal hover:bg-transparent hover:p-0"
                >
                  Write your comment here...</a
                >
              </div>
            } @else {
              <form
                [formGroup]="form"
                (ngSubmit)="onCommentSubmit()"
                class="flex flex-col mt-2 w-full "
              >
                <textarea
                  formControlName="text"
                  class="focus:outline-none focus:border-b-2 resize-none h-fit w-full overflow-y-clip"
                  appTextAreaResize
                  placeholder="Write your comment here..."
                ></textarea>

                @if (form.controls.text.errors?.['maxlength']) {
                  <span class="text-red-300 mt-2"
                    >The max amount of characters is 280</span
                  >
                }
                @if (form.controls.text.touched || form.controls.text.dirty) {
                  <div class="flex self-end ">
                    <button
                      type="reset"
                      (click)="form.reset()"
                      class="h-7 min-w-fit p-auto px-3 bg-white text-gray-400 border-2 border-gray-200 hover:text-black hover:border-brandViolet active:scale-95  mt-4 font-medium self-end mr-4"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      [disabled]="form.invalid"
                      class="h-7 min-w-fit py-auto px-3 bg-brandViolet text-white border-2 border-transparent hover:border-brandViolet hover:text-brandViolet hover:bg-white active:scale-95  mt-4 font-medium box-border"
                    >
                      Comment
                    </button>
                  </div>
                }
              </form>
            }

            @for (item of comments; track $index) {
              <ng-container *ngIf="!item.deletedByUser">
                <div class="flex flex-col mt-4">
                  <div class="flex justify-between items-center">
                    <div>
                      <span class="font-medium text-[1.2rem]"
                        >{{ item.username }}
                      </span>
                      <span>{{ item.date.toDate() | date: 'MM/dd/yyyy' }}</span> 
                    </div>
                    @if (item.uid === uid()) {
                      <button (click)="onCommentDelete(item.commentId!)">
                        <svg
                          viewBox="0 0 24 24"
                          class="stroke-slate-500 fill-none stroke-2 h-6 hover:stroke-none hover:fill-brandViolet active:scale-75"
                        >
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
              </ng-container>
            }
          }
        </section>

        <section class="self-start h-fit lg:self-center  lg:w-1/3 2xl:w-1/4 w-full mb-6 p-2 lg:p-0">
          <hr>
          @if(recommendations$ | async; as recommendations){
            <span class="text-[1.3rem] font-bold"
              >More from {{category()}}</span
            >
            <div class="grid grid-cols-3 w-full">
              @for(item of recommendations.slice(1,recommendations.length-1); track $index){
                <div>{{item.heading}}</div>
              }
            </div>
          }
        </section>
      </article>

    } @else {
      <p>Loading...</p>
    }
  `,
  styles: [
    `
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
        font-weight: 700;
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
    `,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SingleArticleComponent implements AfterViewInit, OnInit {
  firebaseService = inject(FirebaseService);
  id = input.required<string>();
  title = inject(Title);

  renderer = inject(Renderer2);
  @ViewChildren('htmlContent') htmlElements?: QueryList<
    ElementRef<HTMLParagraphElement> | ElementRef<HTMLElement>
  >;
  
  @ViewChild('domHeading') domHeading?:ElementRef;
  ngOnInit(): void {
    document.addEventListener('scroll', () => {
      this.headingCheck()
    })  
  }
  headingInfo = model('')
  headingCheck(){
    const top = this.domHeading?.nativeElement.getBoundingClientRect().top
    const height = this.domHeading?.nativeElement.getBoundingClientRect().height

    if(top <= -height*.45){
      this.headingInfo.set(this.heading()?.heading!)
    } else{
      this.headingInfo.set('')

    }

  }

  ngAfterViewInit(): void {
    this.htmlElements?.changes.subscribe(
      (
        query: QueryList<
          ElementRef<HTMLParagraphElement> | ElementRef<HTMLElement>
        >,
      ) => {
        query.forEach((item) => {
          const unparsedString = item.nativeElement.innerText;

          const parser = new DOMParser();
          const doc = parser.parseFromString(unparsedString, 'text/html');
          this.renderer.setProperty(
            item.nativeElement,
            'innerHTML',
            doc.body.innerHTML,
          );
        });
      },
    );
  }

  menu:boolean = false;


  authUser$ = this.firebaseService.authState$;

  formBuilder = inject(NonNullableFormBuilder);
  form = this.formBuilder.group({
    text: this.formBuilder.control('', {
      validators: [
        Validators.maxLength(250),
        Validators.required,
        this.trimValidator,
      ],
    }),
  });

  uid = model<string>();
  userInfo = model<FirestoreCollectionUser>();
  userInfo$: Observable<FirestoreCollectionUser> = this.authUser$.pipe(
    map((auth: null | FirebaseAuthUser) => {
      if (!auth) return false;
      else return auth;
    }),
    switchMap((auth: FirebaseAuthUser) => {
      this.uid.set(auth.uid);

      return this.firebaseService.getUserInfo(auth.uid).pipe(
        map((res: FirestoreCollectionUser) => {
          this.userInfo.set(res);
          return res;
        }),
      );
    }),
  );

  data$ = toObservable(this.id).pipe(
    map((url: string) => {
      const id = url.split('-');
      return id[0];
    }),
    switchMap((id) => this.firebaseService.getSingleArticle(id).pipe(
      map((res:Article)=>{
        this.category.set(res.category)
        return res
      })
    )),
  );

  category = model<string>('')
  articleRecommendationIndex = model<number>()
  recommendations$ = toObservable(this.category).pipe(
    switchMap(category=> this.firebaseService.getMainCategoryArticles(category).pipe(
      map((res:Article[])=>{
        this.articleRecommendationIndex.set(Math.round((Math.random()*10)*((res.length-1)/10)))
        return res
      })
    ))
  )

  heading = toSignal(this.data$);

  comments$ = toObservable(this.id).pipe(
    map((url: string) => {
      const id = url.split('-');
      return id[0];
    }),
    switchMap((id) => this.firebaseService.getArticleComments(id)),
  );


  constructor() {
    effect(() => {
      this.title.setTitle(this.heading()?.heading!);
    });
  }

  onCommentSubmit() {
    const formValues = this.form.getRawValue();

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
            this.form.reset();
          },
          error: (err) => console.error(err), // Maneja posibles errores
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

  trimValidator(control: AbstractControl) {
    return control.value.trim() ? null : { blankText: true };
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