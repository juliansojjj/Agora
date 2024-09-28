import { Pipe, PipeTransform } from '@angular/core';
import { Timestamp } from '@angular/fire/firestore';

@Pipe({
  name: 'timestampConvert',
  standalone: true
})
export class TimestampConvertPipe implements PipeTransform {

  transform(value: Timestamp, ...args: unknown[]): unknown {
    const ts = (value.seconds+value.nanoseconds/1000000000)*1000

    return new Date(ts).toLocaleDateString();
  }

}
