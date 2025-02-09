import { AsyncPipe, NgClass, NgFor, NgIf, TitleCasePipe } from '@angular/common';
import { Component, inject, input, model } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import {
  Router,
  RouterLink
} from '@angular/router';
import { map, switchMap } from 'rxjs';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { Article } from '../../../../shared/interfaces/article.interface';
import { Category } from '../../../../shared/interfaces/category.interface';
import { OrderArticlesByDatePipe } from '../../pipes/order-articles-by-date.pipe';
import { ExtStandardGridComponent } from '../grids/standard-grid/ext-standard-grid/ext-standard-grid.component';
import { ExtStandardGridSkeletonComponent } from "../skeletons/ext-standard-grid-skeleton/ext-standard-grid-skeleton.component";

@Component({
    selector: 'app-category-articles',
    imports: [TitleCasePipe, AsyncPipe, NgClass, ExtStandardGridComponent, ExtStandardGridSkeletonComponent],
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
        } @else if(category() && category()?.main){
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
              <section class="flex flex-col w-full  h-fit mt-6 md:mt-14 lg:-mb-20">
                    <h1 class="font-semibold lg:text-[5rem] sm:text-[3.5rem] xsm:text-[3rem] text-[2.3rem] text-brandViolet self-center md:self-start xl:pl-6 sm:px-0 px-4">{{category()?.name}}</h1>

                    <div class="w-full xl:grid-cols-[45%_55%] grid h-fit">
                      <div class="w-full -z-10 xl:flex hidden self-end">
                        <div class="aspect-square triangleShape bg-brandShade w-[6rem] h-[6rem] mr-[3rem]"></div>
                        <div class="aspect-square triangleShape bg-brandShade w-[6rem] h-[6rem] mr-[3rem]"></div>
                        <div class="aspect-square triangleShape bg-brandShade w-[6rem] h-[6rem] mr-[3rem]"></div>
                        <div class="aspect-square triangleShape bg-brandShade w-[6rem] h-[6rem] mr-[3rem]"></div>
                        <div class="aspect-square triangleShape bg-brandShade w-[6rem] h-[6rem] 2xl:block hidden"></div>
                      </div>
                      <p class=" sm:px-0 px-5 xsm:text-[1.4rem] text-[1.2rem] xl:text-right text-left self-end w-full max-md:mt-7">
                        {{category()?.main ? category()?.description : ''}}
                      </p>
                    </div>
                    <div class="aspect-square rounded-full bg-brandShade self-end w-[8rem] -mt-[3rem] -mr-[4rem] -z-10 xl:block hidden"></div>
              </section>
            }@else if(category() && !category()?.main){
              <h1 class="font-semibold lg:text-[5rem] sm:text-[3.5rem] xsm:text-[3rem] text-[2.3rem] text-brandViolet xl:pl-6 sm:px-0 px-4 mt-6 md:mt-14 md:text-start text-center">
                {{category()?.name}}
              </h1>
            }@else {
              <h1 class="font-semibold lg:text-[5rem] sm:text-[3.5rem] xsm:text-[3rem] text-[2.3rem] text-brandViolet xl:pl-6 sm:px-0 px-4 mt-6 md:mt-14 md:text-start text-center">
                {{title() | titlecase}}
              </h1>
            }
            
            @if(initialData$ | async; as data){
              <section class="w-full h-fit lg:pt-40 pt-10">
                  <app-ext-standard-grid [articles]="chunksData()!"/>
              </section>
              @if(!categoryEnd() && category()?.main){
                <button class="bg-brandViolet text-white font-medium py-2 w-[7rem] mt-12" (invalid)="isChunkLoading()" (click)="loadChunk()">
                  @if(isChunkLoading()){. . .}@else{See more}
                </button>
              }
              @if(!categoryEnd() && !category()?.main){
                <button class="bg-brandViolet text-white font-medium py-2 w-[7rem] mt-12" (invalid)="isChunkLoading()" (click)="loadTopicChunk()">
                  @if(isChunkLoading()){. . .}@else{See more}
                </button>
              }
            }@else{
              <section class="w-full h-fit lg:pt-[25rem] pt-10">
                  <app-ext-standard-grid-skeleton />
              </section>
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
  end = input<unknown>()

  loadChunk(){
    this.isChunkLoading.set(true)
    this.firebaseService.getMainCategoryArticles(this.title(),9,this.lastDoc()?.date).pipe(
      map(((res:any)=>{
        let newChunk 

        if(res.length == 9) {
          newChunk = res.slice(0,res.length-1)
          this.categoryEnd.set(false)
        }
        else {
          newChunk = res
          this.categoryEnd.set(true)
        }
        
        const oldData = this.chunksData()
        
        const newChunksData = [...oldData as Article[], ...newChunk]
        
        this.chunksData.set(newChunksData.filter((item:any,index:number)=>{
          return index == newChunksData.findIndex((obj:any)=>item?.articleID == obj?.articleID)
          })
        )
        
        this.lastDoc.set(newChunk[newChunk.length-1])

        if(res.length !== 1)this.router.navigate(['/category/'+this.title()], { queryParams: {end: this.end() ? parseInt(this.end() as string) + 1 : 2 },fragment:'PKnxuKkRmS' });
        this.isChunkLoading.set(false)
    }))).subscribe()
  }
  loadTopicChunk(){
    this.isChunkLoading.set(true)
    this.firebaseService.getCategoryArticles(this.title(),9,this.lastDoc()?.date).pipe(
      map(((res:any)=>{
        let newChunk 

        if(res.length == 9) {
          newChunk = res.slice(0,res.length-1)
          this.categoryEnd.set(false)
        }
        else {
          newChunk = res
          this.categoryEnd.set(true)
        }
        
        const oldData = this.chunksData()
        
        const newChunksData = [...oldData as Article[], ...newChunk]
        
        this.chunksData.set(newChunksData.filter((item:any,index:number)=>{
          return index == newChunksData.findIndex((obj:any)=>item?.articleID == obj?.articleID)
          })
        )
        
        this.lastDoc.set(newChunk[newChunk.length-1])

        if(res.length !== 1)this.router.navigate(['/category/'+this.title()], { queryParams: {end: this.end() ? parseInt(this.end() as string) + 1 : 2 },fragment:'PKnxuKkRmS' });
        this.isChunkLoading.set(false)
    }))).subscribe()
  }

  initialData$ = toObservable(this.title).pipe(
    switchMap(title=>this.firebaseService.getCategory(title)),
    switchMap((res) => {
      this.category.set(res[0])
      this.categoryEnd.set(false)

      if(!res.length) this.router.navigate(['/not-found'])
      
      if(!res[0].main){
        return this.end()
        ? this.firebaseService.getCategoryArticles(this.title(),8,undefined,parseInt(this.end()! as string)).pipe(
          map(res=>{
            this.lastDoc.set(res[res.length-1])
            this.chunksData.set(res)
            return res
          })
        )
        : this.firebaseService.getCategoryArticles(this.title(),8).pipe(
            map(res=>{
              this.lastDoc.set(res[res.length-1])
              this.chunksData.set(res)
              return res
            })
          )
      } else return this.end()
      ? this.firebaseService.getMainCategoryArticles(this.title(),8,undefined,parseInt(this.end()! as string)).pipe(
        map(res=>{
          this.lastDoc.set(res[res.length-1])
          this.chunksData.set(res)
          return res
        })
      )
      : this.firebaseService.getMainCategoryArticles(this.title(),16).pipe(
        map(res=>{
          this.lastDoc.set(res[res.length-1])
          this.chunksData.set(res)
          return res
        })
      )
    }
    )
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