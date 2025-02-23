import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
    selector: 'app-main2-grid',
    imports: [RouterLink, NgClass],
    template: `
    <div class="h-fit w-full relative 
    xl:grid-cols-[1fr_19.8rem]
    lg:grid-cols-[1fr_16.5rem] lg:grid
    flex flex-col
    ">

      <a class="w-full max-sm:h-[55vh] max-lg:h-[60vh] lg:max-h-[86vh] relative" 
      [routerLink]="['/article',urlFormat(highArticle()![0].articleID!, highArticle()![0].heading)]" 
      (mouseover)="cellHoverCheck('high',0)" (mouseout)="cellHoverCheck('high',0)">
        <div class="absolute w-full h-full bottom-0  
        3xl:grid-rows-[26.4rem_13.2rem_6.6rem_3.3rem]
        xl:grid-rows-[1fr_13.2rem_6.6rem_3.3rem] xl:grid
        flex items-end z-10">
          <div class="lg:block hidden"></div>

          <div class="hidden xl:flex flex-col h-full justify-end">
            <div class="h-[6.6rem] w-[6.6rem] bg-white"></div>
            <div class="h-[6.6rem] w-[6.6rem] bg-brandPinkHigh"></div>
          </div>

          <div class="grid
          3xl:grid-cols-[6.6rem_1fr_13.2rem] 
          xl:grid-cols-[6.6rem_1fr_3.3rem] 
          lg:grid-cols-[3.3rem_1fr_3.3rem] ">
            <div></div>
            <div class="w-full h-fit  
            xl:mb-0 xl:pl-7 xl:px-4
            md:h-[6.6rem] md:mb-[3.3rem] md:py-3
            flex p-5" [ngClass]="highCellHover() == '0' ? 'bg-black text-white' : 'bg-white'">
              <span class="3xl:text-[1.8rem] md:text-[1.6rem] xsm:text-[1.3rem] text-[1.1rem] font-semibold leading-[120%]">{{highArticle()![0].heading}}</span>
            </div>
            <div class="w-full hidden 3xl:flex justify-end">
              <div class="h-[6.6rem] w-[3.3rem] bg-white"></div>
            </div>
          </div>

          <div></div>
        </div>
        <div class="w-full h-full overflow-hidden">
          <img [src]="highArticle()![0].frontImage" [alt]="highArticle()![0].frontImageAlt" class="w-full h-full  object-cover" [ngClass]="highCellHover() == '0' ? 'scale-[101%]' : ''">
        </div>
      </a>

      <div class="w-full h-[1rem] bg-brandViolet max-md:block hidden"></div>
      <div class="w-full h-[1rem] bg-brandPinkHigh max-md:block hidden"></div>

      <div class="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:flex-col w-full lg:h-[46.2rem] relative">
        <div class="w-full h-[46.2rem] absolute top-0 lg:grid hidden grid-rows-[3.3rem_9.9rem_3.3rem_9.9rem_3.3rem_9.9rem_3.3rem_3.3rem]">
          <div class="w-[3.3rem] aspect-square place-self-end bg-brandPinkHigh"></div>
          <div></div>
          <div class="w-full flex justify-between">
            <div class="w-[3.3rem] aspect-square bg-brandPinkHigh"></div>
            <div class="w-[3.3rem] aspect-square bg-brandPinkHigh"></div>
          </div>
          <div></div>
          <div class="w-full flex justify-between">
            <div class="w-[3.3rem] aspect-square bg-brandPinkHigh"></div>
            <div class="w-[3.3rem] aspect-square bg-brandPinkHigh"></div>
          </div>
          <div></div>
          <div class="w-[3.3rem] aspect-square bg-brandPinkHigh"></div>
          <div class="w-[3.3rem] aspect-square place-self-end bg-brandPinkHigh"></div>
        </div>

        @for (item of mediumArticles(); track $index) {
          @if($index == 1){
            <a class="lg:p-6 relative flex
            lg:w-[16.5rem] lg:h-[9.9rem] lg:mt-[3.3rem] 
            sm:h-[15rem] sm:pt-8 sm:items-start
            w-full h-[7rem] px-6 items-center"
            [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]"
            (mouseover)="cellHoverCheck('medium',$index)" (mouseout)="cellHoverCheck('medium',$index)"
            [ngClass]="mediumCellHover() == $index.toString() ? 'bg-black' : 'bg-white max-lg:bg-brandGrey'">
              <span class="lg:text-right font-medium sm:text-[1.2rem] text-[1rem] leading-[125%] whitespace-normal" 
              [ngClass]="mediumCellHover() == $index.toString() ? 'text-white' : ''">
                {{item.heading}}
              </span>
            </a>
          }@else{
            <a class="lg:p-6 relative flex
            lg:w-[16.5rem] lg:h-[9.9rem] lg:mt-[3.3rem] 
            sm:h-[15rem] sm:pt-8 sm:items-start
            w-full h-[7rem] px-6 items-center"
            [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]"
            (mouseover)="cellHoverCheck('medium',$index)" (mouseout)="cellHoverCheck('medium',$index)"
            [ngClass]="mediumCellHover() == $index.toString() ? 'bg-black' : 'bg-white'">

              <!-- <div class="absolute my-auto md:hidden  
              w-2 h-5/6 top-0 bottom-0 left-0 ml-[.5rem]" 
              [ngClass]="mediumCellHover() == $index.toString() ? 'bg-white' : 'bg-brandPinkHigh'">
              </div> -->
              
              <span class="lg:text-right font-medium sm:text-[1.2rem] text-[1rem] leading-[125%] whitespace-normal" 
              [ngClass]="mediumCellHover() == $index.toString() ? 'text-white' : ''">
                {{item.heading}}
              </span>
            </a>
          }
          
        }
      </div>
    
    </div>
  `,
    styles: ``
})
export class Main2GridComponent {
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
