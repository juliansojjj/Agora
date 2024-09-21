import { Component, inject, input, Input, numberAttribute, OnInit } from '@angular/core';
import { Article } from '../../../../shared/interfaces/article.interface';
import ArticlesService from '../../../../core/services/articles.service';
import { catchError, EMPTY, map, Observable, Subscription, switchMap, take } from 'rxjs';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
} from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { FirebaseService } from '../../../../core/services/firebase.service';

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
    } @else{
      <span>Loading...</span>
    }
  `,
})
export class CategoryArticlesComponent {
  firebaseService = inject(FirebaseService)
  title = input.required<string>();

  data$ = toObservable(this.title).pipe(
    take(1),
    switchMap(title=>this.firebaseService.getCategoryArticles(title))
  )

  errorMessage!: string;

  trackByFn(index: number, item: Article) {
    return item.id;
  }


}
