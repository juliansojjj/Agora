import { Component, Input, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pass-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
  <div class="relative flex flex-col-reverse w-fit">
    <input [type]="visibility()"  [formControl]="control()" id="pass" 
    class="peer sm:w-[20rem] w-[12rem] h-[2.5rem] sm:border-[.5rem] border-[.4rem] border-brandShade box-content px-2 focus:outline-none focus:border-brandViolet text-[1.1rem]"> 
    <label class="sm:text-[1.8rem] text-[1.5rem] font-semibold mb-4 text-brandShade peer-focus:text-brandViolet" for="pass">Password</label> 

      @if(visibility() == 'password'){
        <svg viewBox="0 0 90 90" (click)="triggerPassVisibility()"
        class="absolute bottom-0 right-0 sm:h-[3rem] h-[2.5rem] mb-[.3rem] sm:-mr-[3.5rem] -mr-[2.7rem] 
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
        class="absolute bottom-0 right-0 sm:h-[3rem] h-[2.5rem] mb-[.3rem] sm:-mr-[3.5rem] -mr-[2.7rem] 
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

  triggerPassVisibility(){
    if(this.visibility() === 'text') this.visibility.set('password')
      else this.visibility.set('text')
  }
}
