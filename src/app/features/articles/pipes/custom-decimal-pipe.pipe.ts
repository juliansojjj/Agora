import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDecimalPipe',
  standalone: true
})
export class CustomDecimalPipePipe implements PipeTransform {

  transform(value: number, ...args: unknown[]): unknown {
    const roundNumber = Math.round(value)


    return roundNumber;
  }

}
