import { Pipe, PipeTransform } from '@angular/core';
import { contentItems } from '../../../shared/interfaces/article.interface';

@Pipe({
  name: 'typeof',
  standalone: true
})
export class TypeofPipe implements PipeTransform {

  transform(value: contentItems, ...args: unknown[]): unknown {
    if('paragraph' in value) return 'paragraph'
    if('quote' in value) return 'quote'
    if('imageUrl' in value) return 'image'
    if('title' in value) return 'title'
    if('subtitle' in value) return 'subtitle'
    return false
  }

}
