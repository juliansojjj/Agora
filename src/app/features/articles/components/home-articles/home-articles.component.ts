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
      <main class="flex flex-col items-center h-fit relative w-full">
        @if(techArticles()){
        <section class="h-fit w-full">
          <app-main-grid [highArticle]="techArticles()!.slice(0,1)" 
          [mediumArticles]="techArticles()!.slice(1,4)"/>
        </section>
        }
 
    @if(scienceArticles()){
        <section class=" w-full h-fit pt-24 flex flex-col items-center">
          <a [routerLink]="['/category/science']"
              class="pl-3 sm:pl-10 md:pl-20 text-[2.3rem] xsm:text-[3rem] sm:text-[4rem] md:text-[5rem] font-bold text-brandViolet self-start underline hover:text-brandShade active:scale-95 mb-6 block w-fit">
                Science
          </a>

          <section class=" w-[85%] h-fit">
            <app-secondary-grid [articles]="scienceArticles()!"/>
          </section>
        </section>
        }
        
        @if(entertainmentArticles()){
        <section class=" w-full h-fit pt-24 flex flex-col items-center">
          <a [routerLink]="['/category/entertainment']"
              class="pl-3 sm:pl-10 md:pl-20 text-[2.3rem] xsm:text-[3rem] sm:text-[4rem] md:text-[5rem] font-bold text-brandViolet self-start underline hover:text-brandShade active:scale-95 mb-10 block w-fit">
                Entertainment
          </a>

          <section class=" w-[90%] h-fit">
          <app-secondary2-grid [articles]="entertainmentArticles()!"/>
          </section>
        </section>
        }

        @if(mediaArticles()){
        <section class=" w-full h-fit pt-24 flex flex-col items-center">
          <a [routerLink]="['/category/media']"
              class="pl-3 sm:pl-10 md:pl-20 text-[2.3rem] xsm:text-[3rem] sm:text-[4rem] md:text-[5rem] font-bold text-brandViolet self-start underline hover:text-brandShade active:scale-95 mb-[4rem] block w-fit">
                Media
          </a>

          <section class=" w-[80%] h-fit">
            <app-secondary3-grid [articles]="mediaArticles()!"/>
          </section>
        </section>
        }
      </main>
  `,
})
export class HomeArticlesComponent {
  firebaseService = inject(FirebaseService);

  techArticles = toSignal<Article[]>(
    this.firebaseService.getMainCategoryArticles('tech',4)
  );
  scienceArticles = toSignal<Article[]>(
    this.firebaseService.getMainCategoryArticles('science',7)
  );
  entertainmentArticles = toSignal<Article[]>(
    this.firebaseService.getMainCategoryArticles('entertainment',8)
  );
  mediaArticles = toSignal<Article[]>(
    this.firebaseService.getMainCategoryArticles('media',4)
  );
  

  docUpload() {
    const ref = collection(this.firebaseService.firestoreService, 'articles');
    const res = setDoc(doc(ref,'media3'), {});
  }


  urlFormat(id: string, title: string) {
    const formatTitle = title
      .split(' ')
      .join('-')
      .replace(/[^A-Za-z0-9-._~:/?#\[\]@!$&'()*+]+/g, '')
      .toLowerCase();
    return `${id}-${formatTitle}`;
  }
}
