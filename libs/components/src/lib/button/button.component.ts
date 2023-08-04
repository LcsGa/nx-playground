/* eslint-disable @angular-eslint/no-outputs-metadata-property */
import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ShortcutDirective } from '@lcsga/common';

@Component({
  standalone: true,
  imports: [NgIf],
  selector: 'pg-button',
  template: `
    <ng-content />

    <span *ngIf="shortcut" class="text-blue-300 text-xs font-bold">{{ shortcut }}</span>
  `,
  styles: [
    ':host { @apply inline-flex items-center gap-x-4 py-2 px-4 rounded-md bg-blue-500 text-slate-50 hover:bg-blue-700 transition-colors cursor-pointer }',
  ],
  hostDirectives: [
    {
      directive: ShortcutDirective,
      inputs: ['shortcut', 'eventType', 'disabled', 'shift', 'ctrl', 'meta', 'alt', 'handleClick'],
      outputs: ['action'],
    },
  ],
})
export class ButtonComponent {
  protected readonly shortcut = inject(ShortcutDirective).shortcut;
}
