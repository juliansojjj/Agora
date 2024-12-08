import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-secondary2-grid',
  standalone: true,
  imports: [RouterLink, NgClass],
  template:`
  <div class="w-full relative h-full grid grid-rows-2 gap-[3.5rem]">


    <div class="w-full relative h-full grid grid-cols-4 gap-[3.5rem] place-items-center">
        @for (item of articles().slice(0,4); track $index) {
          <a [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]" 
          (mouseover)="cellHoverCheck($index)" (mouseout)="cellHoverCheck($index)"
          class="h-full aspect-square overflow-hidden relative flex" [style.height]="height()+'rem'" [ngClass]="$index % 2 == 0 ? 'evenCell' : 'oddCell items-end'">

          <img [src]="item.frontImage" [alt]="item.frontImageAlt" class="w-full  object-cover" [style.height]="height()/3*2+'rem'" [ngClass]="cellHover() == $index.toString() ? 'scale-105' : ''">

          <div class="absolute  w-full z-10 p-3" [style.height]="height()/3+'rem'" [ngClass]="{
          'bg-brandGrey': cellHover() == $index.toString(),
          'bg-white': cellHover() != $index.toString(),
          'bottom-0': $index % 2 === 0,
          'top-0': $index % 2 !== 0
          }"> 
            <span class="text-[1.2rem] font-semibold">{{item.heading}}</span>
          </div>
        </a>
        }
      </div>


      <div class="w-full relative h-full grid grid-cols-4 gap-[3.5rem] place-items-center">
        @for (item of articles().slice(4,8); track $index) {
          <a [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]" 
          (mouseover)="cellHoverCheck($index+5)" (mouseout)="cellHoverCheck($index+5)"
          class="h-full aspect-square overflow-hidden relative flex" [style.height]="height()+'rem'" [ngClass]="($index+5) % 2 == 0 ? 'evenCell' : 'oddCell items-end'">

          <img [src]="item.frontImage" [alt]="item.frontImageAlt" class="w-full  object-cover" [style.height]="height()/3*2+'rem'" [ngClass]="cellHover() == ($index+5).toString() ? 'scale-105' : ''">

          <div class="absolute  w-full z-10 p-3" [style.height]="height()/3+'rem'" [ngClass]="{
          'bg-brandGrey': cellHover() == ($index+5).toString(),
          'bg-white': cellHover() != ($index+5).toString(),
          'bottom-0': ($index+5) % 2 === 0,
          'top-0': ($index+5) % 2 !== 0
          }"> 
            <span class="text-[1.2rem] font-semibold">{{item.heading}}</span>
          </div>
        </a>
        }
      </div>
  </div>
    
  `,
  styles:`
  .evenCell{
    clip-path: polygon(0% 0%,
      70% 0%,
      100% 30%,
      100% 100%,
      0% 100%);
  }
  .oddCell{
    clip-path: polygon(0% 0%,
      100% 0%,
      100% 100%,
      30% 100%,
      0% 70%);
  }
  `
})
export class Secondary2GridComponent {
  articles = input.required<Article[]>();
  height = input.required<number>();

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

