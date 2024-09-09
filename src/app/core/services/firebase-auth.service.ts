import { inject, Injectable, input } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, updateProfile, signOut, signInWithEmailAndPassword, authState, user } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { FirebaseUser } from '../../models/firebase-user.model';
import { error } from 'console';

@Injectable({
  providedIn: 'root'
})
export class FirebaseAuthService {
  authService = inject(Auth)

  //authState es obs https://github.com/FirebaseExtended/rxfire/blob/main/docs/auth.md
  authState$ = authState(this.authService)
  //lo mismo con user
  user$:Observable<FirebaseUser> = user(this.authService)

  
  constructor() { }

  signup(username:string,email:string,password:string):Observable<void>{
    const createUser = createUserWithEmailAndPassword(this.authService,email,password)
    .then(res=>{ 
      console.log('usuario creado' + res)
      updateProfile(res.user,{displayName:username})})
    .catch(error=>console.log(error))

    return from(createUser)
  }

  login(email:string,password:string):Observable<void>{
    const signIn = signInWithEmailAndPassword(this.authService,email,password)
    .then(res=>{ 
      console.log('login' + res)
    })
    
    return from(signIn)
  }

  logout(){
    signOut(this.authService)
  }

}
