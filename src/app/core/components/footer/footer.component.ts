import { Component, inject, model } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter } from 'rxjs';

@Component({
    selector: 'app-footer',
    imports: [RouterLink],
    template: `
  @if(visibility()){
    <footer class="flex items-center flex-col justify-between md:justify-center w-full h-[27vh] sm:h-[33vh] md:h-[38vh] bg-brandViolet mt-32 relative overflow-hidden">
      <img class="w-fit h-[10rem] -mt-[4.2rem] block md:hidden" src="agora-logo-fill.svg" alt="Agora Logo">

      <ul class="flex flex-row items-center font-medium justify-center h-fit text-white text-[1.2rem] md:text-[1.4rem] max-md:mb-10">
      <a [routerLink]="['/sitemap']"
        class="hover:text-black mr-[1.2rem]"
        ><li>Sitemap</li>
      </a>
      <a [routerLink]="['/about']"
        class="hover:text-black"
        ><li>About Agora</li>
      </a>
      </ul>

      <img class="h-[125%] hidden md:block absolute right-0 -mr-[.1rem] top-0 bottom-0 my-auto" src="agora-logo-fill-footer.svg" alt="Agora Logo">
    </footer>
  }
  `,
    styles: ``
})
export class FooterComponent {
  router = inject(Router);

  visibility = model<boolean>(false);
  constructor() {
      this.router.events
        .pipe(filter((event) => event instanceof NavigationEnd))
        .subscribe((event) => {
          if (
            event.url === '/login' ||
            event.url === '/register'
          ) {
            this.visibility.set(false);
          } else {
            this.visibility.set(true);
          }
        });
    }
}
