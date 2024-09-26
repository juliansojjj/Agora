import {
  Component,
  effect,
  inject,
  input,
  model,
  ModelSignal,
  OnDestroy,
  OnInit,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import {
  Article,
  contentItems,
  paragraph,
} from '../../../../shared/interfaces/article.interface';
import ArticlesService from '../../../../core/services/articles.service';
import { catchError, EMPTY, map, Observable, switchMap, take } from 'rxjs';
import { NgIf, AsyncPipe } from '@angular/common';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { DocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { DataSnapshot } from '@angular/fire/database';
import { Title } from '@angular/platform-browser';
import { TypeofPipe } from '../../pipes/typeof.pipe';

@Component({
  selector: 'app-single-article',
  standalone: true,
  imports: [NgIf, AsyncPipe, TypeofPipe],
  template: `
    @if (data$ | async; as data) {
      <article class="w-full h-screen relative">
        <section class="w-full">
          <h1 class="absolute text-white font-bold font text-[3rem] left-[50%] -translate-x-1/2 text-center bg-black">{{ data.heading }}</h1>
          <img src='{{ data.frontImage }}' alt='{{ data.frontImageAlt }}'>
        </section>
      
      @for (item of data.content; track $index) {
        @if ((item | typeof) == 'paragraph') {
          <p class="m-1 mx-0">
            {{ $any(item).paragraph }}
          </p>
        }
        @if ((item | typeof) == 'quote') {
          <blockquote class="m-1 mx-0 bg-red-100">
            {{ $any(item).quote }}
          </blockquote>
        }
        @if ((item | typeof) == 'image') {
          <img src='{{ $any(item).imageUrl }}' alt='{{ $any(item).imageAlt }} '/>
          
        }
        @if ((item | typeof) == 'title') {
          <h3 class="font-bold">
            {{ $any(item).title }}
          </h3>
        }
        @if ((item | typeof) == 'subtitle') {
          <h4 class="font-medium">
            {{ $any(item).subtitle }}
          </h4>
        }
      }

      @if (comments$ | async; as comments) {
      @for (item of comments; track $index) {
        <div *ngIf="!item.deletedByUser">
          <span>{{item.date}}</span>
          <span>{{item.username}}</span>
        <p>{{item.content}}</p>
        </div>
      }

        
      }
      </article>
      
    } @else {
      <p>Loading...</p>
    }
  `,
})
export class SingleArticleComponent implements OnInit {
  firebaseService = inject(FirebaseService);
  id = input.required<string>();
  title = inject(Title);

  data$ = toObservable(this.id).pipe(
    map((url: string) => {
      const id = url.split('-');
      return id[0];
    }),
    switchMap((id) => this.firebaseService.getSingleArticle(id)),
  );

  heading = toSignal(this.data$);

  comments$ = toObservable(this.id).pipe(
    map((url: string) => {
      const id = url.split('-');
      return id[0];
    }),
    switchMap((id) => this.firebaseService.getArticleComments(id)),
  );

  constructor() {
    effect(() => {
      this.title.setTitle(this.heading()?.heading!);
    });


  }

  // -------------------- vuelve a calcularse en cualquier deteccion de cambios
  // typeCheck(item : contentItems){
  //   if('paragraph' in item) return 'paragraph'
  //   if('quote' in item) return 'quote'
  //   if('imageUrl' in item) return 'image'
  //   if('title' in item) return 'title'
  //   if('subtitle' in item) return 'subtitle'
  //   return false
  // }

  ngOnInit(): void {
    // this.data$.subscribe(res=>{
    //   this.title.setTitle(res.heading)
    // })
  }
}
