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
      <div class="relative mt-[2rem]">

        <div class="absolute w-full h-fit top-0 left-0 xl:grid grid-cols-[50%_41%_9%] z-30 hidden">
          <div></div>
          <div class="aspect-square bg-brandShade w-[6rem] justify-self-end mr-[3rem] -mt-[1.5rem]"></div>
          <div></div>
        </div>

        <div class="absolute w-full h-fit top-0 left-0 -z-10 xl:grid hidden grid-cols-[9%_82%_9%]">
          <div></div>
          <div class="grid grid-cols-[61%_39%]">
            <div class="aspect-[2/1] h-[6rem] -ml-[1rem] bg-brandShade"></div>
            <div class="flex justify-end relative mt-6">
              <div class="aspect-square bg-brandShade w-[11rem] rounded-full absolute bottom-0 right-0 mb-[4.5rem]"></div>
              <div class="aspect-square bg-brandShade w-[9rem] triangleShape mt-[13.5rem] mr-[18.5rem]"></div>
            </div>
          </div>
          <div></div>
        </div>

        <div class="w-full xl:grid xl:grid-cols-[9%_82%_9%]  flex flex-col items-center pt-6 xl:px-0 sm:px-6 px-0">
          <div></div>
            <section class="w-full flex flex-col">
              
            @if((authorData$ | async); as authorData){
              <section class="lg:grid lg:grid-cols-[4%_57%_35%_4%] flex flex-col w-full items-center lg:items-start">
                <img src="https://thispersondoesnotexist.com/" alt="fake image of author" class="lg:hidden block sm:w-1/3 w-1/2 object-cover rounded-full">
                <div></div>
                <div class="flex flex-col lg:text-left text-center text-[1.5rem]">
                  <h1 class=" font-bold lg:text-[5rem] sm:text-[3.5rem] text-[2.3rem] text-brandViolet">{{authorData.authorName}}</h1>
                  <h2 class=" font-semibold lg:text-[2.6rem] sm:text-[2rem] text-[1.7rem] text-brandShade mb-4">{{authorData.authorDesignation}}</h2>
                  <p class="mb-4 sm:px-0 xsm:px-4 px-2 text-left xsm:text-[1.4rem] text-[1rem]">{{authorData.authorDescription}}</p>
                  <a [href]="authorData.source" target="_blank" class="xsm:text-[1.4rem] text-sm sm:px-0 xsm:px-4 px-2 w-fit font-semibold text-brandShade hover:bg-brandShade hover:text-black">Check author here</a>
                </div>
                <img src="https://thispersondoesnotexist.com/" alt="fake image of author" class="lg:block hidden xl:w-[21rem] object-cover rounded-full justify-self-end">
                <div></div>
              </section>
            }
            <section class=" w-full h-fit pt-20">
                <app-ext-standard-grid [articles]="((articles$ | async)! | orderArticlesByDate)"/>
            </section>

            </section>
          <div></div>
        </div>

      </div>
    }
  
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
