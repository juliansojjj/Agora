import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-secondary-grid',
  standalone: true,
  imports: [RouterLink, NgClass],
  template: `
    <div class="relative w-full h-full">
      <div class="grid grid-rows-2 h-full w-full place-items-end gap-y-[4.22vw] z-10 relative">
        
        <div class=" grid grid-cols-[2.6fr_4.22vw_1.6fr] w-full  ">
          <a class="flex">
            <div class="bg-brandGrey w-full h-full p-3">
              <span class="font-semibold text-[1.2rem] leading-[1.55rem]">{{highArticle()![0].heading}}</span>
            </div>
            <img [src]="highArticle()![0].frontImage" [alt]="highArticle()![0].frontImageAlt" class=" min-h-full w-fit aspect-[2/1] object-cover overflow-hidden">
            
          </a>
          <div class="w-full"></div>
          <a class="flex w-full">
              <img [src]="mediumArticles()![0].frontImage" [alt]="mediumArticles()![0].frontImageAlt" class="h-full object-cover min-w-full aspect-square overflow-hidden">
            
            <div class="bg-brandGrey w-full  h-full p-3">
              <span class="font-semibold text-[1.2rem] leading-[1.55rem]">{{mediumArticles()![0].heading}}</span>
            </div>
          </a>
        </div>


        <div class=" grid grid-cols-[2.6fr_4.22vw_1.6fr]   w-full h-full relative">
          <div class="grid grid-cols-[1fr_2fr] w-full justify-end">
            <div class="flex justify-end items-end h-full w-full">
            <div class=" w-[1.7vw] h-[4vw] bg-brandRed"></div>

            </div>
          <div class="h-full min-w-[29.4vw] w-full flex justify-between relative items-end" >
            
            <a class="h-full min-w-[8.63vw] bg-brandGrey">

            </a>
            <div class=" w-full h-[4vw] bg-black"></div>
            <a class="h-full min-w-[8.63vw] bg-brandGrey"></a>
            <div class=" w-full h-[4vw] bg-brandRed"></div>
            <a class="h-full min-w-[8.63vw] bg-brandGrey"></a>

          </div>
          </div>
          
          <div class="w-full"></div>


          <a class="flex w-full">
            <div class="bg-blue-100 h-full aspect-square "></div>
            <div class="bg-brandGrey w-full h-full"></div>
          </a>
        </div>
      </div>

      <div class="absolute  w-full h-full top-0">
        <div class="bg-brandRed h-[18.807vw] w-[18.807vw]  right-[16.3vw]  top-0 bottom-0 my-auto absolute"></div>

        <div class="absolute top-0 right-0 flex flex-col -mt-[4.22vw]">
          <div class="bg-black h-[4.22vw] aspect-[17/8.1]"></div>
          <div class="bg-black h-[4.22vw] aspect-[17/8.1] mt-[14.7vw]"></div>
        </div>
      </div>

    </div>

  `,
  styles: ``,
})
export class SecondaryGridComponent {
  highArticle = input<Article[]>();
  mediumArticles = input<Article[]>();
  lowArticles = input<Article[]>();

  mainCellHover = model<boolean>(false);

  leftCellHover = model<boolean>(false);
  rightCellHover = model<boolean>(false);

  cellHoverCheck(cellPos: string) {
    if (cellPos === 'left') this.leftCellHover.update((value) => !value);

    if (cellPos === 'right') this.rightCellHover.update((value) => !value);

    if (cellPos === 'main') this.mainCellHover.update((value) => !value);
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
