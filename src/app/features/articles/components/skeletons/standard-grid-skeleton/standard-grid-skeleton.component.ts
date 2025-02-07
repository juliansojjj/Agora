import { Component } from '@angular/core';

@Component({
  selector: 'app-standard-grid-skeleton',
  imports: [],
  template: `
    <div class="w-full relative h-full grid md:grid-cols-3 xsm:grid-cols-2 grid-cols-1 gap-[1rem] place-items-center justify-center place-content-center">


      <div class="h-full w-full xl:min-h-[28rem] min-h-[15rem] aspect-square relative flex flex-col">

        <div class="w-full sm:h-1/2 xsm:h-1/3 h-3/5 object-cover overflow-hidden">
          <div class="w-full h-full object-cover skeletonImg"></div>
        </div>

        <div class="w-full sm:h-1/2 xsm:h-2/3 h-2/5 p-2 z-10"> 

          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>

        </div>
      </div>
      <div class="h-full w-full aspect-square relative flex flex-col">

        <div class="w-full sm:h-1/2 xsm:h-1/3 h-3/5 object-cover overflow-hidden">
          <div class="w-full h-full object-cover skeletonImg"></div>
        </div>

        <div class="w-full sm:h-1/2 xsm:h-2/3 h-2/5 p-2 z-10"> 

          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>

        </div>
      </div>
      <div class="h-full w-full aspect-square relative flex flex-col">

        <div class="w-full sm:h-1/2 xsm:h-1/3 h-3/5 object-cover overflow-hidden">
          <div class="w-full h-full object-cover skeletonImg"></div>
        </div>

        <div class="w-full sm:h-1/2 xsm:h-2/3 h-2/5 p-2 z-10"> 

          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>

        </div>
      </div>
      <div class="h-full w-full aspect-square relative flex flex-col">

        <div class="w-full sm:h-1/2 xsm:h-1/3 h-3/5 object-cover overflow-hidden">
          <div class="w-full h-full object-cover skeletonImg"></div>
        </div>

        <div class="w-full sm:h-1/2 xsm:h-2/3 h-2/5 p-2 z-10"> 

          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>

        </div>
      </div>
      
    </div>
  `,
  styles: ``
})
export class StandardGridSkeletonComponent {

}
