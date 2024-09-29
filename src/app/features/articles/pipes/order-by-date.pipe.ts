import { Pipe, PipeTransform } from '@angular/core';
import { Comment } from '../../../shared/interfaces/comment.interface';

@Pipe({
  name: 'orderByDate',
  standalone: true
})
export class OrderByDatePipe implements PipeTransform {

  transform(value: Comment[], ...args: unknown[]): Comment[] {
    if (!value) {
      return []; 
    }

    return value.sort((a,b)=>{
      const aDate = new Date((a.date.seconds + a.date.nanoseconds/1000000000)*1000)
      const bDate = new Date((b.date.seconds + b.date.nanoseconds/1000000000)*1000)

      return bDate.getTime() - aDate.getTime() 
    }) 

  }

}
