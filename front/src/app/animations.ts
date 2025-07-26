import { trigger, transition, style, animate } from '@angular/animations';

export const fadeAnimation = trigger('fadeAnimation', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('300ms ease-in', style({ opacity: 1 })),
  ]),
  transition(':leave', [
    animate('300ms ease-out', style({ opacity: 0 })),
  ]),
]);

export const slideAnimation = trigger('slideAnimation', [
  transition(':enter', [
    style({ transform: 'translateY(20px)', opacity: 0 }),
    animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('300ms ease-in', style({ transform: 'translateY(20px)', opacity: 0 })),
  ]),
]);

export const listAnimation = trigger('listAnimation', [
  transition(':enter', [
    style({ height: 0, opacity: 0 }),
    animate('200ms ease-out', style({ height: '*', opacity: 1 })),
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ height: 0, opacity: 0 })),
  ]),
]);
