import { Component, inject, input, Input, numberAttribute } from '@angular/core';
import { Article } from '../../../../shared/interfaces/article.interface';
import ArticlesService from '../../../../services/articles.service';
import { catchError, EMPTY, Observable, Subscription, switchMap } from 'rxjs';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
} from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-category-articles',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, AsyncPipe],
  template: `
    @if(data$ | async; as data){
      <div
      class="grid grid-cols-4 gap-y-6 w-full place-items-center pt-4 text-black"
    >
      <ng-template [ngIf]="errorMessage">
        <span class="whitespace-pre-line text-left">{{ errorMessage }}</span>
      </ng-template>
      <ng-container *ngFor="let item of data; trackBy: trackByFn">
        <a class="bg-slate-200" [routerLink]="['/article', item.articleID]">
          <h4>{{ item.heading }}</h4>
          <img
            [src]="item.frontImage"
            alt="front image of {{ item.heading }}"
            class="w-[10rem] aspect-[3/2] object-cover"
          />
        </a>
      </ng-container>
    </div>
    }
  `,
  providers: [ArticlesService],
})
export class CategoryArticlesComponent {
  private articlesService = inject(ArticlesService);
  title = input.required<string>();


  data$ = toObservable(this.title).pipe(
    switchMap(title => this.articlesService.getCategoryArticles(title))
  );

  errorMessage!: string;

  trackByFn(index: number, item: Article) {
    return item.articleID;
  }
}
