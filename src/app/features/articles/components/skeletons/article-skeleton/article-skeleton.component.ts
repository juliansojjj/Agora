import { Component } from '@angular/core';

@Component({
  selector: 'app-article-skeleton',
  imports: [],
  template: `
    <article class="w-full  min-h-screen relative flex flex-col items-center">
      <div class="w-full justify-between items-start 
          lg:w-1/2 lg:p-0 
          sm:mt-4
          xsm:px-6
          mt-0 px-2 flex" >
          <div #domHeading class="w-full">
            <div class="w-full h-[3.5rem] skeletonElement mb-7"></div>
            <div class="w-full h-[3.5rem] skeletonElement mb-7"></div>
            <div class="w-[85%] h-[3.5rem] skeletonElement mb-16"></div>

            <div class="w-[50%] h-[2rem] skeletonElement xsm:mb-9 mb-12"></div>

            <div class="w-[35%] h-[1.5rem] skeletonElement mb-[.6rem]"></div>

            <div class="w-[40%] h-[1.5rem] skeletonElement"></div>
          </div>
      </div>
      <div class="relative lg:w-1/2 aspect-[2/1.2] object-cover mt-9 skeletonImg"></div>

      <section class="w-full mt-12 lg:p-0 xsm:px-6 px-2 flex flex-col items-center">
        <div class="flex flex-col contentElement my-4">
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-[85%] h-[1.5rem] skeletonElement mb-[.6rem]"></div>
        </div>
        <div class="flex flex-col contentElement my-4">
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-[85%] h-[1.5rem] skeletonElement mb-[.6rem]"></div>
        </div>
        <div class="flex flex-col contentElement my-4">
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-[85%] h-[1.5rem] skeletonElement mb-[.6rem]"></div>
        </div>
        <div class="flex flex-col contentElement my-4">
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
          <div class="w-[85%] h-[1.5rem] skeletonElement mb-[.6rem]"></div>
        </div>
    

        <hr class="contentElement h-[.05rem] bg-slate-200">

        <section class="contentElement flex flex-col items-center my-6">

          <div class="w-full h-fit flex sm:flex-row flex-col items-center">
            <div class="h-[7rem] w-[7rem] aspect-square sm:mr-8 rounded-full skeletonImg"> </div>
            <div class="skeletonElement w-full h-[3rem]"></div>
          </div>

          <div class="flex flex-col w-full mt-7">
            <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
            <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
            <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
            <div class="w-full h-[1.5rem] skeletonElement mb-[.6rem]"></div>
            <div class="w-[85%] h-[1.5rem] skeletonElement mb-[.6rem]"></div>  
          </div>

        </section>

        <hr class="contentElement h-[.05rem] bg-slate-200">

      </section>
    </article>
  `,
  styles: ``
})
export class ArticleSkeletonComponent {

}
