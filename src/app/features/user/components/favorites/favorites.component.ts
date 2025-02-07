import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, of, switchMap } from 'rxjs';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { FirestoreCollectionUser } from '../../../../shared/interfaces/firebase.interfaces';
import { StandardGridComponent } from "../../../articles/components/grids/standard-grid/standard-grid.component";
import { OrderArticlesByDatePipe } from "../../../articles/pipes/order-articles-by-date.pipe";
import { StandardGridSkeletonComponent } from "../../../articles/components/skeletons/standard-grid-skeleton/standard-grid-skeleton.component";

@Component({
    selector: 'app-favorites',
    imports: [AsyncPipe, StandardGridComponent, StandardGridSkeletonComponent],
    template: `
  <div class="w-full xl:grid xl:grid-cols-[9%_82%_9%] h-[86vh] flex flex-col items-center md:pt-6 xl:px-0 sm:px-6 px-0">
    <div></div>

    <div class="flex flex-col">
      <h1 class="font-medium lg:font-semibold text-center mt-6 md:mt-14 text-brandViolet 
      lg:text-[5rem] 
      md:text-start
      sm:text-[3.5rem] sm:px-0
      xsm:text-[3rem] px-5 text-[2.3rem]">
        Favorites
      </h1>

      @if(!(favoriteArticles$ | async)){
      <section class="w-full h-fit pt-20 flex">
        <app-standard-grid-skeleton/>
      </section>
      } @else if(!(favoriteArticles$ | async)?.length){
        <span class="sm:px-0 px-5 text-[1.1rem]">No favorites yet? Add one!</span>
      } @else {
      <section class="w-full h-fit pt-20 flex">
        <app-standard-grid [articles]="(favoriteArticles$ | async)!"/>
      </section>
      }
    </div>

    <div></div>
  </div>
  `,
    styles: ``
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
