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
import { debounceTime, filter, from, map, Observable, ObservableInput, of, take } from 'rxjs';
import {
  FirebaseAuthUser,
  FirestoreCollectionUser,
} from '../../shared/interfaces/firebase.interfaces';
import {
  addDoc,
  collection,
  collectionData,
  Firestore,
  doc,
  getDoc,
  query,
  where,
  DocumentData,
  setDoc
} from '@angular/fire/firestore';
import { AbstractControl } from '@angular/forms';
import { Article } from '../../shared/interfaces/article.interface';

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
// ----------------------- ARTICLES
  getLandingArticles() {
    const ref = collection(this.firestoreService, 'articles');
    const result = collectionData(ref, { idField: 'id' });
    return from(result);
  }

  getCategoryArticles(category:string) {
    const ref = collection(this.firestoreService, 'articles')
    const result = collectionData(query(ref,where('category','==',category)))

    return from(result);
    

  }
  getSingleArticle(id:string) {
    const ref = doc(this.firestoreService, 'articles', id);
    const result = getDoc(ref)

    return from(result.then(docSnapshot => {
      if (docSnapshot.exists()) {
        return docSnapshot.data() as Article;
      } else {
        throw new Error('No such document!');
      }
    }))
  }
  getArticleComments(id:string){
    const ref = collection(this.firestoreService, 'articles',id,'comments');
    const result = collectionData(ref,{ idField: 'id' });

    return from(result)
  }


// ----------------------- AUTH

checkSubscription(uid:string){
  const ref = doc(this.firestoreService, 'users', uid);
    const result = getDoc(ref)

    return from(result.then(docSnapshot => {
      if (docSnapshot.exists()) {
        return docSnapshot.data() as FirestoreCollectionUser;
      } else {
        throw new Error('No such document!');
      }
    }))
}
  checkUsername() {
    const ref = collection(this.firestoreService, 'users');
    const result = collectionData(ref);
    return (control: AbstractControl) => {
      return from(result).pipe(
        debounceTime(200),
        take(1),
        map((users: FirestoreCollectionUser[]) => {
          return users.filter(
            (item: FirestoreCollectionUser) =>
              item.username.toLowerCase() == control.value.toLowerCase(),
          ).length
            ? { usernameTaken: true }
            : null;
        }),
      );
    };
  }

  documentUser(username: string, email: string, id:string) {
    const ref = collection(this.firestoreService, 'users');
    const res = setDoc(doc(ref, id),
    { 
      username: username,
      email: email,
      subscription: false,
    } )
    return from(res);
  }

  signup(username: string, email: string, password: string): Observable<any> {
    let uid:string
    const createUser = createUserWithEmailAndPassword(
      this.authService,
      email,
      password,
    )
      .then((res) => {
        updateProfile(res.user, { displayName: username });
        uid = res.user.uid
      })
      .then(() => this.documentUser(username, email,uid));

    return from(createUser);
  }

  login(email: string, password: string): Observable<any> {
    const signIn = signInWithEmailAndPassword(
      this.authService,
      email,
      password,
    );

    return from(signIn);
  }

  logout() {
    signOut(this.authService);
  }
}
