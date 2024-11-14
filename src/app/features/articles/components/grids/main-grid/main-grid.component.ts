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


    <a class="grid grid-rows-[2fr_1fr] w-fit h-full bg-brandRed" [routerLink]="['/article',urlFormat(mediumArticles()![0].articleId!, mediumArticles()![0].heading)]" (mouseover)="cellHoverCheck('left')" (mouseout)="cellHoverCheck('left')">

      <div class="upperLeftArticle"  >
      @if(mediumArticles()![0].subscription){
          <img src="agora-isotype-fill.svg" class="h-[2rem] absolute top-0 left-0 ml-4 mt-3 z-10"/>
        }
          <img [src]="mediumArticles()![0].frontImage" [alt]="mediumArticles()![0].frontImageAlt" class="h-full object-cover" [ngClass]="leftCellHover() ? 'scale-105' : ''">
      </div>

      <div class="lowerLeftArticle" >
        <span class="font-semibold text-[1.55rem] leading-[2rem] text-right" [ngClass]="leftCellHover() ? 'text-brandRed' : ''">{{mediumArticles()![0].heading}}</span>
        
      </div>

</a>


    <a class="h-[40rem] relative w-fit overflow-hidden" [routerLink]="['/article',urlFormat(highArticle()![0].articleId!, highArticle()![0].heading)]" (mouseover)="cellHoverCheck('main')" (mouseout)="cellHoverCheck('main')">
      <div class="absolute bottom-0    text-black  flex flex-col items-center z-10">
      
        <div class="w-full h-8 bg-brandRed flex justify-center">
        @if(highArticle()![0].subscription){
          <img src="agora-isotype-fill.svg" class="h-full  p-[.35rem]" [ngClass]="mainCellHover() ? 'brightness-0' : 'brightness-200'"/>
        }
        </div>
        <div class="p-8 bg-brandGrey">
          <span class="font-semibold text-[1.85rem] leading-[2.5rem]" [ngClass]="mainCellHover() ? 'text-brandRed' : ''">{{highArticle()![0].heading}}</span> 
        </div>
      </div>
      <img [src]="highArticle()![0].frontImage" [alt]="highArticle()![0].frontImageAlt" class="h-full object-cover" [ngClass]="mainCellHover() ? 'scale-105' : ''">
    </a>



    <a class="grid grid-rows-[2fr_1fr] w-fit h-full bg-brandRed" [routerLink]="['/article',urlFormat(mediumArticles()![1].articleId!, mediumArticles()![1].heading)]" (mouseover)="cellHoverCheck('right')" (mouseout)="cellHoverCheck('right')">
      
    <div class="upperRightArticle" >
    @if(mediumArticles()![1].subscription){
          <img src="agora-isotype-fill.svg" class="h-[2rem] absolute top-0 right-0 mr-4 mt-3 z-10"/>
        }
          <img [src]="mediumArticles()![1].frontImage" [alt]="mediumArticles()![1].frontImageAlt" class="h-full object-cover" [ngClass]="rightCellHover() ? 'scale-105' : ''">
    </div>

      <div class="lowerRightArticle" >
        <span class="font-semibold text-[1.55rem] leading-[2rem]" [ngClass]="rightCellHover() ? 'text-brandRed' : ''">{{mediumArticles()![1].heading}}</span>
        
      </div>

    </a>
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
    background-color:#F8F8F8;
    clip-path: polygon(0% 31%,100% 1%,100% 100%,0% 100%);
    max-width:20rem;
    position:relative;

    display:flex;
    justify-content: end;
    align-items: start;
    padding:1rem;
    padding-top:5.5rem;
  }
  
  
  .upperRightArticle{
    background-color:black;
    clip-path: polygon(0% 0%,100% 0%,100% 100%,0% 82%);
    max-width:20rem;
    position:relative;
  }
  .lowerRightArticle{
    margin-top:-3rem;
    background-color:#F8F8F8;
    clip-path: polygon(0% 1%,100% 31%,100% 100%,0% 100%);
    max-width:20rem;
    position:relative;

    display:flex;
    padding:1rem;
    padding-top:5.5rem;

  }
  `
})
export class MainGridComponent {
  highArticle = input<Article[]>();
  mediumArticles = input<Article[]>();

  mainCellHover = model<boolean>(false)

  leftCellHover = model<boolean>(false)
  rightCellHover = model<boolean>(false)

  cellHoverCheck(cellPos:string){
    if(cellPos === "left")this.leftCellHover.update(value=>!value)

    if(cellPos === "right")this.rightCellHover.update(value=>!value)

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
