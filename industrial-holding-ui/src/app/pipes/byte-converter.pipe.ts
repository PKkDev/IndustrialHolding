import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'byteConverter'
})
export class ByteConverterPipe implements PipeTransform {

  private units: string[] = ['Байт', 'КБ', 'МБ', 'ГБ', 'ТБ', 'ПБ'];

  transform(value: number): string {

    let l = 0;
    let n = value || 0;

    while (n >= 1024 && ++l) {
      n = n / 1024;
    }

    return (n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + this.units[l]);
  }

}
