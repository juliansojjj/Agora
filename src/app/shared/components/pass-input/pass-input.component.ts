import { NgClass } from '@angular/common';
import { Component, Input, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'pass-input',
    imports: [ReactiveFormsModule, NgClass],
    template: `
  <div class="relative flex flex-col-reverse w-fit">
    <input [type]="visibility()"  [formControl]="control()" id="pass"
    [ngClass]="inputErrors() && dirtyInput() ? 'border-brandRed' : 'border-brandShade'"
    class="peer sm:w-[20rem] xsm:w-[17rem] xxsm:w-[15rem] w-[12rem] sm:h-[2.15rem] h-[1.8rem] sm:border-[.4rem] border-[.35rem]  box-content px-2 focus:outline-none focus:border-brandViolet xsm:text-[1.1rem] text-[1rem]"> 
    
    <label [ngClass]="inputErrors() && dirtyInput() ? 'text-brandRed' : 'text-brandShade'"
    class="sm:text-[1.7rem] text-[1.3rem] font-medium  mb-2 text-brandShade peer-focus:text-brandViolet" for="pass">
      Password
    </label> 

      @if(visibility() == 'password'){
        <svg viewBox="0 0 90 90" (click)="triggerPassVisibility()"
        class="absolute bottom-0 right-0 sm:h-[3rem] xsm:h-[2.5rem] h-[2rem] sm:mb-[.09rem] mb-[.3rem] sm:-mr-[3.7rem] xsm:-mr-[3rem] -mr-[2.4rem] 
        hover:cursor-pointer active:scale-95
        peer-focus:fill-brandViolet fill-brandShade stroke-brandShade peer-focus:stroke-brandViolet">
            <rect x="62.3164" y="53.5674" width="12.5595" height="12.5595" transform="rotate(45 62.3164 53.5674)"/>
            <rect x="62.6094" y="18.0586" width="12.5595" height="12.5595" transform="rotate(45 62.6094 18.0586)"/>
            <rect x="26.9414" y="53.7285" width="12.5595" height="12.5595" transform="rotate(45 26.9414 53.7285)"/>
            <rect x="26.4883" y="18.0625" width="12.5595" height="12.5595" transform="rotate(45 26.4883 18.0625)"/>
            <rect x="44.5469" y="32.5875" width="17.5595" height="17.5595" transform="rotate(45 44.5469 32.5875)" fill="none" stroke-width="5"/>
            <rect x="79.7891" y="35.4717" width="12.5595" height="12.5595" transform="rotate(45 79.7891 35.4717)"/>
            <rect x="9.07812" y="35.4717" width="12.5595" height="12.5595" transform="rotate(45 9.07812 35.4717)"/>
        </svg>

      }@else{
        <svg viewBox="0 0 90 90" (click)="triggerPassVisibility()"
        class="absolute bottom-0 right-0 sm:h-[3rem] xsm:h-[2.5rem] h-[2rem] sm:mb-[.09rem] mb-[.3rem] sm:-mr-[3.7rem] xsm:-mr-[3rem] -mr-[2.4rem] 
        hover:cursor-pointer active:scale-95
        peer-focus:fill-brandViolet fill-brandShade stroke-brandShade peer-focus:stroke-brandViolet">
          <rect x="62.3164" y="53.5674" width="12.5595" height="12.5595" transform="rotate(45 62.3164 53.5674)" fill="none" stroke-width="4"/>
          <rect x="62.6094" y="18.0586" width="12.5595" height="12.5595" transform="rotate(45 62.6094 18.0586)" fill="none" stroke-width="4"/>
          <rect x="26.9414" y="53.7285" width="12.5595" height="12.5595" transform="rotate(45 26.9414 53.7285)" fill="none" stroke-width="4"/>
          <rect x="26.4883" y="18.0625" width="12.5595" height="12.5595" transform="rotate(45 26.4883 18.0625)" fill="none" stroke-width="4"/>
          <rect x="44.5469" y="32.5875" width="17.5595" height="17.5595" transform="rotate(45 44.5469 32.5875)" stroke-width="5"/>
        </svg>

      }
  </div>
  `,
    styles: ``
})
export class PassInputComponent {
  visibility = model<'text'|'password'>('password')
  control  = input(new FormControl())
  inputErrors = input()
  dirtyInput = input()

  triggerPassVisibility(){
    if(this.visibility() === 'text') this.visibility.set('password')
      else this.visibility.set('text')
  }
}
