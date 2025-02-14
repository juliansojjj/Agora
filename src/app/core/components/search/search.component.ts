import { Component, inject, input, model, OnInit } from '@angular/core';
import { ExtStandardGridComponent } from "../../../features/articles/components/grids/standard-grid/ext-standard-grid/ext-standard-grid.component";
import { OrderArticlesByDatePipe } from "../../../features/articles/pipes/order-articles-by-date.pipe";
import Fuse, { FuseResult } from 'fuse.js';
import { Article } from 'app/shared/interfaces/article.interface';
import { toObservable } from '@angular/core/rxjs-interop';
import { findIndex, map, of, Subscription, take } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FirebaseService } from 'app/core/services/firebase.service';
import { AsyncPipe } from '@angular/common';
import { ExtStandardGridSkeletonComponent } from "../../../features/articles/components/skeletons/ext-standard-grid-skeleton/ext-standard-grid-skeleton.component";

@Component({
    selector: 'app-search',
    imports: [ExtStandardGridComponent, RouterLink, AsyncPipe, ExtStandardGridSkeletonComponent],
    template: `
    <div class="w-full h-full xl:grid xl:grid-cols-[9%_82%_9%]  flex flex-col items-center md:pt-6 xl:px-0 xsm:px-4 px-0">
      <div></div>

      <section class="flex flex-col">
        <h1 class="font-semibold text-center text-brandViolet
        lg:text-[5rem] 
        md:text-start
        sm:text-[3.5rem] xsm:px-0
        text-[3rem] px-4 ">
          Search
        </h1>

        <h2 class="xsm:px-0 px-4 text-[1.4rem] my-6 break-all">'{{search()}}'</h2>
        
        @if(articlesSuccess()){
          @if(authorResults().length){
          <h3 class="text-[2.5rem] font-semibold mb-4 xsm:px-0 px-4">Authors</h3>
          <div class="w-full grid 2xl:grid-cols-3 sm:grid-cols-2 grid-cols-1">
            @for (item of authorResults(); track $index) {
              <a [routerLink]="['/author',item.authorID]" 
              class="h-[6rem] px-4 pt-1 bg-white min-w-full fill-brandShade hover:fill-black hover:bg-brandGrey flex items-center text-[1.2rem] md:text-[1.4rem]">
              <svg viewBox="0 0 330 461" class="h-[2.5rem] mr-5">
                  <path d="M286 122C286 189.379 231.379 244 164 244C96.6213 244 42 189.379 42 122C42 54.6213 96.6213 0 164 0C231.379 0 286 54.6213 286 122Z"/>
                  <path d="M240.577 461L330 306L0 306L89.4231 461H240.577Z"/>
                </svg>
                <span>{{item.authorName}}</span>
              </a>
            }
          </div>

          } @else{<span class="text-[1.4rem] mb-4 xsm:px-0 px-4">No authors found</span>}

          @if(articleResults().length){
          <section class=" w-full h-fit pt-10">
            <h3 class="text-[2.5rem] font-semibold mb-2 xsm:px-0 px-4">Articles</h3>
            <span class="mb-6 text-[1.1rem] text-slate-400 inline-block xsm:px-0 px-4">{{articleResults().length}} results found</span>
            <app-ext-standard-grid [articles]="articleResults()"/>
          </section>
          } @else{<span class="text-[1.4rem] xsm:px-0 px-4">No articles found</span>}
        }@else {
          <h3 class="text-[2.5rem] font-semibold mb-4 xsm:px-0 px-4">Authors</h3>
          <div class="w-full grid 2xl:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2">
            <div class="h-[6rem] px-4 pt-1 bg-white w-full fill-slate-400 flex items-center text-[1.2rem] md:text-[1.4rem]">
              <svg viewBox="0 0 330 461" class="h-[2.5rem] mr-5 ">
                <path d="M286 122C286 189.379 231.379 244 164 244C96.6213 244 42 189.379 42 122C42 54.6213 96.6213 0 164 0C231.379 0 286 54.6213 286 122Z"/>
                <path d="M240.577 461L330 306L0 306L89.4231 461H240.577Z"/>
              </svg>
              <div class="w-full h-[2rem] skeletonElement mb-[.6rem]"></div>

            </div>
            <div class="h-[6rem] px-4 pt-1 bg-white w-full fill-slate-400 flex items-center text-[1.2rem] md:text-[1.4rem]">
              <svg viewBox="0 0 330 461" class="h-[2.5rem] mr-5 ">
                <path d="M286 122C286 189.379 231.379 244 164 244C96.6213 244 42 189.379 42 122C42 54.6213 96.6213 0 164 0C231.379 0 286 54.6213 286 122Z"/>
                <path d="M240.577 461L330 306L0 306L89.4231 461H240.577Z"/>
              </svg>
              <div class="w-full h-[2rem] skeletonElement mb-[.6rem]"></div>
            </div>
          </div>

          <section class=" w-full h-fit pt-10">
            <h3 class="text-[2.5rem] font-semibold mb-2 xsm:px-0 px-4">Articles</h3>
            <app-ext-standard-grid-skeleton />
          </section>
        }
        
      </section>

      <div></div>
    </div>
  `,
    styles: ``
})
export class SearchComponent {
  search = input()
  articleResults = model<Article[]>([])
  authorResults = model<{authorID:string,authorName:string}[]>([])
  firebaseService = inject(FirebaseService);
  articlesSuccess = model(false)

  constructor(){
    toObservable(this.search).subscribe(res=>{
      this.firebaseService.getSearchArticles().subscribe(data=>{
        this.articlesSuccess.set(true)
        const fuseArticleOptions = {
          includeScore: true,
          useExtendedSearch: true,
          keys: [
            "heading", 
            "subheading", 
            "topics",
            "frontImageAlt"
          ]
        };
        const articlesFuse = new Fuse(data, fuseArticleOptions);
  
        this.articleResults.set(articlesFuse.search(res!).filter(obj=>obj.score && obj.score < 0.7).map(res=>res.item))
        
        const fuseAuthorOptions = {
          includeScore: true,
          useExtendedSearch: true,
          keys: [
            "authorName"
          ]
        };
        const authorFuse = new Fuse(data, fuseAuthorOptions);
        const authorArray = authorFuse.search(res!).filter(obj=> obj.score && obj.score<0.5)
  
        this.authorResults.set(authorArray
          .filter((item:any,index:number)=>{
          return index == authorArray.findIndex((obj:any)=>item?.item.authorID == obj?.item.authorID)
          })
          .map(res=>{return{authorID:res.item.authorID,authorName:res.item.authorName}})
          .splice(0,30)
        )
      })
    })
  }
}
