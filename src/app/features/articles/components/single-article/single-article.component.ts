import {
  Component,
  effect,
  inject,
  input,
  model,
  ModelSignal,
  OnDestroy,
  OnInit,
  Signal,
  signal,
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
  ],
  template: `
    @if (data$ | async; as data) {
      @if (!data.subscription || (subscriptionStatus$ | async)) {
        <article
          class="w-full  min-h-screen relative flex flex-col items-center  "
        >
          <section class=" w-full flex  flex-col items-center ">
            <!-- <h1 class="absolute text-white font-bold font text-[3rem] left-[50%] -translate-x-1/2 text-center bg-black">{{ data.heading }}</h1> -->

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
              <h1
                class=" font-bold font text-[1.8rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] lg:w-1/2 p-2 lg:p-0 text-left lg:my-4"
              >
                {{ data.heading }}
              </h1>
            }
          </section>

          <section class="w-full lg:w-1/2 lg:p-0 p-3">
            @for (item of data.content; track $index) {
              @if ((item | typeof) == 'paragraph') {
                <p class="m-7 mx-0 text-[1.2rem]">
                  {{ $any(item).paragraph }}
                </p>
              }
              @if ((item | typeof) == 'quote') {
                <blockquote class="m-12 mx-0 w-5/6 sm:w-2/3 text-[1.3rem] ">
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
                <h3 class="font-bold">
                  {{ $any(item).title }}
                </h3>
              }
              @if ((item | typeof) == 'subtitle') {
                <h4 class="font-medium">
                  {{ $any(item).subtitle }}
                </h4>
              }
            }
            <hr />
          </section>

          <section class="self-start h-fit lg:self-center lg:w-1/2 mt-6">
            @if (comments$ | async | orderByDate; as comments) {
              <span class="text-[1.3rem] font-bold "
                >{{ comments.length }} Comments</span
              >
              @for (item of comments; track $index) {
                <ng-container *ngIf="!item.deletedByUser">
                  <div class="flex flex-col mt-4">
                    <div>
                      <span class="font-medium text-[1.2rem]"
                        >{{ item.username }}
                      </span>
                      <span> {{ item.date | timestampConvert }} </span>
                    </div>
                    <span></span>
                    <p class="text-[1.1rem]">{{ item.content }}</p>
                  </div>
                </ng-container>
              }
            }
            <div class="h-10"></div>
          </section>
        </article>
      }

      @if (!(authUser$ | async) || !(subscriptionStatus$ | async)) {
        <article
          class="w-full  min-h-screen relative flex flex-col items-center  "
        >
          <section class=" w-full flex  flex-col items-center ">
            <!-- <h1 class="absolute text-white font-bold font text-[3rem] left-[50%] -translate-x-1/2 text-center bg-black">{{ data.heading }}</h1> -->

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
              <h1
                class=" font-bold font text-[1.8rem] md:text-[2rem] lg:text-[2.5rem] xl:text-[3rem] lg:w-1/2 p-2 lg:p-0 text-left lg:my-4"
              >
                {{ data.heading }}
              </h1>
            }
          </section>

          <section class="w-full lg:w-1/2 lg:p-0 p-3">
            @for (item of data.contentPreview; track $index) {
              @if ((item | typeof) == 'paragraph') {
                <p class="m-7 mx-0 text-[1.2rem]">
                  {{ $any(item).paragraph }}
                </p>
              }
              @if ((item | typeof) == 'quote') {
                <blockquote class="m-12 mx-0 w-5/6 sm:w-2/3 text-[1.3rem] ">
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
                <h3 class="font-bold">
                  {{ $any(item).title }}
                </h3>
              }
              @if ((item | typeof) == 'subtitle') {
                <h4 class="font-medium">
                  {{ $any(item).subtitle }}
                </h4>
              }
            }
          </section>

          <section class="w-full relative">
            <div
              class="w-1/3 h-52 absolute z-10 bg-white left-[50%] -translate-x-1/2 bottom-0 mb-12 flex flex-col  items-center py-6  rounded-xl"
            >
              <img src="agora-logo.svg" class="h-12 mt-1" />
              <span class="text-[1.1rem] mt-3">This content is exclusive for subscribers</span>
              <div class="flex items-end flex-grow">
                <a routerLink="/subscription" class="bg-brandRed w-fit p-3 h-12 rounded-lg text-[1.1rem] font-medium ">Subscribe for <b>$0</b> </a>
              </div>
            </div>
            <div
              class="bg-gradient-to-t w-full h-96 from-black absolute bottom-0"
            ></div>
          </section>
        </article>
      }
    } @else {
      <p>Loading...</p>
    }
  `,
})
export class SingleArticleComponent implements OnInit {
  firebaseService = inject(FirebaseService);
  id = input.required<string>();
  title = inject(Title);

  authUser$ = this.firebaseService.authState$;

  subscriptionStatus$: Observable<Boolean> = this.authUser$.pipe(
    map((auth: null | FirebaseAuthUser) => {
      if (!auth) return false;
      else return auth;
    }),
    switchMap((auth: FirebaseAuthUser) => {
      return this.firebaseService.checkSubscription(auth.uid).pipe(
        map((res: FirestoreCollectionUser) => {
          return res.subscription;
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

  // -------------------- vuelve a calcularse en cualquier deteccion de cambios
  // typeCheck(item : contentItems){
  //   if('paragraph' in item) return 'paragraph'
  //   if('quote' in item) return 'quote'
  //   if('imageUrl' in item) return 'image'
  //   if('title' in item) return 'title'
  //   if('subtitle' in item) return 'subtitle'
  //   return false
  // }

  ngOnInit(): void {
    // this.data$.subscribe(res=>{
    //   this.title.setTitle(res.heading)
    // })
  }
}
