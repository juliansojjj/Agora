import { Component, Input, input, model } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'pass-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div>
      <input [type]="visibility() "  [formControl]="control()" > 
      <button (click)="triggerPassVisibility()" type="button">OJO</button>
    </div>
  `,
  styles: ``
})
export class PassInputComponent {
  visibility = model<'text'|'password'>('password')
  control  = input(new FormControl()) //valor inicial vacio
  // @Input() control: FormControl = new FormControl()

  triggerPassVisibility(){
    if(this.visibility() === 'text') this.visibility.set('password')
      else this.visibility.set('text')
  }
}
