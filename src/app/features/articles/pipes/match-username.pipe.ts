import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'matchUsername'
})
export class MatchUsernamePipe implements PipeTransform {

  transform(value: {username:string,uid:string}[], arg1: string): string {
    const usernameIndex = value.findIndex(obj=>obj.uid == arg1)

    return value[usernameIndex] 
    ? `<span>${value[usernameIndex].username}</span>` 
    : '<span class="italic text-slate-500 text-[1rem]">deleted user</span>'
  }

}
