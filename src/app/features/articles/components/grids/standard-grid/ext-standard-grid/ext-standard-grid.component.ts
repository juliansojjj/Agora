import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-ext-standard-grid',
  standalone: true,
  imports: [RouterLink, NgClass, NgStyle],
  template:`
    <div class="w-full relative h-full place-items-center justify-center grid  sm:gap-[1rem]
    2xl:grid-cols-4
    xl:grid-cols-3
    sm:grid-cols-2
    grid-cols-1
    ">

      @for (item of articles(); track $index) {

        <a [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]" 
        (mouseover)="cellHoverCheck($index)" 
        (mouseout)="cellHoverCheck($index)"
        class="w-full h-full sm:aspect-square aspect-[3/1]  overflow-hidden relative flex">

        <img [src]="item.frontImage" 
        [alt]="item.frontImageAlt" class="w-full h-full object-cover" 
        [ngClass]="cellHover() == $index.toString() ? 'scale-105' : ''">

        <div class="sm:absolute bottom-0 sm:h-2/5 h-full relative w-full z-10 p-0 px-1 xsm:p-3 " 
  
        [ngClass]="cellHover() == $index.toString() ? ' bg-brandGrey' : 'bg-white'"> 

          <span class="text-[.65rem] xsm:text-[1rem] sm:text-[1rem] md:text-[1.3rem] xl:text-[1.3rem] 2xl:text-[1.2rem] 3xl:text-[1.48rem] 4xl:text-[2rem] font-semibold">{{item.heading}}</span>

        </div>
      </a>
      }
    </div>
  `,
  styles:''
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

