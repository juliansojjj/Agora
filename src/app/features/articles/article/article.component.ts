import { Component, inject, input } from '@angular/core';
import { Article } from '../../../shared/interfaces/article.interface';
import ArticlesService from '../../../core/services/articles.service';
import { catchError, EMPTY, map, Observable, switchMap } from 'rxjs';
import { Comment } from '../../../shared/interfaces/comment.interface';
import { NgIf, AsyncPipe } from '@angular/common';
import {toObservable} from '@angular/core/rxjs-interop'

@Component({
  selector: 'app-article',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  template: `
    @if (data$ | async ; as data) {
      <div>
        <h2>{{ data.heading }}</h2>
      </div>
    }@else{
      <p>Loading...</p>
    }
  `,
  providers: [ArticlesService],
})
export class ArticleComponent {
  id = input.required<string>();

  private articlesService = inject(ArticlesService);


  data$ = toObservable(this.id).pipe(
    switchMap(id => this.articlesService.getArticle(id))
  );


  comments!: Comment[];
  errorMessage!: string;

  
}
