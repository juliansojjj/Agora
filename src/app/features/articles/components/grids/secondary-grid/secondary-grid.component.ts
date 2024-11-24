import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-secondary-grid',
  standalone: true,
  imports: [RouterLink, NgClass],
  template: `
  <div class="relative">
    <div class=" w-full h-full grid grid-rows-[20rem_20rem] gap-y-[3.5rem] z-10 relative">
        
        <div class=" grid grid-cols-[60%_5%_35%] w-full h-full ">


          <a class="h-full grid grid-cols-[20%_80%] overflow-hidden" [routerLink]="['/article',urlFormat(highArticle()![0].articleId!, highArticle()![0].heading)]"
          (mouseover)="cellHoverCheck('high',0)" (mouseout)="cellHoverCheck('high',0)">
            <div class=" w-full h-full p-3 " [ngClass]="highCellHover() == '0' ? 'text-white bg-brandViolet' : 'bg-white'"> 
              <span class="font-semibold text-[1.4rem] leading-[1.55rem]">{{highArticle()![0].heading}}</span>
            </div>
            <div class="w-full h-full bg-black overflow-hidden">   
              <img [src]="highArticle()![0].frontImage" [alt]="highArticle()![0].frontImageAlt" class="  w-full object-cover " [ngClass]="highCellHover() == '0' ? 'scale-105' : ''">
            </div>
          </a>

          <div class="w-full"></div>

          <a class="h-full grid grid-cols-[65.77%_34.23%] overflow-hidden" 
          [routerLink]="['/article',urlFormat(mediumArticles()![0].articleId!, mediumArticles()![0].heading)]"
          (mouseover)="cellHoverCheck('medium',0)" (mouseout)="cellHoverCheck('medium',0)">
          <div class="w-full h-full bg-black overflow-hidden">   
            <img [src]="mediumArticles()![0].frontImage" [alt]="mediumArticles()![0].frontImageAlt" class="h-full object-cover w-full "  [ngClass]="mediumCellHover() == '0' ? 'scale-105' : ''">
          </div> 
            <div class=" w-full  h-full p-2" [ngClass]="mediumCellHover() == '0' ? 'text-white bg-black' : 'bg-white'">
              <span class="font-semibold text-[1.15rem] leading-[1.55rem] whitespace-normal hyphens-auto">{{mediumArticles()![0].heading}}</span>
            </div>
          </a>
        </div>


        <div class=" grid grid-cols-[12%_48%_5%_35%]   w-full h-full relative ">
          <div class="w-full h-full flex justify-end items-end">
            <div class="h-[5.5rem] w-[3.5rem] bg-brandViolet "></div>

          </div>
          <div class="grid grid-cols-[1fr_3.5rem_1fr_3.5rem_1fr] w-full place-items-end">
            <a class="bg-brandGrey h-full w-full p-3"
            [ngClass]="lowCellHover() == '0' ? 'bg-brandGrey' : 'bg-white'" 
            [routerLink]="['/article',urlFormat(lowArticles()![0].articleId!, lowArticles()![0].heading)]"
            (mouseover)="cellHoverCheck('low',0)" (mouseout)="cellHoverCheck('low',0)">
              <span class="font-medium text-[1.15rem] leading-[1.65rem]" >{{lowArticles()![0].heading}}</span>
            </a>
            <div class="h-[5.5rem] bg-black w-full"></div>

            <a class=" h-full w-full p-3"  [ngClass]="lowCellHover() == '1' ? 'bg-brandGrey ' : 'bg-white'"
            [routerLink]="['/article',urlFormat(lowArticles()![1].articleId!, lowArticles()![1].heading)]"
            (mouseover)="cellHoverCheck('low',1)" (mouseout)="cellHoverCheck('low',1)">
              <span class="font-medium text-[1.15rem] leading-[1.65rem]">{{lowArticles()![1].heading}}</span>
            </a>

            <div class="h-[5.5rem] bg-brandViolet w-full"></div>

            <a class="bg-brandGrey h-full w-full p-3" [ngClass]="lowCellHover() == '2' ? 'bg-brandGrey ' : 'bg-white'"
            [routerLink]="['/article',urlFormat(lowArticles()![2].articleId!, lowArticles()![2].heading)]"
            (mouseover)="cellHoverCheck('low',2)" (mouseout)="cellHoverCheck('low',2)">
              <span class="font-medium text-[1.15rem] leading-[1.65rem]" >{{lowArticles()![2].heading}}</span>  
            </a>
          </div>
          
          <div class="w-full"></div>


          <a class="w-full h-full grid grid-cols-[65.77%_34.23%]" [routerLink]="['/article',urlFormat(mediumArticles()![1].articleId!, mediumArticles()![1].heading)]"
          (mouseover)="cellHoverCheck('medium',1)" (mouseout)="cellHoverCheck('medium',1)">
            <div class="w-full h-full bg-black overflow-hidden">
              <img [src]="mediumArticles()![1].frontImage" [alt]="mediumArticles()![1].frontImageAlt" class="w-full h-full object-cover " [ngClass]="mediumCellHover() == '1' ? 'scale-105' : ''">
            </div>
            <div class=" w-full h-full p-2 " [ngClass]="mediumCellHover() == '1' ? 'text-white bg-black' : 'bg-white'">
              <span class="font-semibold text-[1.15rem] leading-[1.55rem] whitespace-normal hyphens-auto">{{mediumArticles()![1].heading}}</span>
            </div>
          </a>
        </div>
      </div>

      <div class="w-full h-full grid grid-cols-[48.5%_28%_11.5%_12%] absolute top-0 left-0">
        <div class="grid grid-cols-[3.5rem_3.5rem_3.5rem] grid-rows-[3.5rem_3.5rem] -ml-[10.5rem]">
          <div class="bg-black h-[3.5rem] col-span-2 w-full"></div>
          <div></div>
          <div class="col-span-2"></div>
          <div class="bg-brandViolet h-[3.5rem] aspect-square"></div>
        </div>

        <div class="w-full h-full flex items-center">
          <div class="w-full aspect-square bg-brandViolet "></div>
        </div>
        
        <div></div>
          <div class="w-[7rem] h-[3.5rem] bg-black mt-[20rem] -mr-[3.5rem] justify-self-end"></div>
        
      </div>

      </div>

  `,
  styles: ``,
})
export class SecondaryGridComponent {
  highArticle = input.required<Article[]>();
  mediumArticles = input.required<Article[]>();
  lowArticles = input.required<Article[]>();

  highCellHover = model<string>('');
  mediumCellHover = model<string>('');
  lowCellHover = model<string>('');

  cellHoverCheck(status: string,index:number) {
    if (status === 'low'){
      if(!this.lowCellHover()) this.lowCellHover.set(index.toString())
      else this.lowCellHover.set('')
      }

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
