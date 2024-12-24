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
import { MainGridComponent } from '../grids/main-grid/main-grid.component';
import { SecondaryGridComponent } from '../grids/secondary-grid/secondary-grid.component';
import { StandardGridComponent } from '../grids/standard-grid/standard-grid.component';
import { Secondary2GridComponent } from "../grids/secondary2-grid/secondary2-grid.component";
import { Secondary3GridComponent } from '../grids/secondary3-grid/secondary3-grid.component';

@Component({
  selector: 'app-home-articles',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, AsyncPipe, OrderArticlesByDatePipe, NgClass, MainGridComponent, SecondaryGridComponent, Secondary2GridComponent, Secondary3GridComponent, StandardGridComponent],
  template: `
    @if (articles()) {
      <main class="flex flex-col items-center min-h-screen relative w-full">
        
        <section class="h-fit w-full">
          <app-main-grid [highArticle]="(articles()!| orderArticlesByDate).slice(0,1)" 
          [mediumArticles]="(articles()! | orderArticlesByDate).slice(1,4)"/>
        </section>
        
        <section class=" w-full h-fit pt-24 flex flex-col items-center">
          <a [routerLink]="['/category/tech']"
              class=" pl-20 text-[5rem] font-bold text-brandViolet self-start underline hover:text-brandShade active:scale-95 mb-10 block w-fit">
                Tech
          </a>

          <section class=" w-[85%] h-fit">
            <app-secondary-grid [articles]="(articles()!| orderArticlesByDate).slice(4,11)"/>
          </section>
        </section>

        <section class=" w-full h-fit pt-24 flex flex-col items-center">
          <a [routerLink]="['/category/entertainment']"
              class=" pl-20 text-[5rem] font-bold text-brandViolet self-start underline hover:text-brandShade active:scale-95 mb-10 block w-fit">
                Entertainment
          </a>

          <section class=" w-[90%] h-fit">
          <app-secondary2-grid [articles]="(articles()! | orderArticlesByDate).slice(10,18)!"/>
        </section>

        </section>
        
        <section class=" w-full h-fit pt-24 flex flex-col items-center">
          <a [routerLink]="['/category/media']"
              class=" pl-20 text-[5rem] font-bold text-brandViolet self-start underline hover:text-brandShade active:scale-95 mb-[4rem] block w-fit">
                Media
          </a>

          <section class=" w-[80%] h-fit">
            <app-secondary3-grid [articles]="(articles()! | orderArticlesByDate).slice(18,22)!"/>
          </section>

        </section>

        <!-- <section class=" lg:w-3/5 w-full pt-6">
        @for(item of articles(); track $index; let i = $index){
          <a
              class="bg-slate-200"
              [routerLink]="[
                '/article',
                urlFormat(item.articleID!, item.heading),
              ]"
            >
              <h4 [ngClass]="item.subscription ? 'text-red-400' : ''">{{ item.heading }}</h4>
              <img
                [src]="item.frontImage"
                alt="front image of {{ item.heading }}"
                class="w-[10rem] aspect-[3/2] object-cover h-fit"
              />
            </a>
        }
        </section> -->
        
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
    const res = setDoc(doc(ref,'media3'), {});
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
