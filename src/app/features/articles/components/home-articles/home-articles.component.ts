import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  model,
  ModelSignal,
  QueryList,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { Article, paragraph } from '../../../../shared/interfaces/article.interface';
import { NgFor, NgIf, AsyncPipe, NgClass } from '@angular/common';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  collection,
  doc,
  serverTimestamp,
  Timestamp,
  setDoc,
} from '@angular/fire/firestore';
import { child, set } from '@angular/fire/database';
import { OrderByDatePipe } from '../../pipes/order-by-date.pipe';
import { OrderArticlesByDatePipe } from '../../pipes/order-articles-by-date.pipe';

@Component({
  selector: 'app-home-articles',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, AsyncPipe, OrderArticlesByDatePipe, NgClass],
  template: `
    @if (articles()) {
      <main class="flex flex-col items-center">
        <button (click)="docUpload()">SUBIR DOC</button>

        <section class="grid grid-cols-3 grid-rows-1 gap-5 lg:w-1/2 h-full place-items-center pt-4 bg-blue-100">
          
          <div class="grid grid-cols-1 grid-rows-2 gap-2">
          @for(item of (mediumPriorArticles() | orderArticlesByDate).slice(0,2); track $index; let i = $index){
          <a
              class="bg-slate-200"
              [routerLink]="[
                '/article',
                urlFormat(item.articleId!, item.heading),
              ]"
            >
              <h4>{{ item.heading }}</h4>
              <img
                [src]="item.frontImage"
                alt="front image of {{ item.heading }}"
                class="w-[10rem] aspect-[3/2] object-cover"
              />
            </a>
        }
          </div>

          <div>
          @for(item of highPriorArticles().slice(0,1); track $index; let i = $index){
          <a
              class="bg-slate-200 h-full"
              [routerLink]="[
                '/article',
                urlFormat(item.articleId!, item.heading),
              ]"
            >
              <h4>{{ item.heading }}</h4>
              <img
                [src]="item.frontImage"
                alt="front image of {{ item.heading }}"
                class="w-[10rem] aspect-[3/2] object-cover"
              />
            </a>
        }
            
          </div>


          <div class="grid grid-cols-1 grid-rows-2 gap-2">
          @for(item of mediumPriorArticles().slice(2,4); track $index; let i = $index){
          <a
              class="bg-slate-200"
              [routerLink]="[
                '/article',
                urlFormat(item.articleId!, item.heading),
              ]"
            >
              <h4>{{ item.heading }}</h4>
              <img
                [src]="item.frontImage"
                alt="front image of {{ item.heading }}"
                class="w-[10rem] aspect-[3/2] object-cover"
              />
            </a>
        }
          </div>
        </section>
        <section class="h-24 bg-red-200 lg:w-1/2 ">
        @for(item of articles(); track $index; let i = $index){
          <a
              class="bg-slate-200"
              [routerLink]="[
                '/article',
                urlFormat(item.articleId!, item.heading),
              ]"
            >
              <h4 [ngClass]="item.subscription ? 'text-red-400' : ''">{{ item.heading }}</h4>
              <img
                [src]="item.frontImage"
                alt="front image of {{ item.heading }}"
                class="w-[10rem] aspect-[3/2] object-cover"
              />
            </a>
        }
        </section>
      </main>
    } @else {
      <ng-template [ngIf]="errorMessage">
        <span class="whitespace-pre-line text-left">ERROR</span>
      </ng-template>
    }
  `,
})
export class HomeArticlesComponent {
  firebaseService = inject(FirebaseService);

  highPriorArticles = model<Article[]>([]);
  mediumPriorArticles = model<Article[]>([]);
  lowPriorArticles = model<Article[]>([]);

  articles = toSignal<Article[]>(
    this.firebaseService.getLandingArticles().pipe(
      map((res) => {
        res.forEach((art: Article) => {
          if (art.priority == 'high') {
            this.highPriorArticles.update((value) =>
              value ? [...value, art] : [art],
            );
          } else if (art.priority == 'medium') {
            this.mediumPriorArticles.update((value) =>
              value ? [...value, art] : [art],
            );
          } else {
            this.lowPriorArticles.update((value) =>
              value ? [...value, art] : [art],
            );
          }
        });
        return res;
      }),
    ),
  );

  errorMessage!: string;

  docUpload() {
    const ref = collection(this.firebaseService.firestoreService, 'articles');
    const res = setDoc(doc(ref), {
      authorID: 'ChaseDiBenedetto',
      authorName: 'Chase DiBenedetto',
      available: true,
      category: 'tech',
      content: [
        {paragraph:`Apple's "Glowtime" event kicked off with a dramatic unveiling of its new, sleeker Apple Watch Series 10, complete with new display, sound, and even health features.`},
        {htmlParagraph:`Wedged within announcements of a slimmer screen and new watch faces was a brand new, "breakthrough" health sensor that can monitor and alert users who may suffer from sleep apnea, a condition affecting approximately <a href="https://www.thelancet.com/journals/lanres/article/PIIS2213-2600(19)30198-5/abstract">1 billion people worldwide</a>.`},
        {htmlParagraph:`The sleep apnea monitor utilizes the device's <a href="https://developer.apple.com/design/human-interface-guidelines/gyro-and-accelerometer">accelerometer</a>, which detects "real-time, motion-based" data to monitor when a user is having a period of disturbed or restless sleep. Combined with other real time health sensors, the watch will then notify wearers if it detects "consistent signs of moderate to severe sleep apnea," as well as resources for consulting a physician.  `},
        {paragraph:`It will be accessible on Apple Watch Series 10, Series 9, and Ultra 2.`},
        {htmlParagraph:`Bloomberg's Mark Gurman first <a href="https://x.com/markgurman/status/1832052102790795633">leaked the announcement</a> before the company's big event, but rumors of the feature have been circulating since last year. At that time, industry insiders believed the Apple Watch could be expanding its health sensors to cover not just sleep apnea, but also diabetes and blood pressure monitoring. It appears mastering sleep is the device's first frontier.`},
        {paragraph:`Apple says it's new feature will receive full approval from the FDA and other regulatory bodies soon, and will be available across 150 countries and regions this month, including the U.S., Europe, and Japan.`},
        {paragraph:`In February, Samsung introduced the first FDA-approved sleep apnea tracker for its new Galaxy Watch series.`},

      ],
      contentPreview:[],
      date: Timestamp.fromDate(new Date('2024-09-09T00:51:00-07:00')),
      frontImage:
        'https://helios-i.mashable.com/imagery/articles/04xsZ2rfrCGpo5LqWqmBOfK/hero-image.fill.size_1248x702.v1725903596.png',
      frontImageAlt: `Apple Watch Series 9,10, and Ultra 2 set to unveil new sleep tracking health feature. Credit: Apple`,
      frontImageBanner: false,
      heading: 'Apple Watch Series 10 introduces a new sleep apnea feature',
      subheading: 'Track nighttime breathing with the updated wearable.',
      priority: 'low',
      source: 'https://mashable.com/article/apple-watch-series-10-sleep-apnea-health-monitor-announced?test_uuid=01iI2GpryXngy77uIpA3Y4B&test_variant=a',
      subscription: false,
      topics:['Apple', 'Apple watch', 'Health', 'social']
    });
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

//TODO: LOADING SCREEN
///[^A-Za-z0-9-._~:/?#\[\]@!$&'()*+,;=]+/g
