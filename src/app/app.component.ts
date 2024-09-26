import { Component, effect, inject, input, model, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { Observable } from 'rxjs';
import { MenuComponent } from './core/components/menu/menu.component';
import { AsyncPipe, isPlatformBrowser, JsonPipe, NgIf } from '@angular/common';
import { toSignal, ToSignalOptions } from '@angular/core/rxjs-interop';

import '@fontsource-variable/montserrat';






@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MenuComponent, AsyncPipe, NgIf],
  template: ` 
  <ng-container class="flex flex-col min-h-fit" >

    <app-menu [(menu)]="menu"  />

    <app-header [(menu)]="menu"  />


  <router-outlet />


  </ng-container>`,
})

export class AppComponent  {
  menu:boolean = false;
}
