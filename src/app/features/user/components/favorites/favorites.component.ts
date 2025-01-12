import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FirestoreCollectionUser } from '../../../../shared/interfaces/firebase.interfaces';
import { EMPTY, from, map, Observable, of, startWith, switchMap } from 'rxjs';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { AsyncPipe } from '@angular/common';
import { Article } from '../../../../shared/interfaces/article.interface';
import { StandardGridComponent } from "../../../articles/components/grids/standard-grid/standard-grid.component";
import { OrderArticlesByDatePipe } from "../../../articles/pipes/order-articles-by-date.pipe";

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [AsyncPipe, StandardGridComponent, OrderArticlesByDatePipe],
  template:`
  <div class="w-full xl:grid xl:grid-cols-[9%_82%_9%]  flex flex-col items-center md:pt-6 xl:px-0 sm:px-6 px-0">
    <div></div>

    <div class="flex flex-col">
      <h1 class="font-bold text-center mt-14 text-brandViolet 
      xl:pl-6
      lg:text-[5rem] 
      md:text-start
      sm:text-[3.5rem] sm:px-0
      xsm:text-[3rem] xsm:px-4     
      px-2 text-[2.3rem]">
        Favorites
      </h1>

      @if(!(favoriteArticles$ | async)){
        Loading
      } @else if(!(favoriteArticles$ | async)?.length){
        No favorites
          
      } @else {
      <section class="w-full h-fit pt-20 flex">
        <app-standard-grid [articles]="(favoriteArticles$ | async)!"/>

      </section>
      }
    </div>

    <div></div>
  </div>
  `,
  styles:`` 
})


export class FavoritesComponent {
  firebaseService = inject(FirebaseService);

  authState$ = this.firebaseService.authState$;
  authState = toSignal(this.authState$);

  

  favoriteArticles$ = this.authState$.pipe(
      switchMap((auth: any) => {
        return this.firebaseService.getUserInfo(auth.uid);
      }),
      map((userInfo:FirestoreCollectionUser)=>{
        return userInfo.favorites ? userInfo.favorites : []
      }),
      switchMap((favorites:string[]|[])=>{
        return favorites.length ? this.firebaseService.getFavoriteArticles(favorites) : of([])
      })

    );
}
