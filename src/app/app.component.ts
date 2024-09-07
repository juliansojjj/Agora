import { Component, effect, inject, input, model, PLATFORM_ID, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './core/components/header/header.component';
import { LocalAuthService } from './services/local-auth.service';
import { jwtRes } from './shared/interfaces/responses.interface';
import { Observable } from 'rxjs';
import { MenuComponent } from './core/components/menu/menu.component';
import { AuthService, User } from '@auth0/auth0-angular';
import { AsyncPipe, isPlatformBrowser, JsonPipe, NgIf } from '@angular/common';
import { toSignal, ToSignalOptions } from '@angular/core/rxjs-interop';







@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, MenuComponent, AsyncPipe, NgIf],
  template: ` 
  <div class="h-dvh flex flex-col">

    <app-menu [(menu)]="menu"  (user)="user" (onLogout)="logout()"/>

    <app-header [(menu)]="menu" [userLogged]="authService?.isAuthenticated$ | async" (onLogin)="login()"/>

    <ng-container *ngIf="authService?.isAuthenticated$ | async; else pepe"> 
  <span>estas logueado</span>
    </ng-container>

      <ng-template #pepe>
     <button (click)="login()">login</button>

      </ng-template>

    <router-outlet />

  </div>`,
})






export class AppComponent {
  //token logic
  private localAuthService = inject(LocalAuthService);

  tokenCheck:string|null = this.localAuthService.getTokenFromCookie()
  data$: Observable<jwtRes> = this.localAuthService.getToken();

  private platformId = inject(PLATFORM_ID);
  isBrowser: boolean = false;

  //menu logic
  menu:boolean = false;

  //auth0 logic
  authService?: AuthService;
  user?:any;


  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    if (this.isBrowser) {
      this.authService = inject(AuthService);
      this.user = this.authService.user$.subscribe(item=>{return item})

      effect(()=>{
        console.log(this.authService)
      })
    }

    effect(()=>{
      if(!this.tokenCheck){
        this.data$.subscribe({
          next: (response) => {
            this.localAuthService.saveTokenInCookie(response.access_token);
            window.location.reload()
          },
          error: (err) => {
            console.error(err);
          },
        });
      }
    })

  }

  ngOnInit():void{
    console.log(this.authService)

  }

  login() {
    if (this.authService) {
    console.log('llamado login')

      this.authService.loginWithRedirect();
    }
  }

  logout(){
    this.authService?.logout()
  }


}
