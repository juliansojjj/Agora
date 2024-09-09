import { Component, inject} from '@angular/core';
import ArticlesService from '../../../../core/services/articles.service';
import { Article } from '../../../../shared/interfaces/article.interface';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { catchError, EMPTY, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-articles',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, AsyncPipe],
  template: `
    <!-- @if(data$ | async ; as data){<main>
      <div class="grid grid-cols-4 gap-y-6 w-full place-items-center pt-4 text-black">
        <ng-template [ngIf]="errorMessage">
          <span class="whitespace-pre-line text-left">{{errorMessage}}</span>
        </ng-template>
        <ng-container *ngFor="let item of data; trackBy:trackByFn">
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
    </main>} -->
  `,
  providers:[ArticlesService]
})
export class HomeArticlesComponent {
  private articlesService = inject(ArticlesService);
  // data$: Observable<Article[]> = this.articlesService.getNews();
  errorMessage!:string

  trackByFn(index:number,item:Article){
    return item.articleID
  }



}

//TODO: LOADING SCREEN