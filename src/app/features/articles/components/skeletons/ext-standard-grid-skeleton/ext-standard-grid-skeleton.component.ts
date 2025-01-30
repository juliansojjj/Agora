import { Component } from '@angular/core';

@Component({
  selector: 'app-ext-standard-grid-skeleton',
  imports: [],
  template: `
    <div class="w-full relative h-full place-items-center justify-center grid  
    2xl:grid-cols-4
    xl:grid-cols-3
    sm:grid-cols-2
    xsm:gap-[1rem]
    grid-cols-1 gap-[.5rem]
    ">
      <div class="xsm:w-full w-[95%] h-full sm:aspect-square aspect-[3/1]  overflow-hidden relative flex">
        <div class="w-full h-full object-cover skeletonImg"></div>

        <div class="bg-white flex flex-col sm:absolute bottom-0 sm:h-2/5 h-full relative w-full z-10 p-0 px-1 xsm:pt-2 xsm:px-3"> 
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>
        </div>
      </div>


      <div class="xsm:w-full w-[95%] h-full sm:aspect-square aspect-[3/1]  overflow-hidden relative flex">
        <div class="w-full h-full object-cover skeletonImg"></div>

        <div class="bg-white flex flex-col sm:absolute bottom-0 sm:h-2/5 h-full relative w-full z-10 p-0 px-1 xsm:pt-2 xsm:px-3"> 
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>
        </div>
      </div>


      <div class="xsm:w-full w-[95%] h-full sm:aspect-square aspect-[3/1]  overflow-hidden relative flex">
        <div class="w-full h-full object-cover skeletonImg"></div>

        <div class="bg-white flex flex-col sm:absolute bottom-0 sm:h-2/5 h-full relative w-full z-10 p-0 px-1 xsm:pt-2 xsm:px-3"> 
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>
        </div>
      </div>

      
      <div class="xsm:w-full w-[95%] h-full sm:aspect-square aspect-[3/1]  overflow-hidden relative flex">
        <div class="w-full h-full object-cover skeletonImg"></div>

        <div class="bg-white flex flex-col sm:absolute bottom-0 sm:h-2/5 h-full relative w-full z-10 p-0 px-1 xsm:pt-2 xsm:px-3"> 
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>
        </div>
      </div>
      <div class="xsm:w-full w-[95%] h-full sm:aspect-square aspect-[3/1]  overflow-hidden relative flex">
        <div class="w-full h-full object-cover skeletonImg"></div>

        <div class="bg-white flex flex-col sm:absolute bottom-0 sm:h-2/5 h-full relative w-full z-10 p-0 px-1 xsm:pt-2 xsm:px-3"> 
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>
        </div>
      </div>


      <div class="xsm:w-full w-[95%] h-full sm:aspect-square aspect-[3/1]  overflow-hidden relative flex">
        <div class="w-full h-full object-cover skeletonImg"></div>

        <div class="bg-white flex flex-col sm:absolute bottom-0 sm:h-2/5 h-full relative w-full z-10 p-0 px-1 xsm:pt-2 xsm:px-3"> 
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>
        </div>
      </div>


      <div class="xsm:w-full w-[95%] h-full sm:aspect-square aspect-[3/1]  overflow-hidden relative flex">
        <div class="w-full h-full object-cover skeletonImg"></div>

        <div class="bg-white flex flex-col sm:absolute bottom-0 sm:h-2/5 h-full relative w-full z-10 p-0 px-1 xsm:pt-2 xsm:px-3"> 
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>
        </div>
      </div>


      <div class="xsm:w-full w-[95%] h-full sm:aspect-square aspect-[3/1]  overflow-hidden relative flex">
        <div class="w-full h-full object-cover skeletonImg"></div>

        <div class="bg-white flex flex-col sm:absolute bottom-0 sm:h-2/5 h-full relative w-full z-10 p-0 px-1 xsm:pt-2 xsm:px-3"> 
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-full h-[1rem] sm:h-[1.2rem] mb-[.3rem] skeletonElement"></div>
          <div class="w-[85%] h-[1rem] sm:h-[1.2rem] skeletonElement"></div>
        </div>
      </div>
      
    </div>
  `,
  styles: ``
})
export class ExtStandardGridSkeletonComponent {

}
