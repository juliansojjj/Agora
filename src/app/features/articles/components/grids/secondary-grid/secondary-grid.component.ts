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
        
        <div class=" grid grid-cols-[2.6fr_1.6fr] w-full gap-x-[4.22vw] ">
          <a class="flex">
            <div class="bg-brandGrey w-[30%] h-full"></div>
            <div class="bg-green-300 w-full aspect-[2/1]"></div>
          </a>
          <a class="flex">
            <div class="bg-blue-100 h-full aspect-square"></div>
            <div class="bg-brandGrey w-3/5 h-full"></div>
          </a>
        </div>


        <div class=" grid grid-cols-[.555fr_.445fr] gap-x-[4.22vw]  w-[86.6%] h-full relative">
          <!-- <div class="h-full w-full  flex justify-between relative" >

            <a class="h-full w-[8.63vw] bg-orange-200"></a>
            <a class="h-full w-[8.63vw] bg-orange-200"></a>
            <a class="h-full w-[8.63vw] bg-orange-200"></a>

          </div> -->
          <div class="h-full w-full  flex justify-between relative items-end" >
            
            <a class="h-full w-[8.63vw] bg-brandGrey"></a>
            <div class=" w-[2vw] h-[4vw] bg-black"></div>
            <a class="h-full w-[8.63vw] bg-brandGrey"></a>
            <div class=" w-[2vw] h-[4vw] bg-brandRed"></div>
            <a class="h-full w-[8.63vw] bg-brandGrey"></a>

          </div>


          <a class="flex w-full">
            <div class="bg-blue-100 h-full aspect-square "></div>
            <div class="bg-brandGrey w-full h-full"></div>
          </a>
        </div>
      </div>

      <div class="absolute  w-full h-full top-0">
        <div class="bg-brandRed h-[18.807vw] w-[18.807vw]  right-[16.441vw]  top-0 bottom-0 my-auto absolute"></div>

        <div class="absolute top-0 right-0 flex flex-col -mt-[4.22vw]">
          <div class="bg-black h-[4.22vw] aspect-[17/8.1]"></div>
          <div class="bg-black h-[4.22vw] aspect-[17/8.1] mt-[14.7vw]"></div>
        </div>
      </div>

      <!-- <div class="absolute bottom-0 left-[6.718vw] w-[29.892vw] flex justify-between">
        <div class="w-[1.9vw] h-10 bg-gray-300"></div>
        <div class="w-[1.9vw] h-10 bg-gray-300"></div>
        <div class="w-[1.9vw] h-10 bg-gray-300"></div>
      </div> -->


    </div>
    <!-- <div class="h-fit w-full grid grid-cols-3  ">
      <a
        class="relative w-full overflow-hidden col-span-2 aspect-[2/1]"
        [routerLink]="[
          '/article',
          urlFormat(highArticle()![0].articleId!, highArticle()![0].heading),
        ]"
        (mouseover)="cellHoverCheck('main')"
        (mouseout)="cellHoverCheck('main')"
      >
        <div
          class="absolute bottom-0  w-full  text-black  flex flex-col items-center z-10"
        >
          <div class="p-8 bg-brandGrey w-full">
            <span
              class="font-semibold text-[1.85rem] leading-[2.5rem]"
              [ngClass]="mainCellHover() ? 'text-brandRed' : ''"
              >{{ highArticle()![0].heading }}</span
            >
          </div>
        </div>
        <img
          [src]="highArticle()![0].frontImage"
          [alt]="highArticle()![0].frontImageAlt"
          class="h-full object-cover"
          [ngClass]="mainCellHover() ? 'scale-105' : ''"
        />
      </a>

      <a
        class="relative w-full overflow-hidden aspect-square"
        [routerLink]="[
          '/article',
          urlFormat(
            mediumArticles()![0].articleId!,
            mediumArticles()![0].heading
          ),
        ]"
        (mouseover)="cellHoverCheck('main')"
        (mouseout)="cellHoverCheck('main')"
      >
        <div
          class="absolute bottom-0  w-full  text-black  flex flex-col items-center z-10"
        >
          <div class="p-8 bg-brandGrey w-full">
            <span
              class="font-semibold text-[1.85rem] leading-[2.5rem]"
              [ngClass]="mainCellHover() ? 'text-brandRed' : ''"
              >{{ mediumArticles()![0].heading }}</span
            >
          </div>
        </div>
        <img
          [src]="mediumArticles()![0].frontImage"
          [alt]="mediumArticles()![0].frontImageAlt"
          class="h-full object-cover"
          [ngClass]="mainCellHover() ? 'scale-105' : ''"
        />
      </a>

      <div class="w-full  col-span-2 grid grid-cols-3">
        @for (item of lowArticles(); track $index) {
          <a
            class="relative w-full overflow-hidden"
            [routerLink]="[
              '/article',
              urlFormat(
                item.articleId!,
                item.heading
              ),
            ]"
            (mouseover)="cellHoverCheck('main')"
            (mouseout)="cellHoverCheck('main')"
          >
            <div
              class="absolute bottom-0  w-full  text-black  flex flex-col items-center z-10"
            >
              <div class="p-8 bg-brandGrey w-full">
                <span
                  class="font-medium text-[1rem] "
                  [ngClass]="mainCellHover() ? 'text-brandRed' : ''"
                  >{{ item.heading }}</span
                >
              </div>
            </div>
            <img
              [src]="item.frontImage"
              [alt]="item.frontImageAlt"
              class="h-full object-cover"
              [ngClass]="mainCellHover() ? 'scale-105' : ''"
            />
          </a>
        }
      </div>

      <a
        class="relative w-full overflow-hidden aspect-square"
        [routerLink]="[
          '/article',
          urlFormat(
            mediumArticles()![1].articleId!,
            mediumArticles()![01].heading
          ),
        ]"
        (mouseover)="cellHoverCheck('main')"
        (mouseout)="cellHoverCheck('main')"
      >
        <div
          class="absolute bottom-0  w-full  text-black  flex flex-col items-center z-10"
        >
          <div class="p-8 bg-brandGrey w-full">
            <span
              class="font-semibold text-[1.85rem] leading-[2.5rem]"
              [ngClass]="mainCellHover() ? 'text-brandRed' : ''"
              >{{ mediumArticles()![1].heading }}</span
            >
          </div>
        </div>
        <img
          [src]="mediumArticles()![1].frontImage"
          [alt]="mediumArticles()![1].frontImageAlt"
          class="h-full object-cover"
          [ngClass]="mainCellHover() ? 'scale-105' : ''"
        />
      </a>


    </div>

    -->
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
