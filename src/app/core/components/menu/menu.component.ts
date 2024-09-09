import { Component, inject, input, model, OnInit, output, Signal } from '@angular/core';
import { FirebaseAuthService } from '../../services/firebase-auth.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { FirebaseUser } from '../../../models/firebase-user.model';

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
export class MenuComponent implements OnInit{
  menu = model<boolean>();
  firebaseAuth = inject(FirebaseAuthService)

  user= toSignal(this.firebaseAuth.user$)

  onLogout (){
    this.firebaseAuth.logout()
    this.menuTrigger()
  }

  menuTrigger() {
    this.menu.update((value) => !value);
  }

  ngOnInit(): void {
    this.firebaseAuth.user$.subscribe((res:any)=>console.log(res))
  }
}
