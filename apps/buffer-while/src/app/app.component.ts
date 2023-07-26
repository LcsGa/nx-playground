import { AsyncPipe, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { map, of, toArray } from 'rxjs';
import { bufferWhile } from './buffer-while.operator';

/** Saut de page */
const FORM_FEED = '^L';

@Component({
  standalone: true,
  imports: [AsyncPipe, NgFor],
  selector: 'nx-playground-root',
  template: `
    <div class="page" *ngFor="let paragraphs of content$ | async">
      <p *ngFor="let paragraph of paragraphs">{{ paragraph }}</p>
    </div>
  `,
  styles: [
    ':host { @apply flex flex-col items-center gap-y-4 p-4 bg-slate-100 }',
    '.page { @apply flex flex-col gap-y-2 w-96 aspect-[21/30] px-8 py-4 bg-white text-xs shadow-md }',
  ],
})
export class AppComponent {
  content$ = of(
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce vitae diam nibh. Vestibulum lacinia dui vel magna imperdiet, malesuada tempor mi ullamcorper. Curabitur ac posuere massa, quis auctor orci. Aliquam erat risus, volutpat id euismod cursus, maximus sed augue. Duis imperdiet placerat mollis. Vivamus non aliquam quam, eu tincidunt ipsum. Donec accumsan ligula non massa auctor porttitor. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin neque augue, placerat vestibulum tempor varius, dictum vitae tellus. Phasellus pellentesque bibendum nunc, sit amet semper leo viverra a. Quisque auctor cursus neque, eget ullamcorper mi tempor eu. Morbi pellentesque pretium rhoncus. Mauris maximus ipsum nec arcu egestas ullamcorper. Nullam non nisl varius, pharetra leo a, vehicula augue. Nam nec eleifend lectus.',
    FORM_FEED,
    'Morbi sit amet volutpat mauris, vitae pretium ligula. Aenean feugiat felis vel est sodales rhoncus lacinia quis tortor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Quisque ligula tellus, hendrerit eget arcu malesuada, vehicula lacinia odio. Proin eu quam auctor, sollicitudin enim in, varius dolor. Donec porta metus in viverra faucibus. Morbi eu sem vel orci lobortis porttitor sit amet sit amet massa. Sed eget placerat mi. Sed tincidunt libero ut diam sodales pretium. Proin nec justo viverra, rhoncus velit malesuada, eleifend lectus. Donec eget massa cursus, consequat nibh quis, facilisis ipsum. Nam sollicitudin tortor non lacus euismod, semper luctus nisl lacinia.',
    FORM_FEED,
    'Cras accumsan non diam a tincidunt. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Morbi pretium odio ante, laoreet pellentesque neque ornare sit amet. Aenean non nulla posuere, auctor eros ac, eleifend arcu. Duis et tortor ornare, porta massa vel, faucibus metus. Sed vel aliquam lorem, eget ultricies sapien. In hac habitasse platea dictumst. Nunc vel purus vel nisi hendrerit aliquam. Vestibulum iaculis orci et mollis fringilla. Suspendisse et lectus dictum mauris porttitor pharetra. Sed pulvinar ultrices ex non fringilla'
  ).pipe(
    bufferWhile((v) => v !== FORM_FEED),
    map((lines) => lines.filter((v) => v !== FORM_FEED)),
    toArray()
  );
}
