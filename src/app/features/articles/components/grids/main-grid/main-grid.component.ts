import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main-grid',
  standalone: true,
  imports: [RouterLink, NgClass],
  template:`
  <div class="h-fit w-full grid grid-cols-[1fr_2fr_1fr] gap-x-8 place-items-center">
    <div class="grid grid-rows-[2fr_1fr] w-fit h-full">

      <a class="upperLeftArticle" [routerLink]="['/article',urlFormat(mediumArticles()![0].articleId!, mediumArticles()![0].heading)]" (mouseover)="cellHoverCheck('upperLeft')" (mouseout)="cellHoverCheck('upperLeft')">
          <div class="absolute top-0 from-black bg-gradient-to-b text-white p-3 pb-10 flex flex-col z-20" >
            <div class="w-full h-1 mb-2 bg-brandRed" [ngClass]="mediumArticles()![0].subscription ? 'block' : 'hidden'" [ngClass]="upperLeftCellHover() ? 'bg-white' : ''"></div>
            <span class="font-semibold text-[1.3rem] leading-[1.7rem]" [ngClass]="upperLeftCellHover() ? 'text-brandRed' : ''">{{mediumArticles()![0].heading}}</span>
          </div>
          <img [src]="mediumArticles()![0].frontImage" [alt]="mediumArticles()![0].frontImageAlt" class="h-full object-cover" [ngClass]="upperLeftCellHover() ? 'scale-105' : ''">
      </a>

      <a class="lowerLeftArticle" [routerLink]="['/article',urlFormat(mediumArticles()![1].articleId!, mediumArticles()![1].heading)]" (mouseover)="cellHoverCheck('lowerLeft')" (mouseout)="cellHoverCheck('lowerLeft')">
          <div class="absolute bottom-0 from-black bg-gradient-to-t text-white p-3 pt-7 flex flex-col z-20">

            <span class="font-semibold text-[1.2rem]" [ngClass]="lowerLeftCellHover() ? 'text-brandRed' : ''">{{mediumArticles()![1].heading}}</span>
            <div class="w-full h-1 mt-2 bg-brandRed" [ngClass]="{'block': mediumArticles()![1].subscription,'hidden': !mediumArticles()![1].subscription,'bg-white': lowerLeftCellHover()}">></div>

            <!-- <span class="">{{highArticle()![0].subheading}}</span> -->
          </div>
          <img [src]="mediumArticles()![1].frontImage" [alt]="mediumArticles()![1].frontImageAlt" class="h-full object-cover" [ngClass]="lowerLeftCellHover() ? 'scale-105' : ''">
      </a>

    </div>


    <a class="h-[45rem] relative border-black border-4 w-fit overflow-hidden" [routerLink]="['/article',urlFormat(highArticle()![0].articleId!, highArticle()![0].heading)]" (mouseover)="cellHoverCheck('main')" (mouseout)="cellHoverCheck('main')">
      <div class="absolute bottom-0 bg-white   text-black p-4  flex items-center z-10">
        <span class="font-bold text-[2rem] leading-[2.5rem]">{{highArticle()![0].heading}}</span>
      </div>
      <img [src]="highArticle()![0].frontImage" [alt]="highArticle()![0].frontImageAlt" class="h-full object-cover" [ngClass]="mainCellHover() ? 'scale-105' : ''">
    </a>



    <div class="grid grid-rows-[2fr_1fr] w-fit h-full">
      
    <a class="upperRightArticle" [routerLink]="['/article',urlFormat(mediumArticles()![2].articleId!, mediumArticles()![2].heading)]" (mouseover)="cellHoverCheck('upperRight')" (mouseout)="cellHoverCheck('upperRight')">
          <div class="absolute top-0 from-black bg-gradient-to-b text-white p-3 pb-10 flex flex-col z-20" >
            <div class="w-full h-1 mb-2 bg-brandRed" [ngClass]="mediumArticles()![2].subscription ? '' : ''" [ngClass]="upperRightCellHover() ? 'bg-white' : ''"></div>
            <span class="font-semibold text-[1.3rem] leading-[1.7rem]" [ngClass]="upperRightCellHover() ? 'text-brandRed' : ''">{{mediumArticles()![2].heading}}</span>
          </div>
          <img [src]="mediumArticles()![2].frontImage" [alt]="mediumArticles()![2].frontImageAlt" class="h-full object-cover" [ngClass]="upperRightCellHover() ? 'scale-105' : ''">
      </a>

      <a class="lowerRightArticle" [routerLink]="['/article',urlFormat(mediumArticles()![3].articleId!, mediumArticles()![3].heading)]" (mouseover)="cellHoverCheck('lowerRight')" (mouseout)="cellHoverCheck('lowerRight')">
          <div class="absolute bottom-0 from-black bg-gradient-to-t text-white p-3 pt-7 flex flex-col z-20">

            <span class="font-semibold text-[1.2rem]" [ngClass]="lowerRightCellHover() ? 'text-brandRed' : ''">{{mediumArticles()![3].heading}}</span>
            <div class="w-full h-1 mt-2 bg-brandRed" [ngClass]="mediumArticles()![3].subscription ? 'block' : 'hidden'" [ngClass]="lowerRightCellHover() ? 'bg-white' : ''"></div>

            <!-- <span class="">{{highArticle()![0].subheading}}</span> -->
          </div>
          <img [src]="mediumArticles()![3].frontImage" [alt]="mediumArticles()![3].frontImageAlt" class="h-full w-full object-cover" [ngClass]="lowerRightCellHover() ? 'scale-105' : ''">
      </a>

    </div>
  </div>
  `,
  styles:`
  .upperLeftArticle{
    background-color:black;
    clip-path: polygon(0% 0%,100% 0%,100% 82%,0% 100%);
    max-width:20rem;
    position:relative;
  }
  .lowerLeftArticle{
    margin-top:-3rem;
    background-color:black;
    clip-path: polygon(0% 31%,100% 1%,100% 100%,0% 100%);
    max-width:20rem;
    position:relative;
  }
  
  
  .upperRightArticle{
    background-color:black;
    clip-path: polygon(0% 0%,100% 0%,100% 100%,0% 82%);
    max-width:20rem;
    position:relative;
  }
  .lowerRightArticle{
    margin-top:-3rem;
    background-color:black;
    clip-path: polygon(0% 1%,100% 31%,100% 100%,0% 100%);
    max-width:20rem;
    position:relative;
  }
  `
})
export class MainGridComponent {
  highArticle = input<Article[]>();
  mediumArticles = input<Article[]>();

  mainCellHover = model<boolean>(false)

  upperLeftCellHover = model<boolean>(false)
  lowerLeftCellHover = model<boolean>(false)

  upperRightCellHover = model<boolean>(false)
  lowerRightCellHover = model<boolean>(false)

  cellHoverCheck(cellPos:string){
    if(cellPos === "upperLeft")this.upperLeftCellHover.update(value=>!value)
    if(cellPos === "lowerLeft")this.lowerLeftCellHover.update(value=>!value)
    
      if(cellPos === "upperRight")this.upperRightCellHover.update(value=>!value)
    if(cellPos === "lowerRight")this.lowerRightCellHover.update(value=>!value)

    if(cellPos === "main")this.mainCellHover.update(value=>!value)
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
