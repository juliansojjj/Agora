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

@Component({
  selector: 'app-category-articles',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, AsyncPipe, NgClass],
  template: `
  @if(category()){
    <section class="flex flex-col w-full items-center">
      <span>{{category()?.name}}</span>
      <p>{{category()?.main ? category()?.description : ''}}</p>
  </section>
      
    }
    @if(data$ | async; as data){
    
      {{data.length}}
      @for (item of data; track $index) {
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
    } @else{
      <span>Loading...</span>
    }
  `,
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
