import { Component, input, model, output } from '@angular/core';
import { User } from '@auth0/auth0-angular';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [],
  template: `
    @if (menu() ) {
      <div class="absolute right-0 top-0 w-60 h-full z-10 bg-slate-200 flex flex-col items-start">
        <div>
          <!-- <span>{{user().email}}</span> -->
        <button (click)="menuTrigger()">Close Menu</button>
        </div>
        <button (click)="onLogout.emit()">Cerrar sesión</button>
      </div>
    }
  `,
  styles: ``,
})
export class MenuComponent {
  menu = model<boolean>();
  user = input<User>();

  onLogout = output()

  menuTrigger() {
    this.menu.update((value) => !value);
  }
}
