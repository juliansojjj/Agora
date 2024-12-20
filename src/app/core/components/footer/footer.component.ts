import { Component, inject, model } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [],
  template:`
  @if(visibility()){
    <footer class="w-full aspect-[5/1] bg-brandViolet mt-32">

    </footer>
  }
  `,
  styles:``
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
