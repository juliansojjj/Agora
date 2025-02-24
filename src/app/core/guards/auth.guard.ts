import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { map, of, switchMap, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const user = inject(FirebaseService).user$
  
  const router = inject(Router);
  return user.pipe( 
    switchMap(res=>{
      if(res) return of(true);
      else return router.navigate(['/']).then(() => false)
    })
  )
};
