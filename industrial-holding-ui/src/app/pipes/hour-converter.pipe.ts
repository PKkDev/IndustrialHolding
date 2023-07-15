import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'hourConverter'
})
export class HourConverterPipe implements PipeTransform {

  transform(value: number | undefined): string {

    if (!value) return '';

    if (value < 24)
      return value + ' ч';

    const day = Math.floor(value / 24);

    return day + ' д ' + (value - day * 24) + ' ч';
  }

}
