import { Component, inject, input, Input, model, numberAttribute, OnInit } from '@angular/core';
import { Article, title } from '../../../../shared/interfaces/article.interface';
import { bufferCount, catchError, EMPTY, map, Observable, Subscription, switchMap, take, takeLast } from 'rxjs';
import { NgFor, NgIf, AsyncPipe, NgClass } from '@angular/common';
import {
  NavigationEnd,
  NavigationStart,
  Router,
  RouterLink,
} from '@angular/router';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { Category } from '../../../../shared/interfaces/category.interface';
import { ExtStandardGridComponent } from '../grids/standard-grid/ext-standard-grid/ext-standard-grid.component';
import { OrderArticlesByDatePipe } from '../../pipes/order-articles-by-date.pipe';

@Component({
    selector: 'app-category-articles',
    imports: [NgFor, NgIf, RouterLink, AsyncPipe, NgClass, ExtStandardGridComponent, OrderArticlesByDatePipe],
    template: `
      <div class="relative "
      [ngClass]="category() && !category()?.main ? 'xl:mt-[2rem]' : ''">
        
        @if(category() && !category()?.main){
          <div class="absolute w-full h-fit top-0 left-0 xl:grid hidden grid-cols-[9%_82%_9%]">
            <div class="aspect-square bg-brandShade w-[6rem] triangleShape justify-self-end"></div>
            <div class="justify-self-end flex w-fit">
              <div class="aspect-square bg-brandShade w-[6rem] h-[6rem] mt-[6rem]"></div>
              <div class="aspect-square bg-brandShade w-[6rem] h-[6rem]"></div>
            </div>
            <div class="aspect-square bg-brandShade w-[6rem] triangleShape -rotate-90 mt-[12rem]"></div>
          </div>  
        } @else{
          <div class="absolute w-full h-fit top-0 left-0 xl:grid hidden grid-cols-[9%_37%_45%_9%] -z-10">
            <div class="aspect-square bg-brandShade w-[9rem] "></div>

            <div></div>
            
            <div class="aspect-square triangleShape bg-brandShade w-[12rem] h-[13rem] rotate-180 justify-self-end -mr-[6rem]"></div>

            <div></div>
          </div>
        }

        <div class="w-full xl:grid xl:grid-cols-[9%_82%_9%]  flex flex-col items-center md:pt-6 xl:px-0 sm:px-6 px-0">
          <div></div>

          <div class="flex flex-col items-center w-full">
            @if(category() && category()?.main){
              <section class="flex flex-col w-full  h-fit mt-14 lg:-mb-20">
                    <h1 class=" font-bold lg:text-[5rem] sm:text-[3.5rem] xsm:text-[3rem] text-[2.3rem] text-brandViolet self-center md:self-start xl:pl-6 sm:px-0 xsm:px-4 px-2">{{category()?.name}}</h1>

                    <div class="w-full xl:grid-cols-[45%_55%] grid h-fit">
                      <div class="w-full -z-10 xl:flex hidden self-end">
                        <div class="aspect-square triangleShape bg-brandShade w-[6rem] h-[6rem] mr-[3rem]"></div>
                        <div class="aspect-square triangleShape bg-brandShade w-[6rem] h-[6rem] mr-[3rem]"></div>
                        <div class="aspect-square triangleShape bg-brandShade w-[6rem] h-[6rem] mr-[3rem]"></div>
                        <div class="aspect-square triangleShape bg-brandShade w-[6rem] h-[6rem] mr-[3rem]"></div>
                        <div class="aspect-square triangleShape bg-brandShade w-[6rem] h-[6rem] 2xl:block hidden"></div>
                      </div>
                      <p class=" sm:px-0 xsm:px-4 px-2 xsm:text-[1.4rem] text-[1rem] xl:text-right text-left self-end w-full max-md:mt-7">
                        {{category()?.main ? category()?.description : ''}}
                      </p>
                    </div>
                    <div class="aspect-square rounded-full bg-brandShade self-end w-[8rem] -mt-[3rem] -mr-[4rem] -z-10 xl:block hidden"></div>
              </section>
            }@else{
              <h1 class=" font-bold lg:text-[5rem] sm:text-[3.5rem] xsm:text-[3rem] text-[2.3rem] text-brandViolet xl:pl-6 sm:px-0 xsm:px-4 px-2 mt-14 md:text-start text-center">
                {{category()?.name}}
              </h1>
            }
            
            @if(initialData$ | async; as data){
              <section class="w-full h-fit lg:pt-40 pt-10">
                  <app-ext-standard-grid [articles]="data"/>
                  <div class="mt-4">
                    @if(chunksData()){
                      <app-ext-standard-grid [articles]="chunksData()!"/>
                    }
                  </div>
              </section>
              @if(!categoryEnd()){
                <button class="bg-brandViolet text-white font-semibold py-2 w-[7rem] mt-4" (invalid)="isChunkLoading()" (click)="loadChunk()">
                  @if(isChunkLoading()){...}@else{See more}
                </button>
              }
            }
          </div>

          <div></div>
        </div>
      </div>
  `,
    styles: `
    .triangleShape{
      clip-path: polygon(
        0% 100%,
        50% 0%,
        100% 100%);
    }
  `
})
export class CategoryArticlesComponent {
  firebaseService = inject(FirebaseService)
  title = input.required<string>();
  router = inject(Router)

  category = model<Category>()

  categoryEnd = model(false)
  chunksData = model<Article[]>()
  lastDoc = model<Article>()
  isChunkLoading = model<boolean>()

  loadChunk(){
    // this.router.navigate(['/category/'+this.title()], { queryParams: {date: this.currentLastDate()} });
    this.isChunkLoading.set(true)
    this.firebaseService.getMainCategoryArticles(this.title(),9,this.lastDoc()?.date).pipe(
      map(((res:any)=>{
        let nextArt = {}
        if(res.length == 9) {
          this.categoryEnd.set(false)
          nextArt = res[res.length-1];
        } else {
          this.categoryEnd.set(true)}
        console.log(res.length)
        const newChunk = res.slice(0,res.length-1)
        // if(nextArt == 'end') 
        
        // console.log('nextArt')
        // console.log(nextArt)
        // console.log('newChunk')
        // console.log(newChunk)
        
        if(this.chunksData()){
          // console.log('oldData')
          // console.log(this.chunksData())
          const oldData = this.chunksData()
          
          const newChunksData = [...oldData as Article[], ...newChunk] 
          this.chunksData.set(newChunksData)
        } else{
          // console.log('new')
          this.chunksData.set(newChunk)
        }
        this.lastDoc.set(newChunk[newChunk.length-1])
        this.isChunkLoading.set(false)
      
      

      
    }))).subscribe()
  }

  initialData$ = toObservable(this.title).pipe(
    switchMap(title=>this.firebaseService.getCategory(title)),
    switchMap((res) => {
      this.category.set(res[0])

      return res[0].main 
      ? this.firebaseService.getMainCategoryArticles(this.title(),8).pipe(
        map(res=>{
          this.lastDoc.set(res[res.length-1])
          return res
        })
      )
      : this.firebaseService.getCategoryArticles(this.title())})
  )
  
  urlFormat(id: string, title: string) {
    const formatTitle = title
      .split(' ')
      .join('-')
      .replace(/[^A-Za-z0-9-._~:/?#\[\]@!$&'()*+]+/g, '')
      .toLowerCase(); //valid url characters
    return `${id}-${formatTitle}`;
  }

}
