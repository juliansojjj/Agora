import { NgClass } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../../../../../shared/interfaces/article.interface';

@Component({
    selector: 'app-standard-grid',
    imports: [RouterLink, NgClass],
    template: `
    <div class="w-full relative h-full grid md:grid-cols-3 xsm:grid-cols-2 grid-cols-1 gap-[1rem] place-items-center justify-center place-content-center">

      @for (item of articles(); track $index) {

        <a [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]" 
        (mouseover)="cellHoverCheck($index)" 
        (mouseout)="cellHoverCheck($index)"
        class="h-full w-full aspect-square relative flex flex-col">

        <div class="w-full sm:h-1/2 xsm:h-1/3 h-3/5 object-cover overflow-hidden">
          <img [src]="item.frontImage" 
          [alt]="item.frontImageAlt" class="w-full h-full object-cover" 
          [ngClass]="cellHover() == $index.toString() ? 'scale-105' : ''">
        </div>

        <div class="w-full sm:h-1/2 xsm:h-2/3 h-2/5 p-2 z-10"
        [ngClass]="cellHover() == $index.toString() ? ' bg-brandGrey' : 'bg-white'"> 

          <span class="text-[1rem] font-medium">{{item.heading}}</span>

        </div>
      </a>
      }
    </div>
  `,
    styles: ''
})
export class StandardGridComponent {
  articles = input.required<Article[]>();

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

