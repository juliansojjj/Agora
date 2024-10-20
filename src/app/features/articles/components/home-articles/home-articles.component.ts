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
import { Article, paragraph } from '../../../../shared/interfaces/article.interface';
import { NgFor, NgIf, AsyncPipe } from '@angular/common';
import { catchError, EMPTY, map, Observable } from 'rxjs';
import { RouterLink } from '@angular/router';
import { FirebaseService } from '../../../../core/services/firebase.service';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  collection,
  doc,
  serverTimestamp,
  Timestamp,
  setDoc,
} from '@angular/fire/firestore';
import { child, set } from '@angular/fire/database';
import { OrderByDatePipe } from '../../pipes/order-by-date.pipe';
import { OrderArticlesByDatePipe } from '../../pipes/order-articles-by-date.pipe';

@Component({
  selector: 'app-home-articles',
  standalone: true,
  imports: [NgFor, NgIf, RouterLink, AsyncPipe, OrderArticlesByDatePipe],
  template: `
    @if (articles()) {
      <main class="flex flex-col items-center">
        <button (click)="docUpload()">SUBIR DOC</button>

        <section class="grid grid-cols-3 grid-rows-1 gap-5 lg:w-1/2 h-full place-items-center pt-4 bg-blue-100">
          
          <div class="grid grid-cols-1 grid-rows-2 gap-2">
          @for(item of (mediumPriorArticles() | orderArticlesByDate).slice(0,2); track $index; let i = $index){
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
          </div>

          <div>
          @for(item of highPriorArticles().slice(0,1); track $index; let i = $index){
          <a
              class="bg-slate-200 h-full"
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
            
          </div>


          <div class="grid grid-cols-1 grid-rows-2 gap-2">
          @for(item of mediumPriorArticles().slice(2,4); track $index; let i = $index){
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
          </div>
        </section>
        <section class="h-24 bg-red-200 lg:w-1/2 ">
        @for(item of articles(); track $index; let i = $index){
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
        </section>
      </main>
    } @else {
      <ng-template [ngIf]="errorMessage">
        <span class="whitespace-pre-line text-left">ERROR</span>
      </ng-template>
    }
  `,
})
export class HomeArticlesComponent {
  firebaseService = inject(FirebaseService);

  highPriorArticles = model<Article[]>([]);
  mediumPriorArticles = model<Article[]>([]);
  lowPriorArticles = model<Article[]>([]);

  articles = toSignal<Article[]>(
    this.firebaseService.getLandingArticles().pipe(
      map((res) => {
        res.forEach((art: Article) => {
          if (art.priority == 'high') {
            this.highPriorArticles.update((value) =>
              value ? [...value, art] : [art],
            );
          } else if (art.priority == 'medium') {
            this.mediumPriorArticles.update((value) =>
              value ? [...value, art] : [art],
            );
          } else {
            this.lowPriorArticles.update((value) =>
              value ? [...value, art] : [art],
            );
          }
        });
        return res;
      }),
    ),
  );

  errorMessage!: string;

  docUpload() {
    const ref = collection(this.firebaseService.firestoreService, 'articles');
    const res = setDoc(doc(ref), {
      authorID: 'SarahPerez',
      authorName: 'Sarah Perez',
      available: true,
      category: 'tech',
      content: [
        {
          htmlParagraph:
            'A misfire of YouTube’s systems led to the accidental banning of YouTube channels affecting numerous creators who were informed their channels were removed for “Spam & Deceptive Practices.” YouTube has now <a href="https://x.com/TeamYouTube/status/1841978197086245225">apologized</a> for the problem and says it’s rectifying the situation, but did not comment on the cause of the bans, leading creators to wonder if the company’s automation is to blame.',
        },
        {
          htmlContent:
            '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Hi Creators - We&#39;re aware of an issue causing some channels to be incorrectly flagged for Spam and removed. Our teams are looking into this and reinstating the channels right now - thanks so much for your patience. <br><br>More information: <a href="https://t.co/xQ9AFg0woc">https://t.co/xQ9AFg0woc</a></p>&mdash; TeamYouTube (@TeamYouTube) <a href="https://twitter.com/TeamYouTube/status/1841978197086245225?ref_src=twsrc%5Etfw">October 3, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
        },
        {
          htmlParagraph:
            'On X, YouTube acknowledged the problem on Thursday night, saying it was aware of an issue “causing some channels to be incorrectly flagged for spam and removed.” The company said it was looking into this and working to reinstate the channels that were affected. Later in the evening, YouTube <a href="https://x.com/TeamYouTube/status/1842001248070885486">updated</a> again to say that it was still working on the reinstatement and added that other content, like playlists, may still be delayed.',
        },
        {
          paragraph:'The company had not posted another update as of Friday morning, indicating the problem was not fully resolved at the time.'
        },
        {
          htmlContent:
            '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Update: our teams are still working on reinstating the incorrectly removed channels and access to subscriptions - we&#39;re sorry for the trouble! Some content like playlists may be delayed, but it&#39;s all coming back. Thanks for your patience while we work on this! <a href="https://t.co/YH9idZFuai">https://t.co/YH9idZFuai</a></p>&mdash; TeamYouTube (@TeamYouTube) <a href="https://twitter.com/TeamYouTube/status/1842001248070885486?ref_src=twsrc%5Etfw">October 4, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
        },
        {
          paragraph:'However, YouTube updated its X account on Friday afternoon, saying the problem is now fixed.'
        },
        {
          htmlContent:
            '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Happy to report that all channels and most videos incorrectly removed have been reinstated and subscriptions are restored (we’re still working on the last few, bear with us!!). We know this caused some disruption, and we so appreciate your patience while we sort this out ❤️‍🩹 <a href="https://t.co/8HbjnhJC4T">https://t.co/8HbjnhJC4T</a></p>&mdash; TeamYouTube (@TeamYouTube) <a href="https://twitter.com/TeamYouTube/status/1842277260704747593?ref_src=twsrc%5Etfw">October 4, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
        },
        {
          paragraph:'Missing in YouTube’s posts is any explanation as to how something like this could occur or an acknowledgment of the scale of the problem, though the last post suggests that YouTube itself knows the issue.'
        },
        {
          htmlParagraph:
            'Social media reports from creators had indicated the problem was fairly serious and widespread. On YouTube’s X posts, for example, there were hundreds of replies from creators and their fans about channels they wanted to see restored. Some creators also noted that their files were missing, or complained that they tried to change their settings or reach out to support but received no assistance. YouTube’s updates on its Help site have <a href="https://support.google.com/youtube/thread/300155212/known-issue-10-03-2024-channels-removed-for-spam-deceptive-practices?hl=en&sjid=14665737707607008891-NA">hundreds of responses</a> as well, but no further explanation.',
        },
        {
          htmlParagraph:
            'While the issue affecting creators has been of greater concern, because channel removals have an impact on their livelihood, some YouTube Premium subscribers said they also lost access even though <a href="https://x.com/unit020/status/1841956273748955306">they don’t post videos</a> or haven’t in years. As a result, they no longer had access to their Premium subscription, nor could <a href="https://x.com/jakebechtold/status/1841955328147259475">they stream via YouTube Music</a>.',
        },
        {
          paragraph:'The issue highlights the problems that can result when multiple services are tied together under one roof: publishing on YouTube, subscribing to Premium, and streaming via YouTube Music and YouTube TV. A false takedown over spam means people were losing access to not only their channels, which they may not have even utilized, but also their paid subscriptions.'
        },
        {
          paragraph:'YouTube’s announcement on its Help site said it was working on restoring access to subscriptions as well as the removed channels, adding, “We are very sorry for this error on our part and we’ll follow up here when it’s done.”'
        },
        {
          paragraph:'TechCrunch reached out to YouTube for comment on the situation, including the scale and the cause. As of Friday afternoon, the company only pointed us to its official X posts.'
        },
      ],
      contentPreview:[
        {
          htmlParagraph:
            'A misfire of YouTube’s systems led to the accidental banning of YouTube channels affecting numerous creators who were informed their channels were removed for “Spam & Deceptive Practices.” YouTube has now <a href="https://x.com/TeamYouTube/status/1841978197086245225">apologized</a> for the problem and says it’s rectifying the situation, but did not comment on the cause of the bans, leading creators to wonder if the company’s automation is to blame.',
        },
        {
          htmlParagraph:
            '<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Hi Creators - We&#39;re aware of an issue causing some channels to be incorrectly flagged for Spam and removed. Our teams are looking into this and reinstating the channels right now - thanks so much for your patience. <br><br>More information: <a href="https://t.co/xQ9AFg0woc">https://t.co/xQ9AFg0woc</a></p>&mdash; TeamYouTube (@TeamYouTube) <a href="https://twitter.com/TeamYouTube/status/1841978197086245225?ref_src=twsrc%5Etfw">October 3, 2024</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>',
        },
        {
          htmlParagraph:
            'On X, YouTube acknowledged the problem on Thursday night, saying it was aware of an issue “causing some channels to be incorrectly flagged for spam and removed.” The company said it was looking into this and working to reinstate the channels that were affected. Later in the evening, YouTube <a href="https://x.com/TeamYouTube/status/1842001248070885486">updated</a> again to say that it was still working on the reinstatement and added that other content, like playlists, may still be delayed.',
        },
        {
          paragraph:'The company had not posted another update as of Friday morning, indicating the problem was not fully resolved at the time.'
        },],
      date: Timestamp.fromDate(new Date('2024-10-04T00:51:00-07:00')),
      frontImage:
        'https://techcrunch.com/wp-content/uploads/2020/06/GettyImages-1149449078-e1610399732853.jpg?resize=1173,617',
      frontImageAlt: 'Image Credits:Olly Curtis/Future / Getty Images',
      frontImageBanner: false,
      heading: 'YouTube in the spotlight',
      priority: 'medium',
      source: 'https://techcrunch.com/2024/10/04/youtube-apologizes-for-falsely-banning-channels-for-spam-canceling-subscriptions/',
      subheading: 'YouTube apologizes for falsely banning channels for spam',
      subscription: true,
      topics:['Google', 'media', 'entertainment']
    });
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
