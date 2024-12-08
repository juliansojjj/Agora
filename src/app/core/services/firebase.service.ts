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
import { debounceTime, filter, forkJoin, from, map, Observable, ObservableInput, of, take } from 'rxjs';
import {
  FirebaseAuthUser,
  FirestoreCollectionUser,
} from '../../shared/interfaces/firebase.interfaces';
import { documentId } from 'firebase/firestore';
import {
  addDoc,
  collection,
  Firestore,
  doc,
  getDoc,
  query,
  where,
  DocumentData,
  setDoc,
  updateDoc,
  collectionData,
  serverTimestamp,
  FieldValue,
  arrayUnion,
  arrayRemove,
  docData
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
    const result = collectionData(ref, { idField: 'articleID' });
    return from(result);
  }

  getAuthorArticles(authorID:string){
    const ref = collection(this.firestoreService, 'articles')
    const result = collectionData(query(ref,where('authorID','==',authorID)))

    return from(result);
  }

  getFavoriteArticles(ids:string[]){
    const ref = collection(this.firestoreService, 'articles')

    if(ids.length <= 30){
      const result = collectionData(query(ref,where(documentId(),'in',ids)), { idField: 'articleID' })
      return from(result)
    }
    else{
      const chunkedArrays:string[][] = []
      for (let i = 0; i < ids.length; i += 30) {
        chunkedArrays.push(ids.slice(i,i+30))
      }

      const observables = chunkedArrays.map((chunk) => {
        return from(
          collectionData(query(ref, where(documentId(), 'in', chunk)), { idField: 'articleID' })
        ).pipe(take(1))
      })

      return forkJoin(observables).pipe(
        map(results=>results.flat())
      )
    }
  }

  getMainCategoryArticles(category:string) {
    const categoryArray = category.split(' ')
    const name = categoryArray.join('-').toLowerCase()
    
    const ref = collection(this.firestoreService, 'articles')
    const result = collectionData(query(ref,where('category','==', name)), { idField: 'articleID' })

    return from(result) ;
  }
  getCategoryArticles(category:string) {
    const categoryArray = category.split(' ')
    const name = categoryArray.join('-').toLowerCase()
    
    const ref = collection(this.firestoreService, 'articles')
    const result = collectionData(query(ref,where('urlTopics','array-contains', name)), { idField: 'articleID' })

    return from(result);
  }


  getSingleArticle(id:string) {
    const ref = doc(this.firestoreService, 'articles', id);
    const result = docData(ref)

    return from(result)
  }
  
  getArticleComments(id:string){
    const ref = collection(this.firestoreService, 'articles',id,'comments');
    const result = collectionData(ref,{ idField: 'commentId' });

    return from(result)
  }


  // ----------------------- FIRESTORE

  
  getCategory(url:string) {
    const ref = collection(this.firestoreService, 'categories')
    const result = collectionData(query(ref,where('url','==',url)))

    return from(result);
  }
  
  getAuthor(id:string) {
    const ref = doc(this.firestoreService, 'authors', id);
    const result = docData(ref)

    return from(result);
  }

  handleSubscription(uid:string,operation:boolean){
    const ref = collection(this.firestoreService, 'users');
    const res = updateDoc(doc(ref, uid),
    { 
      subscription: operation
    } )
    return from(res)
  }
  
  handleFavorite(uid:string,operation:boolean, articleID:string){
    const ref = doc(this.firestoreService, 'users', uid);

    return operation 
    ? from(updateDoc(ref,{favorites:arrayUnion(articleID)})) 
    : from(updateDoc(ref,{favorites:arrayRemove(articleID)})) 
  }

getUserInfo(uid:string){
  const ref = doc(this.firestoreService, 'users', uid);
  const result = docData(ref)

  return from(result)
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

    return from(res)
  }

  addComment(username: string, uid: string, articleID:string, content:string) {
    const ref = collection(this.firestoreService, 'articles',articleID,'comments');

    const res = setDoc(doc(ref),
    { 
      username: username,
      uid:uid,
      content:content,
      date:serverTimestamp(),
      deletedByUser:false
    } )

    return from(res)

  }
  deleteComment(articleID:string,commentId:string){
    const ref = collection(this.firestoreService, 'articles',articleID,'comments');
    const res = updateDoc(doc(ref, commentId),
    { 
      deletedByUser: true
    } )
    return from(res)
  }

  // ----------------------- AUTH
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
