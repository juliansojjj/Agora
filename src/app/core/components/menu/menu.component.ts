import { Component, inject, input, model, OnInit, output, Signal } from '@angular/core';
import { FirebaseService } from '../../services/firebase.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FirebaseAuthUser } from '../../../shared/interfaces/firebase.interfaces';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  template: `
    @if (menu() ) {
      <div class="absolute right-0 top-0 w-60 h-full z-10 bg-slate-200 flex flex-col items-start">
        <div>
          <span>{{user()?.email}}</span>
        <button (click)="menuTrigger()">Close Menu</button>
        </div>
        <button (click)="onLogout()">Cerrar sesión</button>
      </div>
    }
  `,
  styles: ``,
})
export class MenuComponent{
  menu = model<boolean>();
  firebaseAuth = inject(FirebaseService)

  user= toSignal(this.firebaseAuth.user$)

  onLogout (){
    this.firebaseAuth.logout()
    this.menuTrigger()
  }

  menuTrigger() {
    this.menu.update((value) => !value);
  }

}
