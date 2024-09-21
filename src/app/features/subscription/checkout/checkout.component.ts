import { Component, inject, model, OnInit } from '@angular/core';
import { FirebaseService } from '../../../core/services/firebase.service';
import { AsyncPipe } from '@angular/common';
import { FirebaseAuthUser } from '../../../shared/interfaces/firebase.interfaces';
import { catchError, map, switchMap } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @if (authState$ | async) {
      <section>
        <button (click)="onSubscription()">Simulate subscription</button>
      </section>
    } @else {
      <span>There was an error in your authentication</span>
    }
  `,
})
export class CheckoutComponent {
  firebaseService = inject(FirebaseService);
  authState$ = this.firebaseService.authState$;

  router = inject(Router)

  uid = model<string>()

  onSubscription() {
    if (this.uid()) {
      this.firebaseService.handleSubscription(this.uid()!, true)
      .subscribe(
        () => {
          this.router.navigate(['/'])
        }
      );

    }
  }

  ngOnInit(): void {
    this.authState$.subscribe((res:FirebaseAuthUser)=> this.uid.set(res.uid))
  }
}
