import { DatePipe, NgClass } from '@angular/common';
import { Component, input, model } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Article } from 'app/shared/interfaces/article.interface';

@Component({
  selector: 'app-topics2-grid',
  imports: [RouterLink, NgClass, DatePipe],
  template: `
    <div class="w-full h-fit grid grid-cols-1 lg:grid-cols-3 gap-x-[1rem]">

      <section class="w-full h-fit flex flex-col">
        <a [routerLink]="['/category/' + category1Url()]"
                class="text-[1.8rem] xsm:text-[2rem] sm:text-[3rem] font-bold text-brandShade self-start underline hover:text-brandViolet active:scale-95 mb-6 block w-fit">
                {{category1Name()}}
        </a>

        @for (item of category1articles(); track $index) {
          @if($index == 0){
            <a [routerLink]="['/article',urlFormat(category1articles()[$index].articleID!, category1articles()![$index].heading)]"
            (mouseover)="cellHoverCheck(category1Name())" (mouseout)="cellHoverCheck(category1Name())"
            class="flex flex-col justify-between w-full h-[20rem] xsm:h-[25rem] lg:h-[20rem] hover:bg-black hover:text-white">

              <div class="w-full h-[13rem] xsm:h-[18rem] lg:h-[13rem] overflow-hidden">
                  <img [src]="item.frontImage" [alt]="item.frontImageAlt" 
                  class="h-full w-full object-cover"
                  [ngClass]="{'scale-105': cellHover() == category1Name()}">
              </div>
              <span class="p-3 lg:pl-4 h-[7rem] w-full font-semibold lg:text-[1.2rem] text-[1rem]">{{item.heading}}</span>
              <div class="flex flex-col p-2 pr-4">
                <span class="hidden xsm:inline-block lg:hidden text-[1.1rem] italic self-end">{{item.authorName}}</span>
                <span class="hidden xsm:inline-block lg:hidden text-[1rem] italic self-end">{{item.date.toDate() | date:'MM/d/y'}}</span>
              </div>
            </a>
          } @else{
            <div class="w-[2.5rem] h-[1rem] bg-brandShade"></div>
            <a [routerLink]="['/article',urlFormat(category1articles()[$index].articleID!, category1articles()![$index].heading)]"
            class="flex flex-col justify-between w-full h-[7rem] p-2 pl-4 hover:bg-black hover:text-white">
              <span class="font-semibold xl:text-[1.2rem] lg:text-[1.1rem] text-[1rem]">{{item.heading}}</span>
            </a>
          }
        }
        <div class="w-[2.5rem] h-[1rem] bg-brandGrey self-end"></div>
      </section>
      
      
      <section class="w-full h-fit flex flex-col">
        <a [routerLink]="['/category/' + category2Url()]"
                class="text-[1.8rem] xsm:text-[2rem] sm:text-[3rem] font-bold text-brandShade self-start underline hover:text-brandViolet active:scale-95 mb-6 block w-fit">
                {{category2Name()}}
        </a>

        @for (item of category2articles(); track $index) {
          @if($index == 0){
            <a [routerLink]="['/article',urlFormat(category2articles()[$index].articleID!, category2articles()![$index].heading)]"
            (mouseover)="cellHoverCheck(category2Name())" (mouseout)="cellHoverCheck(category2Name())"
            class="flex flex-col justify-between w-full h-[20rem] xsm:h-[25rem] lg:h-[20rem] hover:bg-black hover:text-white">

              <div class="w-full h-[13rem] xsm:h-[18rem] lg:h-[13rem] overflow-hidden">
                  <img [src]="item.frontImage" [alt]="item.frontImageAlt" 
                  class="h-full w-full object-cover"
                  [ngClass]="{'scale-105': cellHover() == category2Name()}">
              </div>
              <span class="p-3 lg:pl-4 h-[7rem] w-full font-semibold lg:text-[1.2rem] text-[1rem]">{{item.heading}}</span>
              <div class="flex flex-col p-2 pr-4">
                <span class="hidden xsm:inline-block lg:hidden text-[1.1rem] italic self-end">{{item.authorName}}</span>
                <span class="hidden xsm:inline-block lg:hidden text-[1rem] italic self-end">{{item.date.toDate() | date:'MM/d/y'}}</span>
              </div>
            </a>
          } @else{
            <div class="w-[2.5rem] h-[1rem] bg-brandShade"></div>
            <a [routerLink]="['/article',urlFormat(category2articles()[$index].articleID!, category2articles()![$index].heading)]"
            class="flex flex-col justify-between w-full h-[7rem] p-2 pl-4 hover:bg-black hover:text-white">
              <span class="font-semibold xl:text-[1.2rem] lg:text-[1.1rem] text-[1rem]">{{item.heading}}</span>
            </a>
          }
        }
        <div class="w-[2.5rem] h-[1rem] bg-brandGrey self-end"></div>
      </section>
      
      
      <section class="w-full h-fit flex flex-col">
        <a [routerLink]="['/category/' + category3Url()]"
                class="text-[1.8rem] xsm:text-[2rem] sm:text-[3rem] font-bold text-brandShade self-start underline hover:text-brandViolet active:scale-95 mb-6 block w-fit">
                {{category3Name()}}
        </a>

        @for (item of category3articles(); track $index) {
          @if($index == 0){
            <a [routerLink]="['/article',urlFormat(category3articles()[$index].articleID!, category3articles()![$index].heading)]"
            (mouseover)="cellHoverCheck(category3Name())" (mouseout)="cellHoverCheck(category3Name())"
            class="flex flex-col justify-between w-full h-[20rem] xsm:h-[25rem] lg:h-[20rem] hover:bg-black hover:text-white">

              <div class="w-full h-[13rem] xsm:h-[18rem] lg:h-[13rem] overflow-hidden">
                  <img [src]="item.frontImage" [alt]="item.frontImageAlt" 
                  class="h-full w-full object-cover"
                  [ngClass]="{'scale-105': cellHover() == category3Name()}">
              </div>
              <span class="p-3 lg:pl-4 h-[7rem] w-full font-semibold lg:text-[1.2rem] text-[1rem]">{{item.heading}}</span>
              <div class="flex flex-col p-2 pr-4">
                <span class="hidden xsm:inline-block lg:hidden text-[1.1rem] italic self-end">{{item.authorName}}</span>
                <span class="hidden xsm:inline-block lg:hidden text-[1rem] italic self-end">{{item.date.toDate() | date:'MM/d/y'}}</span>
              </div>
            </a>
          } @else{
            <div class="w-[2.5rem] h-[1rem] bg-brandShade"></div>
            <a [routerLink]="['/article',urlFormat(category3articles()[$index].articleID!, category3articles()![$index].heading)]"
            class="flex flex-col justify-between w-full h-[7rem] p-2 pl-4 hover:bg-black hover:text-white">
              <span class="font-semibold xl:text-[1.2rem] lg:text-[1.1rem] text-[1rem]">{{item.heading}}</span>
            </a>
          }
        }
        <div class="w-[2.5rem] h-[1rem] bg-brandGrey self-end"></div>
      </section>
      
      

    </div>
  `,
  styles: ``
})
export class Topics2GridComponent {
  category1Name = input.required<string>()
  category1Url = input.required<string>()
  category1articles = input.required<Article[]>()
  
  category2Name = input.required<string>()
  category2Url = input.required<string>()
  category2articles = input.required<Article[]>()
  
  category3Name = input.required<string>()
  category3Url = input.required<string>()
  category3articles = input.required<Article[]>()

  cellHover = model<string>('');

  cellHoverCheck(category: string) {
    if(!this.cellHover()) this.cellHover.set(category)
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
