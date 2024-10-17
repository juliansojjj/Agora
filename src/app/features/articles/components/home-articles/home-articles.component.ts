import {
  AfterContentChecked,
  AfterViewChecked,
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  inject,
  model,
  ModelSignal,
  QueryList,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { Article } from '../../../../shared/interfaces/article.interface';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from '@angular/fire/firestore';
import { child, set } from '@angular/fire/database';

@Component({
  selector: 'app-home-articles',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, AsyncPipe],
  template: `
    @if (articles()) {
      <main class="flex flex-col items-center">
        <!-- <button (click)="docUpload()">SUBIR DOC</button> -->
        <div
          class="grid grid-cols-3 grid-rows-1 gap-5 lg:w-1/2 place-items-center pt-4 text-black"
        >
          <ng-container
            *ngFor="
              let item of articles()?.slice(0, 3);
              index as i;
              trackBy: trackByFn
            "
          >
            <a
              class="bg-slate-200"
              [routerLink]="[
                '/article',
                urlFormat(item.articleId!, item.heading),
              ]"
              #mainSectionElement
              [attr.data-articleIndex] = "i"
            >
              <h4>{{ item.heading }}</h4>
              <img
                [src]="item.frontImage"
                alt="front image of {{ item.heading }}"
                class="w-[10rem] aspect-[3/2] object-cover"
              />
            </a>
          </ng-container>
        </div>

        -----------------------------------
          @if(renderedArticles()){
            @for(item of articles(); track $index; let i = $index){
              @if(!renderedArticles().includes(i)){
                <a
              class="bg-slate-200"
              [routerLink]="[
                '/article',
                urlFormat(item.articleId!, item.heading),
              ]"
              #secondSectionElement
              [attr.data-articleIndex] = "i"
            >
              <h4>{{ item.heading }}</h4>
              <img
                [src]="item.frontImage"
                alt="front image of {{ item.heading }}"
                class="w-[10rem] aspect-[3/2] object-cover"
              />
            </a>
                
               
              }
            }
          }

          @if(renderedArticles()){
            @for(item of articles(); track $index; let i = $index){
              @if(!renderedArticles().includes(i)){
                <a
              class="bg-slate-200"
              [routerLink]="[
                '/article',
                urlFormat(item.articleId!, item.heading),
              ]"
            >
              <h4>{{ item.heading }}</h4>
              <img
                [src]="item.frontImage"
                alt="front image of {{ item.heading }}"
                class="w-[10rem] aspect-[3/2] object-cover"
              />
            </a>
                
               
              }
            }
          }

      </main>
    } @else {
      <ng-template [ngIf]="errorMessage">
        <span class="whitespace-pre-line text-left">ERROR</span>
      </ng-template>
    }
  `,
})
export class HomeArticlesComponent
  implements AfterViewInit, AfterContentChecked
{
  firebaseService = inject(FirebaseService);

  @ViewChildren('mainSectionElement') mainSectionElements?: QueryList<
    ElementRef<HTMLAnchorElement>
  >;
  @ViewChildren('secondSectionElement') secondSectionElements?: QueryList<
    ElementRef<HTMLAnchorElement>
  >;

  renderedArticles = model<number[]>([]);
  articles = toSignal<Article[]>(
    this.firebaseService.getLandingArticles().pipe(map((res) => res)),
  );

  errorMessage!: string;

  ngAfterViewInit(): void {
    this.mainSectionElements?.changes.subscribe(
      (query: QueryList<ElementRef<HTMLAnchorElement>>) => {
        query.forEach((child) => {
          const articleIndex = Number(child.nativeElement.dataset.articleindex)
          this.renderedArticles.update((array) =>
            array ? [...array, articleIndex] : [articleIndex],
          );
          // console.log(this.renderedArticles());
        });
      },
    );
    
    this.secondSectionElements?.changes.subscribe(
      (query: QueryList<ElementRef<HTMLAnchorElement>>) => {
        query.forEach((child) => {
          const articleIndex = Number(child.nativeElement.dataset.articleindex)
          console.log(articleIndex)
          // this.renderedArticles.update((array) =>
          //   array ? [...array, articleIndex] : [articleIndex],
          // );
          // console.log(this.renderedArticles());
        });
      },
    );
  }

  ngAfterContentChecked(): void {
    // console.log(this.children)
  }

  docUpload() {
    const ref = collection(this.firebaseService.firestoreService, 'articles');
    const res = setDoc(doc(ref, 'prueba3'), {
      authorID: 'mongolia',
      authorName: 'mongol',
      available: true,
      category: 'tech',
      content: [
        {
          paragraph:
            'So what models is LinkedIn training? Its own, the company says in a Q&A, including models for writing suggestions and post recommendations. But LinkedIn also says that generative AI models on its platform may be trained by “another provider,” like its corporate parent Microsoft.',
        },
        {
          quote:
            '“As with most features on LinkedIn, when you engage with our platform we collect and use (or process) data about your use of the platform, including personal data,” the Q&A reads. “This could include your use of the generative AI (AI models used to create content) or other AI features, your posts and articles, how frequently you use LinkedIn, your language preference, and any feedback you may have provided to our teams. We use this data, consistent with our privacy policy, to improve or develop the LinkedIn services.”',
        },
      ],
      date: serverTimestamp(),
      frontImage:
        'https://img.lagaceta.com.ar/fotos/notas/2024/06/11/mate-bebidas-favoritas-argentinos-1038657-120733.jpg',
      frontImageAlt: 'mate',
      frontImageBanner: false,
      heading: 'que rico el mate3',
      priority: 'high',
      source: 'mia',
      subheading: 'ay como quema',
      subscription: false,
    });
  }

  trackByFn(index: number, item: Article) {
    return item.articleId;
  }

  urlFormat(id: string, title: string) {
    const formatTitle = title
      .split(' ')
      .join('-')
      .replace(/[^A-Za-z0-9-._~:/?#\[\]@!$&'()*+]+/g, '')
      .toLowerCase(); //valid url characters
    return `${id}-${formatTitle}`;
  }
}

//TODO: LOADING SCREEN
///[^A-Za-z0-9-._~:/?#\[\]@!$&'()*+,;=]+/g
