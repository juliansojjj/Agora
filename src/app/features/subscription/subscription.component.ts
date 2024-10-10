import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { AsyncPipe, NgIf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Observable, switchMap } from 'rxjs';
import { UserInfo } from '@angular/fire/auth';
import { FirestoreCollectionUser } from '../../shared/interfaces/firebase.interfaces';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [NgIf, AsyncPipe, RouterLink],
  template:`
    @if(subscriptionState$ | async; as subscription){
      @if(subscription.subscription){
        WHY DO YOU WANT TO QUIT?
      }@else {
        <a [routerLink]="['/subscription/checkout']" [queryParams]="[{subscriptionRedirect:true}]">SUSCRIBITE</a>
      }

    } @else{
      <a [routerLink]="['/register']" [queryParams]="{subscriptionRedirect:true}">SUSCRIBITE (register)</a>


    }
  `
})
export class SubscriptionComponent implements OnInit {
  firebaseService = inject(FirebaseService)
  router = inject(Router)

  authState$ = this.firebaseService.authState$
  subscriptionState$: Observable<FirestoreCollectionUser> = this.authState$.pipe(
    switchMap((auth:any)=>{
      return this.firebaseService.getUserInfo(auth.uid)
    })
  )

  loginRedirect(){
    this.router.navigate(
      ['/register'], 
      { queryParams: 
          { term: 'angular', page: 2 } 
      }
  );
  
  }

  ngOnInit(): void {
    this.authState$.subscribe((res:any)=>{
      console.log(res)
    })
    this.subscriptionState$.subscribe((res:any)=>{
      console.log(res)
    })
  }




}

/*
Si usuario Y sub: desuscribirse
EN CUALQUIER otro caso: botones para suscribirse

si existe, queremos hacer una llamada al usuario en firestore y comprobar la suscripcion 
si no existe 

llamada a servicio:
1) checkea login
2) checkea subscription
*/