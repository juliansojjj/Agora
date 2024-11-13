import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { FirebaseService } from '../services/firebase.service';
import { map, of, switchMap, take } from 'rxjs';

export const nonAuthGuard: CanActivateFn = (route, state) => {
  const user = inject(FirebaseService).user$
  const router = inject(Router);
  return user.pipe( 
    switchMap(res=>{
      if(res){
        
        return router.navigate(['/']).then(() => false);

      }else return of(true);
    })
  )
};
