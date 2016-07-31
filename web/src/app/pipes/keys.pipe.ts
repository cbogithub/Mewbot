import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'keys'})
export class KeysPipe implements PipeTransform {
  transform(value, args:string[]) : any {
    let keys = [];
    let v = Object.keys(value);

    for (let key in value) {
      keys.push({key: key, value: value[key]});
    }

    return keys;
  }
}
