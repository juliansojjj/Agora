import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const user = inject(FirebaseService).user$
  
  return user.pipe( 
    take(1),
    map(res=>{
      return res ? false : true
    })
  )
};
