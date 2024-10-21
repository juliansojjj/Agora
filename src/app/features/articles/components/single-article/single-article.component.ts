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
import { NgIf, AsyncPipe, NgClass } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { DocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { DataSnapshot } from '@angular/fire/database';
import { Title } from '@angular/platform-browser';
import { TypeofPipe } from '../../pipes/typeof.pipe';
import { TimestampConvertPipe } from '../../pipes/timestamp-convert.pipe';
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

@Component({
  selector: 'app-single-article',
  standalone: true,
  imports: [
    NgIf,
    AsyncPipe,
    TypeofPipe,
    NgClass,
    TimestampConvertPipe,
    OrderByDatePipe,
    RouterLink,
    ReactiveFormsModule,
    TextAreaResizeDirective,
    CommentsLengthPipe,
    RouterLink,
  ],
  template: `
    @if (data$ | async; as data) {
      @if (!data.subscription || (userInfo$ | async)?.subscription) {
        <article
          class="w-full  min-h-screen relative flex flex-col items-center  "
        >
          <section class=" w-full flex  flex-col items-center ">
            @if (data.frontImageBanner) {
              <img
                src="{{ data.frontImage }}"
                alt="{{ data.frontImageAlt }}"
                class="relative w-full object-cover"
              />
            } @else {
              <img
                src="{{ data.frontImage }}"
                alt="{{ data.frontImageAlt }}"
                class="relative w-full lg:w-1/2 object-cover"
              />
              <span class="lg:w-1/2 self-start lg:self-center mb-2">{{
                data.frontImageAlt
              }}</span>

              <div
                class="lg:w-1/2 p-2 lg:p-0 lg:my-4 flex justify-between items-start"
              >
                <div>
                  <h1
                    class=" font-bold text-[1.8rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] text-left mb-4"
                  >
                    {{ data.heading }}
                  </h1>
                  <span class="text-[1.1rem]"
                    >Original source
                    <a
                      [href]="data.source"
                      class="font-bold no-underline text-brandRed hover:bg-brandRed hover:p-[.1rem] hover:text-white"
                      >here</a
                    ></span
                  >
                </div>

                @if (
                  (userInfo$ | async)?.favorites?.includes(id().split('-')[0])
                ) {
                  <button (click)="favoriteHandle(false)">
                    <svg viewBox="0 0 28 28" class=" h-8 mt-2 fill-black">
                      <g>
                        <path
                          d="M9.25 3.5C7.45507 3.5 6 4.95507 6 6.75V24.75C6 25.0348 6.16133 25.2951 6.41643 25.4217C6.67153 25.5484 6.97638 25.5197 7.20329 25.3475L14 20.1914L20.7967 25.3475C21.0236 25.5197 21.3285 25.5484 21.5836 25.4217C21.8387 25.2951 22 25.0348 22 24.75V6.75C22 4.95507 20.5449 3.5 18.75 3.5H9.25Z"
                        ></path>
                      </g>
                    </svg>
                  </button>
                } @else if (userInfo$ | async) {
                  <button (click)="favoriteHandle(true)">
                    <svg
                      viewBox="0 0 28 28"
                      class=" h-8 mt-2 stroke-black stroke-[2.3] fill-none "
                    >
                      <g>
                        <path
                          d="M9.25 3.5C7.45507 3.5 6 4.95507 6 6.75V24.75C6 25.0348 6.16133 25.2951 6.41643 25.4217C6.67153 25.5484 6.97638 25.5197 7.20329 25.3475L14 20.1914L20.7967 25.3475C21.0236 25.5197 21.3285 25.5484 21.5836 25.4217C21.8387 25.2951 22 25.0348 22 24.75V6.75C22 4.95507 20.5449 3.5 18.75 3.5H9.25Z"
                        ></path>
                      </g>
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
                    <svg
                      viewBox="0 0 28 28"
                      class=" h-8 mt-2 stroke-black stroke-[2.3] fill-none"
                    >
                      <g>
                        <path
                          d="M9.25 3.5C7.45507 3.5 6 4.95507 6 6.75V24.75C6 25.0348 6.16133 25.2951 6.41643 25.4217C6.67153 25.5484 6.97638 25.5197 7.20329 25.3475L14 20.1914L20.7967 25.3475C21.0236 25.5197 21.3285 25.5484 21.5836 25.4217C21.8387 25.2951 22 25.0348 22 24.75V6.75C22 4.95507 20.5449 3.5 18.75 3.5H9.25Z"
                        ></path>
                      </g>
                    </svg>
                  </a>
                }
              </div>
            }
          </section>

          <section class="w-full lg:w-1/2 lg:p-0 p-3">
            <hr />
            @for (item of data.content; track $index) {
              @if ((item | typeof) == 'paragraph') {
                <p class="m-7 mx-0 text-[1.2rem]">
                  {{ $any(item).paragraph }}
                </p>
              }
              @if ((item | typeof) == 'htmlParagraph') {
                <p class="m-7 mx-0 text-[1.2rem]" #htmlContent>
                  {{ $any(item).htmlParagraph }}
                </p>
              }
              @if ((item | typeof) == 'htmlContent') {
                <div #htmlContent>
                  {{ $any(item).htmlContent }}
              </div>
              }
              @if ((item | typeof) == 'quote') {
                <blockquote class="m-12 mx-0 w-5/6 sm:w-2/3 text-[1.3rem] border-l-[2px] rounded-md border-black pl-7">
                  <i> {{ $any(item).quote }} </i>
                </blockquote>
              }
              @if ((item | typeof) == 'image') {
                <ng-container>
                  <div class="m-12 mx-0">
                    <img
                      src="{{ $any(item).imageUrl }}"
                      alt="{{ $any(item).imageAlt }} "
                    />
                    <span>{{ $any(item).imageAlt }}</span>
                  </div>
                </ng-container>
              }
              @if ((item | typeof) == 'title') {
                <h3 class="font-bold text-[1.9rem] mt-12">
                  {{ $any(item).title }}
                </h3>
              }
              @if ((item | typeof) == 'subtitle') {
                <h4 class="font-bold text-[1.5rem] mt-4 -mb-4">
                  {{ $any(item).subtitle }}
                </h4>
              }
            }
            <hr />
          </section>

          <section
            class="self-start h-fit lg:self-center lg:w-1/2 w-full mt-6 mb-6 p-2 lg:p-0"
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
                        (click)="form.reset()"
                        class="w-fit p-[.35rem] px-3 border-2 text-slate-500 border-slate-100 active:bg-slate-100 active:scale-95 rounded-lg mt-4 font-medium self-end mr-4"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        [disabled]="form.invalid"
                        class="w-fit p-[.35rem] px-3  bg-brandRed text-white active:bg-red-900 active:scale-95 rounded-lg mt-4 font-medium"
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
                        <span> {{ item.date | timestampConvert }} </span>
                      </div>
                      @if (item.uid === uid()) {
                        <button (click)="onCommentDelete(item.commentId!)">
                          <svg
                            viewBox="0 0 24 24"
                            class="stroke-slate-500 fill-none stroke-2 h-6 hover:stroke-none hover:fill-brandRed active:scale-75"
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
            <div class="h-10"></div>
          </section>
        </article>
      } @else if (!(authUser$ | async) || !(userInfo$ | async)?.subscription) {
        <article
          class="w-full  min-h-screen relative flex flex-col items-center  "
        >
          <section class=" w-full flex  flex-col items-center ">
            @if (data.frontImageBanner) {
              <img
                src="{{ data.frontImage }}"
                alt="{{ data.frontImageAlt }}"
                class="relative w-full object-cover"
              />
            } @else {
              <img
                src="{{ data.frontImage }}"
                alt="{{ data.frontImageAlt }}"
                class="relative w-full lg:w-1/2 object-cover"
              />
              <span
                class="lg:w-1/2 self-start lg:self-center mb-2 p-2 lg:p-0"
                >{{ data.frontImageAlt }}</span
              >
              <div class="lg:w-1/2 p-2 lg:p-0 flex items-start">
              <h1
                class=" font-bold text-[1.8rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem]  text-left lg:mb-4"
              >
                {{ data.heading }}
              </h1>
              <a
                    [routerLink]="['/login']"
                    [queryParams]="{
                      redirect: 'article-' + id().split('-')[0],
                    }"
                    class="hover:bg-transparent hover:p-0"
                  >
                    <svg
                      viewBox="0 0 28 28"
                      class=" h-8 mt-4 stroke-black stroke-[2.3] fill-none"
                    >
                      <g>
                        <path
                          d="M9.25 3.5C7.45507 3.5 6 4.95507 6 6.75V24.75C6 25.0348 6.16133 25.2951 6.41643 25.4217C6.67153 25.5484 6.97638 25.5197 7.20329 25.3475L14 20.1914L20.7967 25.3475C21.0236 25.5197 21.3285 25.5484 21.5836 25.4217C21.8387 25.2951 22 25.0348 22 24.75V6.75C22 4.95507 20.5449 3.5 18.75 3.5H9.25Z"
                        ></path>
                      </g>
                    </svg>
                  </a>
                  </div>
              <span class="lg:w-1/2 w-full text-start mb-4 p-2 lg:p-0 text-[1.1rem]"
                >Original source
                <a
                  [href]="data.source"
                  class="font-bold no-underline text-brandRed hover:bg-brandRed hover:p-[.1rem] hover:text-white "
                  >here</a
                ></span
              >
            }
            <hr />
          </section>

          <section class="w-full lg:w-1/2 lg:p-0 p-3">
            <hr />
            @for (item of data.contentPreview; track $index) {
              @if ((item | typeof) == 'paragraph') {
                <p class="m-7 mx-0 text-[1.2rem]">
                  {{ $any(item).paragraph }}
                </p>
              }
              @if ((item | typeof) == 'htmlParagraph') {
                <p class="m-7 mx-0 text-[1.2rem]" #htmlContent>
                  {{ $any(item).htmlParagraph }}
                </p>
              }
              @if ((item | typeof) == 'quote') {
                <blockquote class="m-12 mx-0 w-5/6 sm:w-2/3 text-[1.3rem] border-l-[2px] rounded-md border-black pl-7">
                  <i> {{ $any(item).quote }} </i>
                </blockquote>
              }
              @if ((item | typeof) == 'image') {
                <ng-container>
                  <div class="m-12 mx-0">
                    <img
                      src="{{ $any(item).imageUrl }}"
                      alt="{{ $any(item).imageAlt }} "
                    />
                    <span>{{ $any(item).imageAlt }}</span>
                  </div>
                </ng-container>
              }
              @if ((item | typeof) == 'title') {
                <h3 class="font-bold text-[1.9rem] mt-12">
                  {{ $any(item).title }}
                </h3>
              }
              @if ((item | typeof) == 'subtitle') {
                <h4 class="font-bold text-[1.5rem] mt-4 -mb-4">
                  {{ $any(item).subtitle }}
                </h4>
              }
            }
          </section>

          <section class="w-full relative">
            <div
              class="flex flex-col lg:w-1/3 w-full h-fit absolute  bottom-0 lg:mb-20 z-10  left-[50%] -translate-x-1/2 items-center justify-end pt-6  lg:rounded-xl rounded-none bg-white"
            >
              <div class="flex flex-col h-fit pb-4">
                <img src="agora-logo.svg" class="h-12 mt-1" />
                <span class="text-[1.2rem] mt-3 text-center"
                  >This content is exclusive for subscribers</span
                >
              </div>

              <div class="relative w-full  flex items-end lg:h-fit h-44 ">
                <a
                  routerLink="/subscription"
                  class="bg-brandRed text-white hover:p-3 hover:text-black w-44 p-3 h-12 rounded-lg text-[1.1rem] text-center font-medium absolute left-[50%] -translate-x-1/2 top-[50%] -translate-y-1/2 z-10  active:scale-[95%]"
                  >Subscribe for <b>$0</b>
                </a>
                <img
                  src="sub-banner.jpg"
                  class=" relative object-cover w-full lg:h-20  h-full lg:rounded-b-xl rounded-none grayscale brightness-50"
                  alt="Photo by Marvin Meyer on Unsplash"
                />
              </div>
            </div>

            <div
              class="bg-gradient-to-t w-full h-96 from-black absolute bottom-0 lg:mb-0 mb-24"
            ></div>

          </section>
        </article>
      }
    } @else {
      <p>Loading...</p>
    }
  `,
  styles: [`
    a {
      font-weight: 700;
      color: #FD7E7E; 
    }
    a:hover {
      color: #ffffff; 
      background-color:#FD7E7E;
      padding: .1rem 0 .1rem 0;
    }
`],
  encapsulation: ViewEncapsulation.None
})
export class SingleArticleComponent implements AfterViewInit {
  firebaseService = inject(FirebaseService);
  id = input.required<string>();
  title = inject(Title);

  renderer = inject(Renderer2);
  @ViewChildren('htmlContent') htmlElements?: QueryList<
    ElementRef<HTMLParagraphElement>|ElementRef<HTMLElement>
  >;

  ngAfterViewInit(): void {
    this.htmlElements?.changes.subscribe(
      (query: QueryList<ElementRef<HTMLParagraphElement>|ElementRef<HTMLElement>>) => {
        query.forEach((item) => {
          const unparsedString = item.nativeElement.innerText;

          const parser = new DOMParser();
          const doc = parser.parseFromString(unparsedString, 'text/html');

          this.renderer.setProperty(item.nativeElement, 'innerHTML',doc.body.innerHTML);
          console.log(item)
          console.log(doc.body)
        });
      },
    );
  }

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
          console.log(res);
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
    switchMap((id) => this.firebaseService.getSingleArticle(id)),
  );

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
      const articleId = this.id().split('-');

      this.firebaseService
        .addComment(
          this.userInfo()?.username!,
          this.uid()!,
          articleId[0],
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
    const articleId = this.id().split('-');

    if (commentId) {
      this.firebaseService.deleteComment(articleId[0], commentId);
    }
  }

  favoriteHandle(operation: boolean) {
    const articleId = this.id().split('-');

    this.firebaseService.handleFavorite(this.uid()!, operation, articleId[0]);
  }

  trimValidator(control: AbstractControl) {
    return control.value.trim() ? null : { blankText: true };
  }
}
