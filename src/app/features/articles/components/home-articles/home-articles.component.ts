import {
  Component,
  inject
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  collection,
  doc,
  setDoc
} from '@angular/fire/firestore';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { Article } from '../../../../shared/interfaces/article.interface';
import { Main2GridComponent } from '../grids/main-grid/main2-grid/main2-grid.component';
import { SecondaryGridComponent } from '../grids/secondary-grid/secondary-grid.component';
import { Secondary2GridComponent } from "../grids/secondary2-grid/secondary2-grid.component";
import { Secondary3GridComponent } from '../grids/secondary3-grid/secondary3-grid.component';
import { ExtStandardGridComponent } from "../grids/standard-grid/ext-standard-grid/ext-standard-grid.component";
import { StandardGridComponent } from '../grids/standard-grid/standard-grid.component';
import { TopicsGridComponent } from "../grids/topics-grid/topics-grid.component";
import { Topics2GridComponent } from "../grids/topics2-grid/topics2-grid.component";
import { Main2GridSkeletonComponent } from "../skeletons/main2-grid/main2-grid-skeleton.component";

@Component({
    selector: 'app-home-articles',
    imports: [RouterLink, SecondaryGridComponent, Secondary2GridComponent, Secondary3GridComponent, Main2GridComponent, TopicsGridComponent, Topics2GridComponent, Main2GridSkeletonComponent, StandardGridComponent],
    template: `
      <main class="flex flex-col items-center h-fit relative w-full">
        @if(techArticles()){
        <section class="h-fit w-full">
          <app-main2-grid [highArticle]="techArticles()!.slice(6,7)" 
          [mediumArticles]="techArticles()!.slice(1,4)"/>
        </section>
        }@else {  
        <section class="h-fit w-full">
          <app-main2-grid-skeleton />
        </section>
        }

        @if(artificialIntelligenceArticles()){
          <section class="w-full h-fit pt-16 flex flex-col items-center">
            <a [routerLink]="['/category/artificial-intelligence']"
                class="pl-7 sm:pl-10 md:pl-20 text-[2rem] sm:text-[3rem] font-medium lg:font-semibold text-brandShade self-start underline hover:text-brandViolet active:scale-95 mb-6 block w-fit">
                  Artificial Intelligence
            </a>

            <section class="w-[85%] md:w-[70%] h-fit">
              <app-topics-grid [offset]="0" [articles]="artificialIntelligenceArticles()"/>
            </section>
          </section>
        }
        @if(appleArticles()){
          <section class="w-full h-fit max-md:pt-6 flex flex-col items-center">
            <a [routerLink]="['/category/apple']"
                class="pl-7 sm:pl-10 md:pl-20 text-[2rem] sm:text-[3rem] font-medium lg:font-semibold text-brandShade self-start underline hover:text-brandViolet active:scale-95 mb-6 block w-fit">
                  Apple
            </a>

            <section class="w-[85%] md:w-[70%] h-fit">
              <app-topics-grid [offset]="1" [articles]="appleArticles()"/>
            </section>
          </section>
        }
 
        @if(scienceArticles()){
        <section class=" w-full h-fit md:pt-24 pt-12 flex flex-col items-center">
          <a [routerLink]="['/category/science']"
              class="pl-7 sm:pl-10 md:pl-20 text-[2.5rem] xsm:text-[3rem] sm:text-[4rem] md:text-[5rem] font-semibold text-brandViolet self-start underline hover:text-brandShade active:scale-95 mb-6 block w-fit">
                Science
          </a>

          <section class=" w-[85%] h-fit">
            <app-secondary-grid [articles]="scienceArticles()!"/>
          </section>
        </section>
        }

        
        
        @if(entertainmentArticles()){
        <section class=" w-full h-fit md:pt-24 pt-12 flex flex-col items-center">
          <a [routerLink]="['/category/entertainment']"
              class="pl-7 sm:pl-10 md:pl-20 text-[2.5rem] xsm:text-[3rem] sm:text-[4rem] md:text-[5rem] hyphens-auto break-all font-semibold text-brandViolet self-start underline hover:text-brandShade active:scale-95 mb-10 block w-fit">
                Entertainment
          </a>

          <section class="w-[85%] h-fit hidden xsm:block">
            <app-secondary2-grid [articles]="entertainmentArticles()!"/>
          </section>
          <section class="w-[85%] h-fit block xsm:hidden">
            <app-standard-grid [articles]="entertainmentArticles()!"/>
          </section>
        </section>
        }

           
        @if(cultureArticles() && filmArticles() && streamingArticles()){
          <section class="w-[85%] h-fit pt-8 md:pt-16">
            <app-topics2-grid category1Name="Culture" category1Url="culture" [category1articles]="cultureArticles()!"
            category2Name="Film" category2Url="film" [category2articles]="filmArticles()!"
            category3Name="Streaming" category3Url="streaming" [category3articles]="streamingArticles()!"/>
          </section>
        }

        @if(mediaArticles()){
        <section class=" w-full h-fit md:pt-24 pt-12 flex flex-col items-center">
          <a [routerLink]="['/category/media']"
              class="pl-7 sm:pl-10 md:pl-20 text-[2.5rem] xsm:text-[3rem] sm:text-[4rem] md:text-[5rem] font-semibold text-brandViolet self-start underline hover:text-brandShade active:scale-95 lg:mb-[6rem] mb-10 block w-fit">
                Media
          </a>

          <section class="sm:block hidden sm:w-[75%] h-fit">
            <app-secondary3-grid [articles]="mediaArticles()!"/>
          </section>
          <section class="block sm:hidden w-[85%] h-fit">
            <app-standard-grid [articles]="mediaArticles()!"/>
          </section>
        </section>
        }

        @if(socialMediaArticles()){
          <section class="w-full h-fit pt-24 flex flex-col items-center">
            <a [routerLink]="['/category/social-media']"
                class="pl-7 sm:pl-10 md:pl-20 text-[2rem] sm:text-[3rem] font-medium lg:font-semibold text-brandShade self-start underline hover:text-brandViolet active:scale-95 mb-6 block w-fit">
                  Social Media
            </a>

            <section class="w-[85%] md:w-[70%] h-fit">
              <app-topics-grid [offset]="0" [articles]="socialMediaArticles()"/>
            </section>
          </section>
        }
        @if(socialGoodArticles()){
          <section class="w-full h-fit pt-6 flex flex-col items-center">
            <a [routerLink]="['/category/social-good']"
                class="pl-7 sm:pl-10 md:pl-20 text-[2rem] sm:text-[3rem] font-medium lg:font-semibold text-brandShade self-start underline hover:text-brandViolet active:scale-95 mb-6 block w-fit">
                  Social Good
            </a>

            <section class="w-[85%] md:w-[70%] h-fit">
              <app-topics-grid [offset]="1" [articles]="socialGoodArticles()"/>
            </section>
          </section>
        }
      </main>
  `
})
export class HomeArticlesComponent {
  firebaseService = inject(FirebaseService);

  // tech
  techArticles = toSignal<Article[]>(
    this.firebaseService.getMainCategoryArticles('tech',10)
  );
    artificialIntelligenceArticles = toSignal<Article[]>(
      this.firebaseService.getCategoryArticles('artificial-intelligence',4)
    );
    appleArticles = toSignal<Article[]>(
      this.firebaseService.getCategoryArticles('apple',4)
    );

 //science
  scienceArticles = toSignal<Article[]>(
    this.firebaseService.getMainCategoryArticles('science',7)
  );
    

  //entertainment
  entertainmentArticles = toSignal<Article[]>(
    this.firebaseService.getMainCategoryArticles('entertainment',8)
  );
    cultureArticles = toSignal<Article[]>(
      this.firebaseService.getMainCategoryArticles('culture',4)
    );
    filmArticles = toSignal<Article[]>(
      this.firebaseService.getCategoryArticles('film',4)
    );
    streamingArticles = toSignal<Article[]>(
      this.firebaseService.getCategoryArticles('streaming',4)
    );


  //media
  mediaArticles = toSignal<Article[]>(
    this.firebaseService.getMainCategoryArticles('media',8)
  );  
    socialMediaArticles = toSignal<Article[]>(
      this.firebaseService.getCategoryArticles('social-media',4)
    );
    socialGoodArticles = toSignal<Article[]>(
      this.firebaseService.getCategoryArticles('social-good',4)
    );

  urlFormat(id: string, title: string) {
    const formatTitle = title
      .split(' ')
      .join('-')
      .replace(/[^A-Za-z0-9-._~:/?#\[\]@!$&'()*+]+/g, '')
      .toLowerCase();
    return `${id}-${formatTitle}`;
  }
}
