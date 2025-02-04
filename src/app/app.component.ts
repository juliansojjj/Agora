import { Component, effect, inject, input, model, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { Observable } from 'rxjs';
import { MenuComponent } from './core/components/menu/menu.component';
import { AsyncPipe, isPlatformBrowser, JsonPipe, NgClass, NgIf } from '@angular/common';
import { toSignal, ToSignalOptions } from '@angular/core/rxjs-interop';

import { FooterComponent } from './core/components/footer/footer.component';


@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, MenuComponent, FooterComponent],
    template: ` 
  <ng-container class="flex flex-col min-h-fit">

    <app-menu [(menu)]="menu"  />

    <app-header [(menu)]="menu"  />


    <router-outlet/>

    <app-footer />
  </ng-container>`
})

export class AppComponent  {
  menu:boolean = false;
}
