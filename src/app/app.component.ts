import { Component, effect, inject, input, model, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { Observable } from 'rxjs';
import { MenuComponent } from './core/components/menu/menu.component';
import { AsyncPipe, isPlatformBrowser, JsonPipe, NgIf } from '@angular/common';
import { toSignal, ToSignalOptions } from '@angular/core/rxjs-interop';







@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MenuComponent, AsyncPipe, NgIf],
  template: ` 
  <div class="h-dvh flex flex-col">

    <app-menu [(menu)]="menu"  />

    <app-header [(menu)]="menu" />



    <router-outlet />

  </div>`,
})






export class AppComponent  {
  menu:boolean = false;
}
