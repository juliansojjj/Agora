import { Component, inject, input, Input, model, numberAttribute, OnInit } from '@angular/core';
import { Article, title } from '../../../../shared/interfaces/article.interface';
import { catchError, EMPTY, map, Observable, Subscription, switchMap, take } from 'rxjs';
import { NgFor, NgIf, AsyncPipe, NgClass } from '@angular/common';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
} from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { Category } from '../../../../shared/interfaces/category.interface';
import { ExtStandardGridComponent } from '../grids/standard-grid/ext-standard-grid/ext-standard-grid.component';
import { OrderArticlesByDatePipe } from '../../pipes/order-articles-by-date.pipe';

@Component({
  selector: 'app-category-articles',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, AsyncPipe, NgClass, ExtStandardGridComponent, OrderArticlesByDatePipe],
  template: `
      <div class="relative mt-[2rem]">
        
        @if(category() && !category()?.main){
          <div class="absolute w-full h-fit top-0 left-0 xl:grid hidden grid-cols-[9%_82%_9%]">
            <div class="aspect-square bg-brandShade w-[6rem] triangleShape justify-self-end"></div>
            <div class="justify-self-end flex w-fit">
              <div class="aspect-square bg-brandShade w-[6rem] h-[6rem] mt-[6rem]"></div>
              <div class="aspect-square bg-brandShade w-[6rem] h-[6rem]"></div>
            </div>
            <div class="aspect-square bg-brandShade w-[6rem] triangleShape -rotate-90 mt-[12rem]"></div>
          </div>  
        }

        <div class="w-full xl:grid xl:grid-cols-[9%_82%_9%]  flex flex-col items-center pt-6 xl:px-0 sm:px-6 px-0">
          <div></div>
            <section class="w-full flex flex-col">
              @if(category()){
              <section class="lg:grid lg:grid-cols-[4%_57%_35%_4%] flex flex-col w-full items-center">
                <div></div>
                <h1 class=" font-bold lg:text-[5rem] sm:text-[3.5rem] text-[2.3rem] text-brandViolet">{{category()?.name}}</h1>
                <p class="mt-40 sm:px-0 xsm:px-4 px-2 xsm:text-[1.4rem] text-[1rem] text-right">{{category()?.main ? category()?.description : ''}}</p>
                <div></div>
              </section>
              }
            @if(data$ | async; as data){
              <section class=" w-full h-fit pt-32">
                  <app-ext-standard-grid [articles]="(data | orderArticlesByDate)"/>
              </section>
            }
            </section>
          <div></div>
        </div>
      </div>
  `,
  styles:`
    .triangleShape{
      clip-path: polygon(
        0% 100%,
        50% 0%,
        100% 100%);
    }
  `
})
export class CategoryArticlesComponent {
  firebaseService = inject(FirebaseService)
  title = input.required<string>();

  category = model<Category>()

  data$ = toObservable(this.title).pipe(
    switchMap(title=>this.firebaseService.getCategory(title)),
    switchMap((res) => {
      this.category.set(res[0])

      return res[0].main 
      ? this.firebaseService.getMainCategoryArticles(this.title())
      : this.firebaseService.getCategoryArticles(this.title())})
  );
  
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

  urlFormat(id: string, title: string) {
    const formatTitle = title
      .split(' ')
      .join('-')
      .replace(/[^A-Za-z0-9-._~:/?#\[\]@!$&'()*+]+/g, '')
      .toLowerCase(); //valid url characters
    return `${id}-${formatTitle}`;
  }

}
