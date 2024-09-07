import { Component, effect, input, model, output } from '@angular/core';
import { AsyncPipe, isPlatformBrowser, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, AsyncPipe, NgIf, MenuComponent],
  template: `
    <header class="h-[7rem] w-full   flex flex-col justify-between ">
      <nav>
        <ul class="grid grid-cols-[1fr_1fr_1fr] w-full bg-red-500 place">
          <li class="place-self-start">Busqueda</li>
          <li class="place-self-center"><a routerLink="/">Logo</a></li>
          <li class="place-self-end flex">
            <ng-container *ngIf="userLogged() !== null || userLogged() !== undefined; else login">
              <button (click)="menuTrigger()">Cuenta {{userLogged()}}</button>
            </ng-container>
          </li>
        </ul>
      </nav>
      <ul class="flex justify-evenly w-full bg-green-500">
        <li><a [routerLink]="['/category', 'politics']">Politics</a></li>
        <li><a [routerLink]="['/category', 'economy']">Economy</a></li>
        <li><a [routerLink]="['/category', 'sports']">Sports</a></li>
        <li><a [routerLink]="['/category', 'tech']">Tech</a></li>
        <li>
          <a [routerLink]="['/category', 'entertainment']">Entertainment</a>
        </li>
      </ul>

      <ng-template #login>
        <button (click)="onLogin.emit()">Iniciar sesión {{userLogged()}}</button>
      </ng-template>
    </header>
  `,
  styles: ``,
})
export class HeaderComponent {
  menu = model<boolean>();
  
  userLogged = input<boolean|null>();

  onLogin = output()

  menuTrigger() {
    this.menu.update((value) => !value);
  }

}
