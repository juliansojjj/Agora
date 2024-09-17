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
    @if (data()) {
      <div>
       <h2>{{ data()?.heading }}</h2> 
      </div>
    } @else {
      <p>Loading...</p>

    }
    @if(data$ | async; as data){
      {{data.heading}}
    }
  `
})
export class SingleArticleComponent implements OnInit {
  firebaseService = inject(FirebaseService);
  id  = input.required<string>();

  data = model<Article>()
  // data!:Signal<any>
  data$!:Observable<Article>


  constructor(){
    //ERROR ctx.data is not a function
    // effect(()=>{
    //   this.data = toSignal(this.firebaseService.getSingleArticle(this.id()))
    // })

    effect(()=>{
      this.firebaseService.getSingleArticle(this.id())
      .subscribe((res)=>{
        console.log(res)
        this.data.set(res as Article)})
      
    })

  }

  ngOnInit(): void {
    this.data$ = this.firebaseService.getSingleArticle(this.id())
    
  }


}
