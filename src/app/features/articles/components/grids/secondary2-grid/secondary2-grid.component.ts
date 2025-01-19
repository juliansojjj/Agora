import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-secondary2-grid',
    imports: [RouterLink, NgClass],
    template: `
  <div class="w-full relative h-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 lg:gap-[3.5rem] sm:gap-[1rem] gap-y-[2rem] place-items-center ">

        @for (item of articles().slice(0,4); track $index) {

          <a [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]" 
          (mouseover)="cellHoverCheck($index)" (mouseout)="cellHoverCheck($index)"
          class="relative flex overflow-hidden
          2xl:h-[20rem] 
          xl:h-[15rem] xl:w-fit
          lg:w-[14rem] lg:h-[14rem] 
          sm:h-[17.5rem] sm:aspect-square
          xsm:h-[12rem]
          aspect-[2/1] h-[9rem]" 
          [ngClass]="$index % 2 == 0 ? 'evenCell flex-row-reverse sm:flex-col' : 'oddCell sm:items-end sm:flex-col-reverse'">

          <img [src]="item.frontImage" [alt]="item.frontImageAlt" 
          class="w-full  object-cover 
          2xl:h-[13rem] 
          xl:h-[10rem] 
          lg:h-[8rem] 
          sm:h-[11.5rem]" 
          [ngClass]="cellHover() == $index.toString() ? 'scale-105' : ''">

          <div class="w-full z-10 2xl:p-3 p-1 h-full" 
          [ngClass]="{
          'bg-brandGrey': cellHover() == $index.toString(),
          'bg-white': cellHover() != $index.toString()}"> 
            <span class="font-semibold
            2xl:text-[1.2rem] 
            lg:text-[1rem]
            sm:text-[1.2rem]
            xsm:text-[1rem]
            text-[.9rem]">{{item.heading}}</span>
          </div>
        </a>
        }



        @for (item of articles().slice(4,8); track $index) {

          <a [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]" 
          (mouseover)="cellHoverCheck($index+5)" (mouseout)="cellHoverCheck($index+5)"
          class="relative flex overflow-hidden
          2xl:h-[20rem] 
          xl:h-[15rem] xl:w-fit
          lg:w-[14rem] lg:h-[14rem] 
          sm:h-[17.5rem] sm:aspect-square
          xsm:h-[12rem]
          aspect-[2/1] h-[9rem]" 
          [ngClass]="($index+5) % 2 == 0 ? 'evenCell flex-row-reverse sm:flex-col' : 'oddCell sm:items-end sm:flex-col-reverse'">

          <img [src]="item.frontImage" [alt]="item.frontImageAlt" 
          class="w-full  object-cover 
          2xl:h-[13rem] 
          xl:h-[10rem] 
          lg:h-[8rem] 
          sm:h-[11.5rem]" 
          [ngClass]="cellHover() == ($index+5).toString() ? 'scale-105' : ''">

          <div class="w-full z-10 2xl:p-3 p-1 h-full" 
          [ngClass]="{
          'bg-brandGrey': cellHover() == ($index+5).toString(),
          'bg-white': cellHover() != ($index+5).toString()}"> 
            <span class="font-semibold
            2xl:text-[1.2rem] 
            lg:text-[1rem]
            sm:text-[1.2rem]
            xsm:text-[1rem]
            text-[.9rem]">{{item.heading}}</span>
          </div>
          </a>
        }
      </div>
  `,
    styles: `
  .evenCell{
    @media(min-width:640px){
      clip-path: polygon(0% 0%,
        70% 0%,
        100% 30%,
        100% 100%,
        0% 100%);
    }
  }
  .oddCell{
    @media(min-width:640px){
      clip-path: polygon(0% 0%,
        100% 0%,
        100% 100%,
        30% 100%,
        0% 70%);
    }
  }
  `
})
export class Secondary2GridComponent {
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

