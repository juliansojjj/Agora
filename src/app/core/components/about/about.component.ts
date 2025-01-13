import { Component } from '@angular/core';

@Component({
    selector: 'app-about',
    imports: [],
    template: `
    <div class="w-full xl:grid xl:grid-cols-[9%_82%_9%]  flex flex-col items-center md:pt-6 xl:px-0 sm:px-6 px-0">
    <div></div>

    <section class="flex flex-col">
      <h1 class="font-bold text-center mt-14 text-brandViolet 
      xl:pl-6
      lg:text-[5rem] 
      md:text-start
      sm:text-[3.5rem] sm:px-0
      xsm:text-[3rem] xsm:px-4     
      px-2 text-[2.3rem]">
        About Agora
      </h1>
    </section>

    <div></div>
  </div>
  `,
    styles: ``
})
export class AboutComponent {

}
