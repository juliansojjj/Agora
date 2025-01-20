import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FirebaseService } from 'app/core/services/firebase.service';

@Component({
    selector: 'app-sitemap',
    imports: [AsyncPipe, RouterLink],
    template: `
    <div class="w-full xl:grid xl:grid-cols-[9%_82%_9%]  flex flex-col items-center md:pt-6 xl:px-0 sm:px-6 px-0">
    <div></div>

    <section class="flex flex-col">
      <h1 class="font-bold text-center mt-14 text-brandViolet 
      lg:text-[5rem] 
      md:text-start
      sm:text-[3.5rem] sm:px-0
      xsm:text-[3rem] xsm:px-4     
      px-2 text-[2.3rem]">
        Sitemap
      </h1> 


      <h2 class="font-bold text-center md:mt-10 mt-3 mb-2 text-brandShade 
      lg:text-[3.5rem] 
      md:text-start
      sm:text-[3rem] sm:px-0
      xsm:text-[2.5rem] xsm:px-4     
      px-2 text-[2rem]">
        Categories
      </h2> 
      @if(categoriesData$ | async; as data){
        <div class="w-full flex flex-col sm:px-0 xsm:px-4 px-2">
          @for (item of data; track $index) {
            @if(item.main){
              <a [routerLink]="['/category',item.url]" class="font-medium text-[1rem] xsm:text-[1.2rem] hover:underline mb-[.4rem]">
                {{item.name}}
              </a>      
            } 
          }
        </div>
      }

      <h2 class="font-bold text-center md:mt-10 mt-3 mb-2 text-brandShade 
      lg:text-[3.5rem] 
      md:text-start
      sm:text-[3rem] sm:px-0
      xsm:text-[2.5rem] xsm:px-4     
      px-2 text-[2rem]">
        Topics
      </h2> 
      @if(categoriesData$ | async; as data){
        <div class="w-full grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-[.4rem] sm:px-0 xsm:px-4 px-2">
          @for (item of data; track $index) {
            @if(!item.main){
              <a [routerLink]="['/category',item.url]" class="font-medium text-[1rem] xsm:text-[1.2rem] hover:underline">
                {{item.name}}
              </a>      
            } 
          }
        </div>
      }
      
      <h2 class="font-bold text-center md:mt-10 mt-3 mb-2 text-brandShade 
      lg:text-[3.5rem] 
      md:text-start
      sm:text-[3rem] sm:px-0
      xsm:text-[2.5rem] xsm:px-4     
      px-2 text-[2rem]">
        Authors
      </h2> 

      @if(authorsData$ | async; as data){
        <div class="w-full grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-y-[.4rem] sm:px-0 xsm:px-4 px-2">
          @for (item of data; track $index) {
              <a [routerLink]="['/author',item.authorID]" class="font-medium text-[1rem] xsm:text-[1.2rem] hover:underline">
                {{item.authorName}}
              </a>      
            }
        </div>
      }
    </section>

    <div></div>
  </div>
  `,
    styles: ``
})
export class SitemapComponent {
  firebaseService = inject(FirebaseService)

  categoriesData$ = this.firebaseService.getAllCategories()
  authorsData$ = this.firebaseService.getAllAuthors()

}
