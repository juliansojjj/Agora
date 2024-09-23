import { Component, effect, inject, input, model, ModelSignal, OnDestroy, OnInit, Signal, signal, WritableSignal } from '@angular/core';
import { Article } from '../../../../shared/interfaces/article.interface';
import ArticlesService from '../../../../core/services/articles.service';
import { catchError, EMPTY, map, Observable, switchMap, take } from 'rxjs';
import { NgIf, AsyncPipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { DocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { DataSnapshot } from '@angular/fire/database';
import { Title } from '@angular/platform-browser';

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
export class SingleArticleComponent implements OnInit{
  firebaseService = inject(FirebaseService);
  id  = input.required<string>();
  title = inject(Title)



  data$ = toObservable(this.id).pipe(
    map((url:string)=>{
      const id = url.split('-')
      return id[0]
    }),
    switchMap(id=>this.firebaseService.getSingleArticle(id))
  )

  heading = toSignal(this.data$)

  comments$ = toObservable(this.id).pipe(
    map((url:string)=>{
      const id = url.split('-')
      return id[0]
    }),
    switchMap(id=>this.firebaseService.getArticleComments(id))
  )

  constructor(){
    effect(()=>{
      this.title.setTitle(this.heading()?.heading!)
    })
  }

  ngOnInit(): void {
    // this.data$.subscribe(res=>{
    //   this.title.setTitle(res.heading)
    // })
  }

}
