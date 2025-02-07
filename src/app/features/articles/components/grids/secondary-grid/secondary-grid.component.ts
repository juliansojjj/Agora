import { Component, input, model } from '@angular/core';
import { Article } from '../../../../../shared/interfaces/article.interface';
import { RouterLink } from '@angular/router';
import { DatePipe, NgClass } from '@angular/common';

@Component({
    selector: 'app-secondary-grid',
    imports: [RouterLink, NgClass, DatePipe],
    template: `
  @if(articles()){
    <div class="w-full h-fit relative">
      <div class="grid w-full h-fit gap 
      xl:grid-cols-[55%_5%_40%] 
      lg:gap-y-0
      sm:grid-cols-[50%_5%_45%] 
      grid-cols-1 gap-y-[2rem]">

        <div class="col-span-2 lg:block hidden"></div>
        <div class="h-[3.5rem] lg:block hidden bg-brandShade 2xl:w-[35%] w-1/2 place-self-end"></div>

        <!-- -------------------------------------------- -->

        <a [routerLink]="['/article',urlFormat(articles()![0].articleID!, articles()![0].heading)]"
        (mouseover)="cellHoverCheck(0)" (mouseout)="cellHoverCheck(0)"
        class="h-[20rem] relative 
        xl:grid-cols-[35%_65%] 
        lg:grid-cols-[50%_50%] lg:grid 
        flex flex-col-reverse" >
            <div class="flex flex-col justify-between w-full lg:h-full sm:h-[10rem] xsm:h-[8rem] h-[11rem] p-3 " [ngClass]="cellHover() == '0' ? 'text-white bg-black' : 'bg-white'"> 
              <span class="font-medium lg:text-[1.4rem] md:text-[1.3rem] text-[1.2rem]">{{articles()![0].heading}}</span>
              <div class="flex flex-col">
                <span class="hidden xl:inline-block text-[1.1rem] italic self-end">{{articles()![0].authorName}}</span>
                <span class="hidden xl:inline-block text-[1rem] italic self-end">{{articles()![0].date.toDate() | date:'MM/d/y'}}</span>
              </div>
            </div>
            <div class="w-full lg:h-full sm:h-[10rem] xsm:h-[12rem] h-[9rem] bg-black overflow-hidden">   
              <img [src]="articles()![0].frontImage" [alt]="articles()![0].frontImageAlt" class="h-full w-full object-cover " [ngClass]="cellHover() == '0' ? 'scale-105' : ''">
            </div>

            <div class="absolute hidden lg:grid grid-cols-[3.5rem_3.5rem_3.5rem] grid-rows-[3.5rem_3.5rem] -ml-[10.5rem] -z-20">
              <div class="bg-brandShade h-[3.5rem] col-span-2 w-full"></div>
              <div></div>
              <div class="col-span-2"></div>
              <div class="bg-brandShade h-[3.5rem] aspect-square"></div>
            </div>
          </a>

        <div class="sm:block hidden"></div>

        <a [routerLink]="['/article',urlFormat(articles()![1].articleID!, articles()![1].heading)]"
          (mouseover)="cellHoverCheck(1)" (mouseout)="cellHoverCheck(1)"
        class="h-[20rem] 
        2xl:grid-cols-[65%_35%] 
        lg:grid-cols-[50%_50%] lg:grid 
        flex flex-col" >
          <div class="w-full lg:h-full sm:h-[10rem] xsm:h-[12rem] h-[9rem] bg-black overflow-hidden">   
              <img [src]="articles()![1].frontImage" [alt]="articles()![1].frontImageAlt" class="h-full w-full object-cover " [ngClass]="cellHover() == '1' ? 'scale-105' : ''">
            </div>
            <div class="flex flex-col justify-between w-full lg:h-full sm:h-[10rem] xsm:h-[8rem] h-[11rem] p-3 " [ngClass]="cellHover() == '1' ? 'text-white bg-black' : 'bg-white'"> 
              <span class="font-medium lg:text-[1.4rem] md:text-[1.3rem] text-[1.2rem]">{{articles()![1].heading}}</span>
              <div class="flex flex-col">
                <span class="hidden xl:inline-block text-[1.1rem] italic self-end">{{articles()![1].authorName}}</span>
                <span class="hidden xl:inline-block text-[1rem] italic self-end">{{articles()![1].date.toDate() | date:'MM/d/y'}}</span>
              </div>
            </div>
          </a>

        <!-- -------------------------------------------- -->
        <div class=" lg:block hidden"></div>
        <div class="lg:block hidden relative w-full -z-20">
          <div class="absolute w-[16rem] h-[16rem]  top-0 bottom-0 my-auto bg-brandShade -ml-[6rem]"></div>
        </div>
        <div class="h-[3.5rem] lg:block hidden bg-brandShade 2xl:w-[35%] w-1/2 place-self-end"></div>

        <!-- -------------------------------------------- -->

        <div class="w-full h-[20rem] flex md:flex-row flex-col items-end relative">
          @for (item of articles().slice(2,5); track $index) {
            @if($index == 0){
              <div class="absolute h-[5.5rem] w-[3.5rem] bg-brandShade lg:block hidden bottom-0 left-0 -ml-[3.5rem]"></div>
              <a [routerLink]="['/article',urlFormat(articles()![$index+2].articleID!, articles()![$index+2].heading)]"
              (mouseover)="cellHoverCheck($index+2)" (mouseout)="cellHoverCheck($index+2)"
              class="flex flex-col justify-between w-full h-full bg-white hover:bg-brandGrey p-2 sm:p-3 sm:border-0 border-t-2 border-black">
                <span class="font-medium lg:text-[1.2rem] text-[1rem]">{{item.heading}}</span>
                <div class="flex flex-col">
                  <span class="hidden xl:inline-block text-[1.1rem] italic self-end">{{item.authorName}}</span>
                  <span class="hidden xl:inline-block text-[1rem] italic self-end">{{item.date.toDate() | date:'MM/d/y'}}</span>
                </div>
              </a>
            }@else {
              <div class="h-[5.5rem] w-[12rem] bg-brandShade lg:block hidden"></div>
              <a [routerLink]="['/article',urlFormat(articles()![$index+2].articleID!, articles()![$index+2].heading)]"
              (mouseover)="cellHoverCheck($index+2)" (mouseout)="cellHoverCheck($index+2)"
              [ngClass]="$index == 1 ? 'bg-white  hover:bg-brandGrey sm:bg-brandGrey sm:border-white sm:border-t-4 sm:border-b-4 md:border-t-0 md:border-b-0 md:border-r-4 md:border-l-4 lg:border-r-0 lg:border-l-0 sm:hover:bg-white lg:bg-white lg:hover:bg-brandGrey': 'bg-white  hover:bg-brandGrey'"
              class="flex flex-col justify-between w-full h-full p-2 sm:p-3 sm:border-0 border-t-2 border-black">
                <span class="font-medium lg:text-[1.2rem] text-[1rem]">{{item.heading}}</span>
                <div class="flex flex-col">
                  <span class="hidden xl:inline-block text-[1.1rem] italic self-end">{{item.authorName}}</span>
                  <span class="hidden xl:inline-block text-[1rem] italic self-end">{{item.date.toDate() | date:'MM/d/y'}}</span>
                </div>
              </a>
            }
          }
        </div>

        <div class="sm:block hidden"></div>

        <a [routerLink]="['/article',urlFormat(articles()![5].articleID!, articles()![5].heading)]"
          (mouseover)="cellHoverCheck(5)" (mouseout)="cellHoverCheck(5)"
          class="h-[20rem] 
          2xl:grid-cols-[65%_35%] 
          lg:grid-cols-[50%_50%] lg:grid 
          flex flex-col" >
          <div class="w-full lg:h-full sm:h-[10rem] xsm:h-[12rem] h-[9rem] bg-black overflow-hidden">   
              <img [src]="articles()![5].frontImage" [alt]="articles()![5].frontImageAlt" class="h-full w-full object-cover " [ngClass]="cellHover() == '5' ? 'scale-105' : ''">
            </div>
            <div class="flex flex-col justify-between w-full lg:h-full sm:h-[10rem] xsm:h-[8rem] h-[11rem] p-3 " [ngClass]="cellHover() == '5' ? 'text-white bg-black' : 'bg-white'"> 
              <span class="font-medium lg:text-[1.4rem] md:text-[1.3rem] text-[1.2rem]">{{articles()![5].heading}}</span>
              <div class="flex flex-col">
                <span class="hidden xl:inline-block text-[1.1rem] italic self-end">{{articles()![5].authorName}}</span>
                <span class="hidden xl:inline-block text-[1rem] italic self-end">{{articles()![5].date.toDate() | date:'MM/d/y'}}</span>
              </div>
            </div>
          </a>

          <a [routerLink]="['/article',urlFormat(articles()![6].articleID!, articles()![6].heading)]"
          (mouseover)="cellHoverCheck(6)" (mouseout)="cellHoverCheck(6)"
          class="h-[20rem] 
          sm:hidden
          flex flex-col" >
          <div class="w-full lg:h-full sm:h-[10rem] xsm:h-[12rem] h-[9rem] bg-black overflow-hidden">   
              <img [src]="articles()![6].frontImage" [alt]="articles()![6].frontImageAlt" class="h-full w-full object-cover " [ngClass]="cellHover() == '6' ? 'scale-105' : ''">
            </div>
            <div class="flex flex-col justify-between w-full lg:h-full sm:h-[10rem] xsm:h-[8rem] h-[11rem] p-3 " [ngClass]="cellHover() == '6' ? 'text-white bg-black' : 'bg-white'"> 
              <span class="font-medium lg:text-[1.4rem] md:text-[1.3rem] text-[1.2rem]">{{articles()![6].heading}}</span>
              <div class="flex flex-col">
                <span class="hidden xl:inline-block text-[1.1rem] italic self-end">{{articles()![6].authorName}}</span>
                <span class="hidden xl:inline-block text-[1rem] italic self-end">{{articles()![6].date.toDate() | date:'MM/d/y'}}</span>
              </div>
            </div>
          </a>

      </div>
    </div>
  }
  `,
    styles: ``
})
export class SecondaryGridComponent {
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
