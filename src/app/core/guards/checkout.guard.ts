import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { FirebaseAuthUser, FirestoreCollectionUser } from '../../shared/interfaces/firebase.interfaces';
import { map, Observable, switchMap, take } from 'rxjs';

export const checkoutGuard: CanActivateFn = (route, state) => {
  const firebaseService = inject(FirebaseService)

  const authState$ = firebaseService.authState$



  return authState$.pipe(
    take(1),
    map((auth:null|FirebaseAuthUser)=>{
      if(!auth) return true
      else return auth
    }),
    switchMap((auth:FirebaseAuthUser)=>{
      return firebaseService.checkSubscription(auth.uid)
      .pipe(
        take(1),
        map((res:FirestoreCollectionUser)=>{
        if(res.subscription) return false
        else return true
      }))
    })
  )
};
