import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-main-grid',
  standalone: true,
  imports: [RouterLink, NgClass],
  template:`
  <div class="w-full h-[50rem] relative  overflow-hidden">

    <div class="absolute w-full h-[1.5rem] grid grid-cols-[9%_70%_6.6rem_1fr] top-0 z-10">
      <div></div>
      <div class="w-full h-[.75rem] bg-darkBrandRed col-span-2"></div>
      <div class="w-full h-[.75rem] mt-[.75rem] bg-black"></div>
    </div>

    <div class="h-full  w-full grid grid-cols-[9%_70%_6.6rem_1fr] relative">

      <div class="h-full w-full grid grid-cols-[1fr_3.3rem] relative">
        <div class="h-full w-full flex flex-col justify-end items-end pb-[1.5rem]">
          <div class="bg-black w-full h-[3.8rem] mb-[1.5rem]"></div>
          <div class="w-1/2 aspect-square"></div>
          <div class="w-1/2 bg-darkBrandRed aspect-square rounded-full"></div>
        </div>

        <div class="h-full  w-full grid grid-rows-[3.3rem_3.3rem]">
          <div></div>
          <div class="h-full aspect-square bg-black"></div>
        </div>
      </div>


      <a class="w-full h-full overflow-hidden relative" [routerLink]="['/article',urlFormat(highArticle()![0].articleId!, highArticle()![0].heading)]">
        <div class="absolute w-full h-[6.6rem] bottom-0 grid grid-cols-[3.3rem_1fr_3.3rem] mb-[1.5rem]">
          <div></div>
          <div class="max-w-[90%] w-fit p-3 px-5 h-full max-h-[6.6rem] bg-white ">
            <span class="text-[2rem] font-semibold leading-[2.5rem]">{{highArticle()![0].heading}}</span>
          </div>
          <div class="bg-white h-[3.3rem] mt-[3.3rem] aspect-square"></div>
        </div>
        <img [src]="highArticle()![0].frontImage" [alt]="highArticle()![0].frontImageAlt" class="w-full h-full  object-cover">
      </a>


      <div></div>

      <div class="w-full h-full  py-[1.5rem]">
        <div class=" h-full w-full grid grid-cols-[6.6rem] grid-rows-[1fr_3.8rem_1.5rem_6.6rem]">
          <div class="w-full h-full bg-darkBrandRed"></div>
          <div class="w-full h-full bg-black"></div>
          <div></div>
          <div class="w-full h-full relative flex justify-end ">
            <div class="w-[3.43rem] h-[3.43rem] rounded-full bg-darkBrandRed"></div>
            <div class="absolute top-0 left-0 w-[3.43rem] aspect-square rounded-full bg-black z-10"></div>
            <div class="absolute bottom-0 left-0 w-[3.43rem] aspect-square rounded-full bg-darkBrandRed z-20"></div>
          </div>
        </div>
      </div>


    </div>




  </div>
  
  `,
  styles:`
  .upperLeftArticle{
    background-color:black;
    clip-path: polygon(0% 0%,100% 0%,100% 82%,0% 100%);
   
    position:relative;
  }
  .lowerLeftArticle{
    margin-top:-3rem;
    background-color:#F8F8F8;
    clip-path: polygon(0% 31%,100% 1%,100% 100%,0% 100%);
   
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
  
    position:relative;
  }
  .lowerRightArticle{
    margin-top:-3rem;
    background-color:#F8F8F8;
    clip-path: polygon(0% 1%,100% 31%,100% 100%,0% 100%);
  
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
