import { NgClass } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from '../../../../../../shared/interfaces/article.interface';

@Component({
    selector: 'app-ext-standard-grid',
    imports: [RouterLink, NgClass],
    template: `
    <div class="min-w-full relative h-full place-items-center justify-center grid  
    2xl:grid-cols-4
    xl:grid-cols-3
    sm:grid-cols-2
    xsm:gap-[1rem]
    grid-cols-1 gap-[.5rem]
    ">

      @for (item of articles(); track $index) {

        <a [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]" 
        (mouseover)="cellHoverCheck($index)" 
        (mouseout)="cellHoverCheck($index)"
        class="xsm:w-full min-w-[95%] h-full sm:aspect-square aspect-[3/1]  overflow-hidden relative flex">

        <img [src]="item.frontImage" 
        [alt]="item.frontImageAlt" class="w-full h-full object-cover" 
        [ngClass]="cellHover() == $index.toString() ? 'scale-105' : ''">

        <div class="sm:absolute bottom-0 sm:h-2/5 h-full relative w-full z-10 p-0 px-1 xsm:pt-2 xsm:px-3" 
  
        [ngClass]="cellHover() == $index.toString() ? ' bg-brandGrey' : 'bg-white'"> 

          <span class=" block
          text-[.8rem] font-medium
          xsm:text-[.9rem] 
          md:text-[1rem] leading-[125%]">
            {{item.heading}}
          </span>
        </div>
      </a>
      }
    </div>
  `,
    styles: ''
})
export class ExtStandardGridComponent {
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

