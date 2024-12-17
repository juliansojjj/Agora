import { Component, inject, input } from '@angular/core';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, Observable, switchMap } from 'rxjs';
import { Article } from '../../../../shared/interfaces/article.interface';
import { AsyncPipe } from '@angular/common';
import { OrderArticlesByDatePipe } from '../../pipes/order-articles-by-date.pipe';
import { Author } from '../../../../shared/interfaces/author.interface';
import { ExtStandardGridComponent } from '../grids/standard-grid/ext-standard-grid/ext-standard-grid.component';

@Component({
  selector: 'app-author',
  standalone: true,
  imports: [AsyncPipe, ExtStandardGridComponent, OrderArticlesByDatePipe],
  template: `
    @if(id()){
      <div class="w-full md:grid lg:grid-cols-[9%_82%_9%] md:grid-cols-[2%_96%_2%] flex flex-col items-center pt-6 md:px-0 sm:px-6 px-0">
        <div></div>
          <section class="w-full flex flex-col">
            
          @if((authorData$ | async); as authorData){
            <section class="md:grid md:grid-cols-[4%_57%_14%_21%_4%] flex flex-col w-full items-center">
              <img src="https://thispersondoesnotexist.com/" alt="fake image of author" class="md:hidden block w-1/2 object-cover rounded-full mt-6">
              <div></div>
              <div class="flex flex-col md:text-left text-center text-[1.5rem]">
                <h1 class=" font-bold text-[5rem] text-brandViolet">{{authorData.authorName}}</h1>
                <h2 class=" font-semibold text-[2.6rem] text-brandShade mb-4">{{authorData.authorDesignation}}</h2>
                <p class="mb-4 text-left">{{authorData.authorDescription}}</p>
                <a [href]="authorData.source" target="_blank" class="w-fit font-semibold text-brandShade hover:bg-brandShade hover:text-black">Check author here</a>
              </div>
                  <div></div>
              <img src="https://thispersondoesnotexist.com/" alt="fake image of author" class="md:block hidden w-full object-cover rounded-full mt-6">
                  <div></div>
            </section>
          }
          <section class=" w-full h-fit pt-10">
              <app-ext-standard-grid [articles]="((articles$ | async)! | orderArticlesByDate)"/>
          </section>

          </section>
        <div></div>
      </div>
    }
  
  `,
  styles: ``
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
