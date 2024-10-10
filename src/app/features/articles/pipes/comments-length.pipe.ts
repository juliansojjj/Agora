import { Pipe, PipeTransform } from '@angular/core';
import { Comment } from '../../../shared/interfaces/comment.interface';

@Pipe({
  name: 'commentsLength',
  standalone: true
})
export class CommentsLengthPipe implements PipeTransform {

  transform(value: Comment[], ...args: unknown[]): number|string {
    const filteredComments = value.filter(item=>!item.deletedByUser)

    return filteredComments.length > 0 ? filteredComments.length : ''
  }

}
