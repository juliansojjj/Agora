import { Component, inject, input } from '@angular/core';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, Observable, switchMap } from 'rxjs';
import { Article } from '../../../../shared/interfaces/article.interface';
import { AsyncPipe } from '@angular/common';
import { StandardGridComponent } from "../grids/standard-grid/standard-grid.component";
import { OrderArticlesByDatePipe } from '../../pipes/order-articles-by-date.pipe';
import { Author } from '../../../../shared/interfaces/author.interface';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [AsyncPipe, StandardGridComponent, OrderArticlesByDatePipe],
  template: `
    @if(id()){
      
      @if((authorData$ | async); as authorData){
        <section class="flex flex-col w-full">
          {{authorData.authorName}}
          {{authorData.authorDesignation}}
          <a [href]="authorData.source">Check author here</a>
          <img src="https://thispersondoesnotexist.com/" alt="fake image of author" class="w-[10rem] ">
          {{authorData.authorDescription}}

        </section>
      }
      
      <section class=" lg:w-2/3 h-fit pt-20">
          <app-standard-grid [height]=20 [articles]="((articles$ | async)! | orderArticlesByDate)"/>

        </section>
    }
  
  `,
  styles:`
  `
})
export class AuthorComponent {
  firebaseService = inject(FirebaseService)
  id = input.required<string>();

  articles$:Observable<Article[]> = toObservable(this.id).pipe(
    switchMap((id) => this.firebaseService.getAuthorArticles(id)),
  );
  authorData$:Observable<Author>  = toObservable(this.id).pipe(
    switchMap((id) => this.firebaseService.getAuthor(id)),
  );

}
