import { inject, Injectable } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { catchError, debounceTime, forkJoin, from, map, Observable, take, throwError } from 'rxjs';

import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateEmail,
  updatePassword,
  updateProfile,
  user
} from '@angular/fire/auth';

import {
  arrayRemove,
  arrayUnion,
  collection,
  collectionData,
  doc,
  docData,
  documentId,
  Firestore,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  Timestamp,
  updateDoc,
  where
} from '@angular/fire/firestore';

import { Article } from '../../shared/interfaces/article.interface';
import { Author } from '../../shared/interfaces/author.interface';
import { Category } from '../../shared/interfaces/category.interface';
import { Comment } from '../../shared/interfaces/comment.interface';
import {
  FirebaseAuthSignUser,
  FirestoreCollectionUser
} from '../../shared/interfaces/firebase.interfaces';

@Injectable({
  providedIn: 'root',
})

export class FirebaseService {
  authService = inject(Auth);
  firestoreService : Firestore = inject(Firestore);
  router = inject(Router)

  //authState es obs https://github.com/FirebaseExtended/rxfire/blob/main/docs/auth.md
  authState$ = authState(this.authService);
  //lo mismo con user
  user$  = user(this.authService);


// ----------------------- ARTICLES
  getSearchArticles():Observable<Article[]>{
    const ref = collection(this.firestoreService, 'articles');
    const result = collectionData(query(ref,orderBy('date', 'desc')),{ idField: 'articleID' });

    return from(result) as Observable<Article[]>
  }
  getAuthorArticles(authorID:string, max?:number){
    const ref = collection(this.firestoreService, 'articles');
    


    if(max) return from(collectionData(query(ref,where('authorID','==',authorID),orderBy('date', 'desc'),limit(max)), { idField: 'articleID' })) as Observable<Article[]>
    else return from(collectionData(query(ref,where('authorID','==',authorID)), { idField: 'articleID' })) as Observable<Article[]>
  }

  getFavoriteArticles(ids:string[]):Observable<Article[]>{
    const ref = collection(this.firestoreService, 'articles')
    


    if(ids.length <= 30){
      const result = collectionData(query(ref,where(documentId(),'in',ids)), { idField: 'articleID' })
      return from(result).pipe(
        map((articles) =>
          articles.sort((a: any, b: any) => ids.indexOf(b.articleID) - ids.indexOf(a.articleID)) as Article[] 
        )
      );
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
        map((results) => {
          const flattenedResults = results.flat();
          return flattenedResults.sort(
            (a: any, b: any) => ids.indexOf(b.articleID) - ids.indexOf(a.articleID)  
          ) as Article[] 
        })
      )
    }
  }

  getMainCategoryArticles(category:string, max:number, dateStart?:Timestamp, end?:number) {
    const categoryArray = category.split(' ')
    const name = categoryArray.join('-').toLowerCase()

    const ref = collection(this.firestoreService, 'articles')

    if(end) return from(
      collectionData(query(ref,
        where('category','==', name),
        orderBy('date', 'desc'),
        limit(max*end + 8)), 
        { idField: 'articleID' }
      )
    ) as Observable<Article[]>
    
    else if(dateStart) return from(
      collectionData(query(ref,
        where('category','==', name),
        orderBy('date', 'desc'),
        startAfter(dateStart),
        limit(max)), 
        { idField: 'articleID' }
      )
    ) as Observable<Article[]>
    
    else return from(
      collectionData(query(ref,
        where('category','==', name),
        orderBy('date', 'desc'),
        limit(max)), 
        { idField: 'articleID' }
      )
    ) as Observable<Article[]>
  }

  getCategoryArticles(category:string, max?:number, start?:Timestamp, end?:number) {
    const categoryArray = category.split(' ')
    const name = categoryArray.join('-').toLowerCase()
    
    const ref = collection(this.firestoreService, 'articles')
    

    const result = collectionData(query(ref,where('urlTopics','array-contains', name)), { idField: 'articleID' })

    // return from(result) as Observable<Article[]>;

    if(end) return from(
      collectionData(query(ref,
        where('urlTopics','array-contains', name),
        orderBy('date', 'desc'),
        limit(max!*end)), 
        { idField: 'articleID' }
      )
    ) as Observable<Article[]>

    else if(start) return from(
      collectionData(query(ref,
        where('urlTopics','array-contains', name),
        orderBy('date', 'desc'),
        startAfter(start),
        limit(max!)), 
        { idField: 'articleID' }
      )
    ) as Observable<Article[]>
    
    else return from(
      collectionData(query(ref,where('urlTopics','array-contains', name),orderBy('date', 'desc'),limit(max!)), { idField: 'articleID' })
    ) as Observable<Article[]>
  }


  getSingleArticle(id:string) {
    const ref = doc(this.firestoreService, 'articles', id);
    

    const result = docData(ref)

    return from(result) as Observable<Article>
  }
  
  getArticleComments(id:string):Observable<Comment[]>{
    const ref = collection(this.firestoreService, 'articles',id,'comments');
    
    const result = collectionData(query(ref,orderBy('date', 'desc')),{ idField: 'commentId' });

    return from(result) as Observable<Comment[]>
  }

  getAllCategories(){
    const ref = collection(this.firestoreService, 'categories')
    
    const result = collectionData(ref)

    return from(result) as Observable<Category[]>;
  }
  
  getCategory(url:string) {
    const ref = collection(this.firestoreService, 'categories')
    
    const result = collectionData(query(ref,where('url','==',url)))

    return from(result) as Observable<Category[]>
  }
  
  getAllAuthors() {
    const ref = collection(this.firestoreService, 'authors');
    
    const result = collectionData(ref,{ idField: 'authorID' })

    return from(result) as Observable<Author[]>;
  }

  getAuthor(id:string) {
    const ref = doc(this.firestoreService, 'authors', id);
    
    const result = docData(ref)

    return from(result) as Observable<Author>;
  }

  
  handleFavorite(uid:string,operation:boolean, articleID:string){
    const ref = doc(this.firestoreService, 'users', uid);
    
    return operation 
    ? from(updateDoc(ref,{favorites:arrayUnion(articleID)})) 
    : from(updateDoc(ref,{favorites:arrayRemove(articleID)})) 
  }

  getUserInfo(uid:string):Observable<FirestoreCollectionUser>{
    const ref = doc(this.firestoreService, 'users', uid);
    
    const result = docData(ref)

    return from(result) as Observable<FirestoreCollectionUser>
  }
  getUsers():Observable<FirestoreCollectionUser[]>{
    const ref = collection(this.firestoreService, 'users');
    
    const result = collectionData(ref);
    return from(result) as Observable<FirestoreCollectionUser[]>
  }
  checkUsername() {
    const ref = collection(this.firestoreService, 'users');
    
    const result = collectionData(ref);
    return (control: AbstractControl) => {
      return from(result).pipe(
        debounceTime(200),
        take(1),
        map((users: any) => {
          return users?.filter(
            (item: FirestoreCollectionUser) =>
              item.username.toLowerCase() == control.value.toLowerCase(),
          ).length
            ? { usernameTaken: true }
            : null;
        }),
      );
    };
  }

  updateUsername(newUsername:string){
    if(this.authService.currentUser) {
      const uid = this.authService.currentUser?.uid
      const ref = doc(this.firestoreService, 'users', uid)

      const firestoreRes = updateDoc(ref,{username:newUsername})
      const authRes = updateProfile(this.authService.currentUser, { displayName: newUsername })

      return forkJoin([firestoreRes,authRes])

    } else return throwError(()=>new Error('Your current session is to old, please login again'))
  }
  updateUserEmail(newEmail:string){
    if(this.authService.currentUser) {
      const uid = this.authService.currentUser?.uid
      const ref = doc(this.firestoreService, 'users', uid)
    
      return from(updateEmail(this.authService.currentUser,newEmail)).pipe(
        map(()=>{
          from(updateDoc(ref,{email:newEmail}))
        }),
        catchError(err=>throwError(()=>err))
      )

    } else return throwError(()=>new Error('Your current session is to old, please login again'))
  }
  updateUserPassword(newPassword:string){
    if(this.authService.currentUser) {
      return from(updatePassword(this.authService.currentUser,newPassword))

    } else return throwError(()=>new Error('Your current session is to old, please login again'))
  }

  documentUser(username: string, email: string, id:string, providerId?:string) {
    const ref = collection(this.firestoreService, 'users');

    return providerId 
    ? from(setDoc(doc(ref, id),
    { 
      username: username,
      email: email,
      providerId:providerId
    } ))
    : from(setDoc(doc(ref, id),
    { 
      username: username,
      email: email,
      providerId:'none'
    } ))
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
  signup(username: string, email: string, password: string){
    const createUser = createUserWithEmailAndPassword(this.authService, email, password)

    return from(createUser).pipe(
      map(res=>{
        console.log(res)
        return forkJoin([
          updateProfile(res.user, { displayName: username }),
          this.documentUser(username, email,res.user.uid)
        ])
      }),
      catchError(err=>throwError(()=>err))
    );
  }

  googleSignIn(){
    const provider = new GoogleAuthProvider()
    
    return from(signInWithPopup(this.authService,provider).then((res:any)=>{
      if((res as FirebaseAuthSignUser)._tokenResponse.isNewUser) {
        return {isNewUser:true,res:res}
      } else return {isNewUser:false,res:res}

    })).pipe(map(({isNewUser,res})=>{
      return isNewUser 
      ? from(this.documentUser(res.user.displayName!, res.user.email!,res.user.uid, res.providerId!))
      : res
    })
    )
  }

  login(email: string, password: string){
    return from(signInWithEmailAndPassword(this.authService,email,password)).pipe(
      map(res=>res),
      catchError(err=>throwError(()=>err))
    )
  }

  logout() {
    signOut(this.authService);
    this.router.navigate(['/'])
  }
}
