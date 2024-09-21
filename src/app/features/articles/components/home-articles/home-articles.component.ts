import { Component, inject } from '@angular/core';
import ArticlesService from '../../../../core/services/articles.service';
import { Article } from '../../../../shared/interfaces/article.interface';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-home-articles',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, AsyncPipe],
  template: `
    @if (articles()) {
      <main>
        <div
          class="grid grid-cols-4 gap-y-6 w-full place-items-center pt-4 text-black"
        >
          <ng-container *ngFor="let item of articles(); trackBy: trackByFn">
            <a class="bg-slate-200" [routerLink]="['/article', urlFormat(item.id, item.heading)]">
              <h4>{{ item.heading }}</h4>
              <img
                [src]="item.frontImage"
                alt="front image of {{ item.heading }}"
                class="w-[10rem] aspect-[3/2] object-cover"
              />
            </a>
          </ng-container>
        </div>
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
  articles = toSignal<Article[]>(
    this.firebaseService.getLandingArticles().pipe(
      map((res) => {
        console.log(res);
        return res;
      }),
    ),
  );

  errorMessage!: string;

  trackByFn(index: number, item: Article) {
    return item.id;
  }

  urlFormat(id:string,title:string) {
    const formatTitle = title.split(' ').join('-').replace(/[^A-Za-z0-9-._~:/?#\[\]@!$&'()*+]+/g, '').toLowerCase() //valid url characters
    return `${id}-${formatTitle}`;
  }
}

//TODO: LOADING SCREEN
///[^A-Za-z0-9-._~:/?#\[\]@!$&'()*+,;=]+/g