import { Component } from '@angular/core';

@Component({
    selector: 'app-not-found',
    imports: [],
    template: `
    <div class="w-full xl:grid xl:grid-cols-[9%_82%_9%] flex pt-6 xl:pl-0 pl-6 h-screen overflow-y-hidden">
      <div></div>
      <div class="flex max-md:flex-col">
        <h1 class=" font-bold lg:text-[5rem] sm:text-[3.5rem] xsm:text-[3rem] text-[2.3rem] text-brandShade">404 Page <span class="text-brandViolet">Not Found</span></h1>
        <div class="flex flex-col mt-[1rem] md:mt-[6rem] max-md:w-full items-center">
          <div class="bg-brandViolet triangleShape"></div>
          <div class="bg-brandShade triangleShape"></div>
          <div class="bg-brandShade triangleShape"></div>
          <div class="bg-brandShade triangleShape md:block hidden"></div>
        </div>
      </div>
      <div></div>
    </div>
  `,
    styles: `
  .triangleShape{
    margin-bottom:6rem;
    width:6rem;
    height:6rem;
    aspect-ratio:1/1;
    clip-path: polygon(
      0% 0%,
      100% 0%,
      50% 100%);
  }
`
})
export class NotFoundComponent {

}
