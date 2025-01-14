import { Component, input, model, OnInit } from '@angular/core';
import { ExtStandardGridComponent } from "../../../features/articles/components/grids/standard-grid/ext-standard-grid/ext-standard-grid.component";
import { OrderArticlesByDatePipe } from "../../../features/articles/pipes/order-articles-by-date.pipe";
import Fuse, { FuseResult } from 'fuse.js';
import { Article } from 'app/shared/interfaces/article.interface';
import { toObservable } from '@angular/core/rxjs-interop';
import { findIndex, map, of, take } from 'rxjs';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-search',
    imports: [ExtStandardGridComponent, RouterLink],
    template: `
    <div class="w-full xl:grid xl:grid-cols-[9%_82%_9%]  flex flex-col items-center md:pt-6 xl:px-0 sm:px-6 px-0">
    <div></div>

    <section class="flex flex-col max-sm:p-2">
      <h1 class="font-bold text-center text-brandViolet
      lg:text-[5rem] 
      md:text-start
      sm:text-[3.5rem] sm:px-0
      xsm:text-[3rem] xsm:px-4     
      px-2 text-[2.3rem]">
        Search
      </h1>

      <h2 class="max-sm:p-2 text-[1.4rem] my-6">'{{search()}}'</h2>

      @if(authorResults().length){
        <h3 class="text-[2.5rem] font-semibold mb-4">Authors</h3>
        <div class="w-full grid 2xl:grid-cols-3 sm:grid-cols-2 grid-cols-1">
          @for (item of authorResults(); track $index) {
            <a [routerLink]="['/author',item.authorID]" 
            class="h-[6rem] px-4 pt-1 bg-white min-w-full  hover:bg-brandGrey flex items-center text-[1.2rem] md:text-[1.4rem]">
              <img src="https://thispersondoesnotexist.com/" [alt]="'image of '+item.authorName" class="rounded-full h-[4.5rem] mr-4">
              <span>{{item.authorName}}</span>
            </a>
          }
        </div>

      } @else{<span class="text-[1.4rem] mb-4">No authors found</span>}

      @if(articleResults().length){
      <section class=" w-full h-fit pt-10">
        <h3 class="text-[2.5rem] font-semibold mb-4">Articles</h3>
        <app-ext-standard-grid [articles]="articleResults()"/>
      </section>
      } @else{<span class="text-[1.4rem]">No articles found</span>}

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

  constructor(){
    const articles:Article[] = JSON.parse(localStorage.getItem('articles')!)

    toObservable(this.search).subscribe(res=>{
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
      const articlesFuse = new Fuse(articles, fuseArticleOptions);

      this.articleResults.set(articlesFuse.search(res!).filter(obj=>obj.score && obj.score < 0.7).map(res=>res.item))
      
      const fuseAuthorOptions = {
        includeScore: true,
        useExtendedSearch: true,
        keys: [
          "authorName"
        ]
      };
      const authorFuse = new Fuse(articles, fuseAuthorOptions);
      const authorArray = authorFuse.search(res!).filter(obj=> obj.score && obj.score<0.5)

      this.authorResults.set(authorArray
        .filter((item:any,index:number)=>{
        return index == authorArray.findIndex((obj:any)=>item?.item.authorID == obj?.item.authorID)
        })
        .map(res=>{return{authorID:res.item.authorID,authorName:res.item.authorName}})
        .splice(0,30)
      )
    })
  }

}
