import { Component } from '@angular/core';

@Component({
  selector: 'app-main2-grid-skeleton',
  imports: [],
  template: `
  <div class="h-fit w-full relative 
    xl:grid-cols-[1fr_19.8rem]
    lg:grid-cols-[1fr_16.5rem] lg:grid
    flex flex-col
    ">

      <div class="w-full max-sm:h-[55vh] max-lg:h-[60vh] lg:max-h-[86vh] relative">
        <div class="absolute w-full h-full left-0 bottom-0  
        2xl:grid-rows-[26.4rem_13.2rem_6.6rem_3.3rem]
        xl:grid-rows-[1fr_13.2rem_6.6rem_3.3rem] xl:grid
        flex items-end z-10">
          <div class="lg:block hidden"></div>

          <div class="hidden xl:flex flex-col h-full justify-end">
          </div>

          <div class="lg:grid
          2xl:grid-cols-[6.6rem_1fr_13.2rem] 
          xl:grid-cols-[6.6rem_1fr_3.3rem] 
          lg:grid-cols-[3.3rem_1fr_3.3rem] flex">
            <div></div>
            
            <div class="max-lg:min-w-[100vw] flex-col h-fit bg-white flex p-5">
              <div class="w-full h-[2rem] mb-[.6rem] skeletonElement"></div>
              <div class="w-[85%] h-[2rem] skeletonElement"></div>
            </div>

            <div class="w-full hidden 2xl:flex justify-end">
            </div>
          </div>

          <div></div>
        </div>
        <div class="w-full h-full overflow-hidden skeletonImg">
        </div>
      </div>

      <div class="w-full h-[1rem] bg-brandViolet max-md:block hidden"></div>
      <div class="w-full h-[1rem] bg-brandShade max-md:block hidden"></div>

      <div class="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col w-full lg:h-[46.2rem] relative">
        <div class="w-full h-[46.2rem] absolute top-0 lg:grid hidden grid-rows-[3.3rem_9.9rem_3.3rem_9.9rem_3.3rem_9.9rem_3.3rem_3.3rem]">
          <div></div>
          <div></div>
          <div class="w-full flex justify-between">
          </div>
          <div></div>
          <div class="w-full flex justify-between">
          </div>
          <div></div>
        </div>

            <div class="lg:p-6 relative flex flex-col
            lg:w-[16.5rem] lg:h-[9.9rem] lg:mt-[3.3rem] 
            sm:h-[15rem] sm:pt-8 sm:items-start
            w-full h-[7rem] px-6 items-center">
             <div class="w-full h-[1rem] sm:h-[1.5rem] mb-[.6rem] skeletonElement"></div>
             <div class="w-full h-[1rem] sm:h-[1.5rem] mb-[.6rem] skeletonElement"></div>
              <div class="w-[85%] h-[1rem] sm:h-[1.5rem] self-end skeletonElement"></div>
            </div>
            <div class="lg:p-6 relative flex flex-col
            lg:w-[16.5rem] lg:h-[9.9rem] lg:mt-[3.3rem] 
            sm:h-[15rem] sm:pt-8 sm:items-start
            w-full h-[7rem] pt-2 px-6 items-center">
             <div class="w-full h-[1rem] sm:h-[1.5rem] mb-[.6rem] skeletonElement"></div>
             <div class="w-full h-[1rem] sm:h-[1.5rem] mb-[.6rem] skeletonElement"></div>
              <div class="w-[85%] h-[1rem] sm:h-[1.5rem] self-end skeletonElement"></div>
            </div>
            <div class="lg:p-6 relative flex flex-col
            lg:w-[16.5rem] lg:h-[9.9rem] lg:mt-[3.3rem] 
            sm:h-[15rem] sm:pt-8 sm:items-start
            w-full h-[7rem] px-6 items-center">
             <div class="w-full h-[1rem] sm:h-[1.5rem] mb-[.6rem] skeletonElement"></div>
             <div class="w-full h-[1rem] sm:h-[1.5rem] mb-[.6rem] skeletonElement"></div>
              <div class="w-[85%] h-[1rem] sm:h-[1.5rem] self-end skeletonElement"></div>
            </div>
        
      </div>
    
    </div>
  `,
  styles: `
  `
})
export class Main2GridSkeletonComponent {

}
