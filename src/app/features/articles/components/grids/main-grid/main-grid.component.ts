import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main-grid',
  standalone: true,
  imports: [RouterLink, NgClass],
  template:`
  <div class="w-full h-[47.5rem] relative  overflow-hidden">

    <div class="absolute w-[21%] right-0 h-full z-10">
      <div class="w-fit h-full flex flex-col mt-[1.5rem] relative">
        @for (item of mediumArticles(); track $index) {
          <a class="w-[19.8rem]  h-[11.4rem] mb-[.75rem] -ml-[3.3rem] px-6 p-2 relative flex items-center"
          [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]"
          (mouseover)="cellHoverCheck('medium',$index)" (mouseout)="cellHoverCheck('medium',$index)"
          [ngClass]="mediumCellHover() == $index.toString() ? 'bg-black' : 'bg-white'">
            <div class="absolute w-2 h-3/5 right-0 bottom-0 top-0 my-auto " [ngClass]="mediumCellHover() == $index.toString() ? 'bg-white' : 'bg-black'"></div>
            <span class="font-semibold text-[1.3rem] leading-[1.55rem] whitespace-normal " [ngClass]="mediumCellHover() == $index.toString() ? 'text-white' : ''">
            {{item.heading}}
            </span>
          </a>
        }
          
      </div>
    </div>

    <div class="absolute w-full h-[1.5rem] grid grid-cols-[9%_70%_6.6rem_1fr] top-0 z-10">
      <div></div>
      <div class="w-full h-[.75rem] bg-brandViolet col-span-2"></div>
      <div class="w-full h-[.75rem] mt-[.75rem] bg-black"></div>
    </div>

    <div class="h-full  w-full grid grid-cols-[9%_70%_6.6rem_1fr] relative">

      <div class="h-full w-full grid grid-cols-[1fr_3.3rem] relative">
        <div class="h-full w-full flex flex-col justify-end items-end pb-[1.5rem]">
          <div class="bg-black w-full h-[3.8rem] mb-[1.5rem]"></div>
          <div class="w-1/2 aspect-square"></div>
          <div class="w-1/2 bg-brandViolet aspect-square rounded-full"></div>
        </div>

        <div class="h-full  w-full grid grid-rows-[3.3rem_3.3rem]">
          <div></div>
          <div class="h-full aspect-square bg-black"></div>
        </div>
      </div>


      <a class="w-full h-full overflow-hidden relative" [routerLink]="['/article',urlFormat(highArticle()![0].articleID!, highArticle()![0].heading)]" (mouseover)="cellHoverCheck('high',0)" (mouseout)="cellHoverCheck('high',0)">
        <div class="absolute w-full h-[6.6rem] bottom-0 grid grid-cols-[3.3rem_1fr_3.3rem] mb-[1.5rem] z-10">
          <div></div>
          <div class="max-w-[90%] w-fit p-3 px-5 h-full max-h-[6.6rem] " [ngClass]="highCellHover() == '0' ? 'bg-brandViolet text-white' : 'bg-white'">
            <span class="text-[2rem] font-semibold leading-[2.5rem]">{{highArticle()![0].heading}}</span>
          </div>
          <div class="bg-white h-[3.3rem] mt-[3.3rem] aspect-square"></div>
        </div>
        <img [src]="highArticle()![0].frontImage" [alt]="highArticle()![0].frontImageAlt" class="w-full h-full  object-cover" [ngClass]="highCellHover() == '0' ? 'scale-105' : ''">
      </a>


      <div></div>

      <div class="w-full h-full  py-[1.5rem]">
        <div class=" h-full w-full grid grid-cols-[6.6rem] grid-rows-[1fr_3.8rem_1.5rem_6.6rem]">
          <div class="w-full h-full bg-brandViolet"></div>
          <div class="w-full h-full bg-black"></div>
          <div></div>
          <div class="w-full h-full relative flex justify-end ">
            <div class="w-[3.43rem] h-[3.43rem] rounded-full bg-brandViolet"></div>
            <div class="absolute top-0 left-0 w-[3.43rem] aspect-square rounded-full bg-black z-10"></div>
            <div class="absolute bottom-0 left-0 w-[3.43rem] aspect-square rounded-full bg-brandViolet z-20"></div>
          </div>
        </div>
      </div>


    </div>




  </div>
  
  `,
  styles:``
})
export class MainGridComponent {
  highArticle = input<Article[]>();
  mediumArticles = input<Article[]>();

  highCellHover = model<string>('');
  mediumCellHover = model<string>('');

  cellHoverCheck(status: string,index:number) {
    if (status === 'medium') {
      if(!this.mediumCellHover()) this.mediumCellHover.set(index.toString())
        else this.mediumCellHover.set('')
    }

    if (status === 'high') {
      if(!this.highCellHover()) this.highCellHover.set(index.toString())
        else this.highCellHover.set('')
    }
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
