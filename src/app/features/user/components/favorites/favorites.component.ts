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
  <div class="w-full h-full flex flex-col items-center  pt-8 pl-[2rem] xl:pl-[6rem] 2xl:pl-[16rem]">

  <h1 class="text-[4rem] font-bold self-start">Favorites</h1>

    

  @if(!(favoriteArticles$ | async)){
    Loading
  } 
  @else if(!(favoriteArticles$ | async)?.length){
    No favorites
        
  } 
  @else {
    <section class="w-full h-fit pt-20 flex">
          <app-standard-grid [articles]="((favoriteArticles$ | async)! | orderArticlesByDate)"/>

    </section>
      }
  `,
  styles:`` 
})


export class FavoritesComponent {
  firebaseService = inject(FirebaseService);

  authState$ = this.firebaseService.authState$;
  authState = toSignal(this.authState$);

  

  favoriteArticles$: Observable<Article[]> =
    this.authState$.pipe(
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
