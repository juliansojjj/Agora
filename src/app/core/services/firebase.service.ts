import { inject, Injectable, input } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  signInWithEmailAndPassword,
  authState,
  user,
} from '@angular/fire/auth';
import { debounceTime, filter, from, map, Observable, of, take } from 'rxjs';
import {
  FirebaseAuthUser,
  FirestoreCollectionUser,
} from '../../models/firebase.models';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
} from '@angular/fire/firestore';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FirebaseService {
  authService = inject(Auth);
  firestoreService = inject(Firestore);

  //authState es obs https://github.com/FirebaseExtended/rxfire/blob/main/docs/auth.md
  authState$ = authState(this.authService);
  //lo mismo con user
  user$: Observable<FirebaseAuthUser> = user(this.authService);

  constructor() {}


  checkUsername() {
    return (control: AbstractControl) => {

      const ref = collection(this.firestoreService, 'users');
      const result = collectionData(ref);
      return from(result).pipe(
        debounceTime(200),
        take(1),
        map((users:FirestoreCollectionUser[]) => {
           return users.filter(
            (item: FirestoreCollectionUser) =>
              item.username.toLowerCase() == control.value.toLowerCase(),
          ).length ? {usernameTaken:true} : null
        })
      );
    };
  }


  documentUser(username: string, email: string) {
    const ref = collection(this.firestoreService, 'users');
    const doc = addDoc(ref, {
      username: username,
      email: email,
      subscription: false,
    });
    return from(doc);
  }

  signup(username: string, email: string, password: string): Observable<any> {
    const createUser = createUserWithEmailAndPassword(
      this.authService,
      email,
      password,
    )
      .then((res) => {
        updateProfile(res.user, { displayName: username });
      })
      .then(() => this.documentUser(username, email))
      .catch((error) => {
        throw new Error(error);
        console.log('alal' + error);
      });

    return from(createUser);
  }

  login(email: string, password: string): Observable<void> {
    const signIn = signInWithEmailAndPassword(
      this.authService,
      email,
      password,
    ).then((res) => {
      console.log('login' + res);
    });

    return from(signIn);
  }

  logout() {
    signOut(this.authService);
  }
}
