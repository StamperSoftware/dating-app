import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'age'
})
export class AgePipe implements PipeTransform {

  transform(value: string): number {
    const today = new Date();
    const dateOfBirth = new Date(value);
    const monthDiff = today.getMonth() - dateOfBirth.getMonth();
    const dayDiff = today.getDate() - dateOfBirth.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      return today.getFullYear()-dateOfBirth.getFullYear()-1;
    }
    return today.getFullYear()-dateOfBirth.getFullYear();
  }

}
