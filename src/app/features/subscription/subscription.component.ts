import { Component, inject, OnInit } from '@angular/core';
import { FirebaseService } from '../../core/services/firebase.service';
import { AsyncPipe, NgIf } from '@angular/common';

@Component({
  selector: 'app-subscription',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  template:`
    @if(authState$ | async; as authState){
      {{authState}}
    }
  `
})
export class SubscriptionComponent implements OnInit {
  firebaseService = inject(FirebaseService)

  authState$ = this.firebaseService.authState$

  ngOnInit(): void {
    this.authState$.subscribe((res:any)=>{
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