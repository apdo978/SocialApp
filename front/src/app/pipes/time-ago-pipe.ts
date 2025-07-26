import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo'
})
export class TimeAgoPipe implements PipeTransform {

     transform(value: string | Date): string {
    const now = new Date();
    const then = new Date(value);

    const diffInMs = now.getTime() - then.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);

    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });

    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return rtf.format(-diffInMinutes, 'minute');

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return rtf.format(-diffInHours, 'hour');

    const diffInDays = Math.floor(diffInHours / 24);
    return rtf.format(-diffInDays, 'day');
  }
  

}
