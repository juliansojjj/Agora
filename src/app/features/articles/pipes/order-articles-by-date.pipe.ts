import { Pipe, PipeTransform } from '@angular/core';
import { Comment } from '../../../shared/interfaces/comment.interface';
import { Article } from '../../../shared/interfaces/article.interface';

@Pipe({
  name: 'orderArticlesByDate',
  standalone: true
})
export class OrderArticlesByDatePipe implements PipeTransform {

  transform(value: Article[], ...args: unknown[]): Article[] {
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
