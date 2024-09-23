import { inject, Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import {
  ActivatedRouteSnapshot,
  Resolve,
  Router,
  RouterStateSnapshot,
  TitleStrategy,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TitleStrategyService extends TitleStrategy {
  title = inject(Title);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot);

    const firstChild = snapshot.root.firstChild;
    const category = firstChild?.params['title'] || '';

    if (category) {
      this.title.setTitle(`Agora - ${category}`);
      return;
    } else if (title) {
      this.title.setTitle(`Agora - ${title}`);
      return;
    } else {
      this.title.setTitle('Agora');
      return;
    }
  }
}

// https://dev.to/railsstudent/update-page-title-with-title-strategy-in-angular-3afa
