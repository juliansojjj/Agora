import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { NgClass, NgStyle } from '@angular/common';

@Component({
  selector: 'app-standard-grid',
  standalone: true,
  imports: [RouterLink, NgClass, NgStyle],
  template:`
    <div class="w-full relative h-full grid  gap-[3.5rem] place-items-center" [ngStyle]="{'grid-template-columns': 'repeat(3, ' + height() + 'rem)'}">
      @for (item of articles(); track $index) {
        <a [routerLink]="['/article',urlFormat(item.articleId!, item.heading)]" 
        (mouseover)="cellHoverCheck($index)" (mouseout)="cellHoverCheck($index)"
        class="h-full aspect-square overflow-hidden relative flex" [style.height]="height()+'rem'">
        <img [src]="item.frontImage" [alt]="item.frontImageAlt" class="w-full h-full object-cover" [style.height]="height()/3*2+'rem'" [ngClass]="cellHover() == $index.toString() ? 'scale-105' : ''">
        <div class="absolute bottom-0 w-full z-10 p-3" [style.height]="height()/3+'rem'" [ngClass]="cellHover() == $index.toString() ? ' bg-brandGrey' : 'bg-white'"> 
          <span class="text-[1.2rem] font-semibold">{{item.heading}}</span>
        </div>
      </a>
      }
    </div>
  `,
  styles:''
})
export class StandardGridComponent {
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

