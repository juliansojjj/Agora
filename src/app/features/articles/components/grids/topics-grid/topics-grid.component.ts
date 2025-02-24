import { DatePipe, NgClass } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from 'app/shared/interfaces/article.interface';

@Component({
  selector: 'app-topics-grid',
  imports: [RouterLink, DatePipe, NgClass],
  template: `
    <div class="w-full h-fit relative grid xl:grid-cols-4 sm:grid-cols-3 grid-cols-1">
      @for (item of articles(); track $index) {
        @if($index == 3){
          <a [routerLink]="['/article',urlFormat(articles()![$index].articleID!, articles()![$index].heading)]"
        (mouseover)="cellHoverCheck($index+offset())" (mouseout)="cellHoverCheck($index+offset())"
        [ngClass]="($index+offset())% 2 == 0 ? 'bg-white' : 'bg-brandPink'"
        class="xl:flex hidden flex-col justify-between w-full h-[9rem] sm:h-full sm:aspect-square py-3 px-4 xl:p-6 hover:bg-black hover:text-white">

          <span class="font-medium lg:text-[1.2rem] text-[1rem] leading-[130%]">{{item.heading}}</span>

          <div class="flex flex-col">
            <span class="hidden xsm:inline-block sm:hidden 2xl:inline-block text-[1rem] 2xl:text-[1.1rem] italic self-end">{{item.authorName}}</span>
            <span class="hidden xsm:inline-block sm:hidden 2xl:inline-block text-[1rem] italic self-end">{{item.date.toDate() | date:'MM/d/y'}}</span>
          </div>
        </a>
        }@else {
          <a [routerLink]="['/article',urlFormat(articles()![$index].articleID!, articles()![$index].heading)]"
        (mouseover)="cellHoverCheck($index+offset())" (mouseout)="cellHoverCheck($index+offset())"
        [ngClass]="($index+offset())% 2 == 0 ? 'bg-white' : 'bg-brandPink'"
        class="flex flex-col justify-between w-full h-[9rem] sm:h-full sm:aspect-square py-3 px-4 xl:p-6 hover:bg-black hover:text-white">

          <span class="font-medium lg:text-[1.2rem] text-[1rem] leading-[130%]">{{item.heading}}</span>

          <div class="flex flex-col">
            <span class="hidden xsm:inline-block sm:hidden 2xl:inline-block text-[1rem] 2xl:text-[1.1rem] italic self-end">{{item.authorName}}</span>
            <span class="hidden xsm:inline-block sm:hidden 2xl:inline-block text-[1rem] italic self-end">{{item.date.toDate() | date:'MM/d/y'}}</span>
          </div>
        </a>
        }
      }
    </div>
  `,
  styles: ``
})
export class TopicsGridComponent {
  offset = input.required<number>()
  articles = input<Article[]>()

  cellHover = model<string>()

  cellHoverCheck(index:number) {
    if(!this.cellHover()) this.cellHover.set(index.toString())
      else this.cellHover.set('')
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
