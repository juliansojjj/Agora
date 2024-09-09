import { Component, effect, inject, input, model, OnInit, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { jwtRes } from './shared/interfaces/responses.interface';
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

    <app-menu [(menu)]="menu"  (user)="user" (onLogout)="logout()"/>

    <app-header [(menu)]="menu" [userLogged]="" (onLogin)="login()"/>

    <ng-container *ngIf=""> 
  <span>estas logueado</span>
    </ng-container>

      <ng-template #pepe>
     <button (click)="login()">login</button>

      </ng-template>

    <router-outlet />

  </div>`,
})






export class AppComponent implements OnInit{
  //token logic


  private platformId = inject(PLATFORM_ID);
  isBrowser: boolean = false;

  //menu logic
  menu:boolean = false;

  //auth0 logic
  user?:any;


  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);


  }

  ngOnInit():void{
    
   
  }

  login() {
  }

  logout(){
  }


}
