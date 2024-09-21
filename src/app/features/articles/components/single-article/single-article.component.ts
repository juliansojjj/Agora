import { Component, effect, inject, input, model, ModelSignal, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Article } from '../../../../shared/interfaces/article.interface';
import ArticlesService from '../../../../core/services/articles.service';
import { catchError, EMPTY, map, Observable, switchMap, take } from 'rxjs';
import { NgIf, AsyncPipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { DocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { DataSnapshot } from '@angular/fire/database';

@Component({
  selector: 'app-single-article',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  template: `
    @if(data$ | async; as data){
      {{data.heading}}
    
      @if(comments$ | async; as comments){
        comments
      }
    }@else {
      <p>Loading...</p>

    }
  `
})
export class SingleArticleComponent implements OnInit {
  firebaseService = inject(FirebaseService);
  id  = input.required<string>();

  data$ = toObservable(this.id).pipe(
    map((url:string)=>{
      const id = url.split('-')
      return id[0]
    }),
    switchMap(id=>this.firebaseService.getSingleArticle(id))
  )
  comments$ = toObservable(this.id).pipe(
    map((url:string)=>{
      const id = url.split('-')
      return id[0]
    }),
    switchMap(id=>this.firebaseService.getArticleComments(id))
  )

  constructor(){
 
  }

  ngOnInit(): void {
    
  }


}
