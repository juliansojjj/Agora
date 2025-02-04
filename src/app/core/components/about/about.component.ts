import { Component } from '@angular/core';

@Component({
    selector: 'app-about',
    imports: [],
    template: `
    <div class="w-full xl:grid xl:grid-cols-[9%_82%_9%]  flex flex-col items-center md:pt-6 xl:px-0 sm:px-6 px-0">
    <div></div>

    <section class="flex flex-col max-xl:items-center">
      <h1 class="font-bold text-center mb-8 text-brandViolet 
      xl:p-0
      lg:text-[5rem] 
      md:text-start
      sm:text-[3.5rem] sm:px-0
      xsm:text-[3rem] xsm:px-4     
      px-2 text-[2.3rem]">
        About Agora
      </h1>
      <h2 class="font-semibold text-center text-brandShade 
      xl:p-0
      lg:text-[3.5rem] 
      md:text-start
      sm:text-[2.5rem] sm:px-0
      xsm:text-[2rem] xsm:px-4     
      px-2 text-[1.8rem]">
      What is Agora?
      </h2>

      <p class="w-[75%] sm:w-1/2 my-4 max-lg:text-center lg:text-[1.3rem] sm:text-[1.2rem] text-[1.1rem]">Agora is a mock news website. The project, branding, and website were created from scratch, using Figma for design, Angular as the web framework and Firebase for the backend and user authentication.
      </p>

      <h2 class="font-semibold text-center mt-4 text-brandShade 
      xl:p-0
      lg:text-[3.5rem] 
      md:text-start
      sm:text-[2.5rem] sm:px-0
      xsm:text-[2rem] xsm:px-4     
      px-2 text-[1.8rem]">
      Content and disclaimer
      </h2>

      <p class="w-[75%] sm:w-1/2 my-4 max-lg:text-center lg:text-[1.3rem] sm:text-[1.2rem] text-[1.1rem]">The news displayed belong almost entirely to Mashable, except for a few articles from TechCrunch. None of the material is used in a profitable or commercial way but for demonstration purposes only. The source of each piece of content is indicated in every single article and author page.</p>

      <p class="w-[75%] sm:w-1/2 mt-8 lg:text-[1.3rem] sm:text-[1.2rem] text-[1.1rem]">For more details visit the project's page in my <a href="" target="_blank" class="text-brandViolet font-bold hover:bg-brandViolet hover:text-white">portfolio</a></p>
    </section>

    <div></div>
  </div>
  `,
    styles: ``
})
export class AboutComponent {

}
