import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

@Component({
    selector: 'app-secondary3-grid',
    imports: [RouterLink, NgClass, DatePipe],
    template: `
  <div class="w-full h-fit relative">

    <div class="w-full absolute top-0 left-0 h-full -z-20 hidden md:flex justify-center lg:justify-between items-center">
      <div class="w-fit h-full flex-col justify-between relative 
        xl:-ml-[4rem]
        lg:-ml-[3.5rem] lg:flex
        hidden">

        <div class="cornerShape bg-brandShade aspect-square 
          xl:w-[4rem] xl:-mt-[4rem] 
          lg:w-[3rem] lg:-mt-[3rem]">
        </div>
        <div></div>
        <div class="cornerShape bg-brandShade aspect-square -rotate-90
          xl:w-[4rem] xl:-mb-[4rem] 
          lg:w-[3rem] lg:-mb-[3rem]"></div>

      </div>

      <div class="bg-brandGrey aspect-square h-[6rem] relative"></div>

      <div class="w-fit h-full flex-col justify-between relative 
        xl:-mr-[4rem]
        lg:-mr-[3.5rem] lg:flex
        hidden">

        <div class="cornerShape bg-brandShade aspect-square rotate-90 
          xl:w-[4rem] xl:-mt-[4rem] 
          lg:w-[3rem] lg:-mt-[3rem]">
        </div>
        <div></div>
        <div class="cornerShape bg-brandShade aspect-square rotate-180
          xl:w-[4rem] xl:-mb-[4rem] 
          lg:w-[3rem] lg:-mb-[3rem]"></div>
          
      </div>

    </div>


    <div class="w-full relative h-fit grid md:grid-cols-2 grid-cols-1 xl:gap-[2rem] lg:gap-[1.5rem] gap-[1rem] place-items-center">

      @for (item of articles().slice(0,2); track $index) {
        <a [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]" 
        (mouseover)="cellHoverCheck($index)" (mouseout)="cellHoverCheck($index)"
        class="w-full flex  relative 
        2xl:h-[20rem]
        xl:aspect-[2/1]
        md:flex-col
        sm:flex-row
        h-[17rem] flex-col"
        [ngClass]="$index % 2 !== 0 ? 'xl:flex-row-reverse' : 'xl:flex-row'">

        <div class="w-full
          xl:h-full
          md:h-[10rem]
          sm:h-full
          h-[10rem]"
          [ngClass]="{
          'upperLeft': $index % 2 === 0,
          'upperRight': $index % 2 !== 0}">

            <img [src]="item.frontImage" [alt]="item.frontImageAlt" 
            class="h-full w-full object-cover"
            [ngClass]="{'scale-105': cellHover() == $index.toString()}">

        </div>

        <div class="w-full p-3 z-10 flex flex-col justify-between
          xl:h-full
          md:h-[7rem]
          sm:h-full
          h-[7rem]" 
        [ngClass]="{
        'bg-brandGrey': cellHover() == $index.toString(),
        'bg-white': cellHover() != $index.toString()}"> 
          <span class="lg:text-[1.2rem] text-[1rem] font-medium">{{item.heading}}</span>
          <div class="flex flex-col">
            <span class="hidden xl:inline-block text-[1.1rem] italic self-end">{{item.authorName}}</span>
            <span class="hidden xl:inline-block text-[1rem] italic self-end">{{item.date.toDate() | date:'MM/d/y'}}</span>
          </div>
        </div>
      </a>
      }

      @for (item of articles().slice(2,4); track $index) {
        <a [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]" 
        (mouseover)="cellHoverCheck($index+2)" (mouseout)="cellHoverCheck($index+2)"
        class="w-full flex  relative 
        2xl:h-[20rem]
        xl:aspect-[2/1]
        h-[17rem] md:flex-col-reverse
        sm:flex-row
        flex-col"
        [ngClass]="$index+2 % 2 !== 0 ? 'xl:flex-row-reverse' : 'xl:flex-row'">

        <div class="w-full
          xl:h-full
          md:h-[10rem]
          sm:h-full
          h-[10rem]"
          [ngClass]="{
          'lowerLeft': $index+2 % 2 === 0,
          'lowerRight': $index+2 % 2 !== 0}">

            <img [src]="item.frontImage" [alt]="item.frontImageAlt" 
            class="h-full w-full object-cover"
            [ngClass]="{'scale-105': cellHover() == ($index+2).toString()}">
        </div>

        <div class="w-full p-3 z-10 flex flex-col justify-between
          xl:h-full
          md:h-[7rem]
          sm:h-full
          h-[7rem]" 
        [ngClass]="{
        'bg-brandGrey': cellHover() == ($index+2).toString(),
        'bg-white': cellHover() != ($index+2).toString()}"> 
          <span class="lg:text-[1.2rem] text-[1rem] font-medium">{{item.heading}}</span>
          <div class="flex flex-col">
            <span class="hidden xl:inline-block text-[1.1rem] italic self-end">{{item.authorName}}</span>
            <span class="hidden xl:inline-block text-[1rem] italic self-end">{{item.date.toDate() | date:'MM/d/y'}}</span>
          </div>
        </div>
      </a>
      }
      @for (item of articles().slice(4,8); track $index) {
        <a [routerLink]="['/article',urlFormat(item.articleID!, item.heading)]" 
        (mouseover)="cellHoverCheck($index+4)" (mouseout)="cellHoverCheck($index+4)"
        class="w-full   relative 
        2xl:h-[20rem]
        xl:aspect-[2/1]
        h-[17rem] md:hidden
        sm:flex-row
        flex-col flex"
        [ngClass]="$index+4 % 2 !== 0 ? 'xl:flex-row-reverse' : 'xl:flex-row'">

        <div class="w-full
          xl:h-full
          md:h-[10rem]
          sm:h-full
          h-[10rem]"
          [ngClass]="{
          'lowerLeft': $index+4 % 2 === 0,
          'lowerRight': $index+4 % 2 !== 0}">

            <img [src]="item.frontImage" [alt]="item.frontImageAlt" 
            class="h-full w-full object-cover"
            [ngClass]="{'scale-105': cellHover() == ($index+4).toString()}">
        </div>

        <div class="w-full p-3 z-10
          xl:h-full
          md:h-[7rem]
          sm:h-full
          h-[7rem]" 
        [ngClass]="{
        'bg-brandGrey': cellHover() == ($index+4).toString(),
        'bg-white': cellHover() != ($index+4).toString()}"> 
          <span class="lg:text-[1.2rem] text-[1rem] font-medium">{{item.heading}}</span>
        </div>
      </a>
      }

    </div>
  </div>
  `,
    styles: `
  .cornerShape{
    clip-path: polygon(
      0% 0%,
      100% 0%,
      100% 50%,
      50% 50%,
      50% 100%,
      0% 100%);
  }
  .upperLeft{
    clip-path: polygon(
      0% 30%,
      30% 0%,
      100% 0%,
      100% 100%,
      0% 100%);
  }
  .lowerLeft{
    clip-path: polygon(
      0% 0%,
      100% 0%,
      100% 100%,
      30% 100%,
      0% 70%);
  }
  .upperRight{
    clip-path: polygon(
      0% 0%,
      70% 0%,
      100% 30%,
      100% 100%,
      0% 100%);
  }
  .lowerRight{
    clip-path: polygon(
      0% 0%,
      100% 0%,
      100% 70%,
      70% 100%,
      0% 100%);
  }

  @media only screen and (max-width: 768px) {
    .lowerRight,
    .upperRight, 
    .lowerLeft, 
    .upperLeft{
      clip-path: polygon(
        0% 0%,
        100% 0%,
        100% 100%,
        0% 100%);
    }
  }
  `
})
export class Secondary3GridComponent {
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

