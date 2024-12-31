import { Directive, ElementRef, HostListener, inject, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTextAreaResize]',
  standalone: true,
  exportAs: 'appTextAreaResize'
})
export class TextAreaResizeDirective implements OnInit{
  elementRef = inject(ElementRef)
  renderer = inject(Renderer2)
 
  @HostListener(':input')
  onInput() {
    this.resize();
  }

  constructor() {
   }

   ngOnInit() {
    if (this.elementRef.nativeElement.scrollHeight) {
      this.resize()
    }
  }

  resize(){
    this.renderer.setStyle(this.elementRef.nativeElement,'height','0')
    this.renderer.setStyle(this.elementRef.nativeElement,'height',this.elementRef.nativeElement.scrollHeight+'px')
  }

  resetHeight() {
    this.renderer.setStyle(this.elementRef.nativeElement, 'height', 'auto');
  }
}
