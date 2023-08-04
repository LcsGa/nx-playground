import { Directive, EventEmitter, Input, Output, booleanAttribute, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { filter, fromEvent, ignoreElements, switchMap, tap } from 'rxjs';

type ShortcutEventType = 'keyup' | 'keydown' | 'keypress';

@Directive({ standalone: true, selector: '[shortcut]' })
export class ShortcutDirective {
  @Output()
  private readonly action = new EventEmitter<void>();

  readonly #$shortcut = signal<null | string>(null);

  @Input()
  set shortcut(shortcut: string) {
    this.#$shortcut.set(shortcut);
  }

  get shortcut(): string {
    return [
      this.shift ? 'shift' : null,
      this.ctrl ? 'ctrl' : null,
      this.meta ? 'meta' : null,
      this.alt ? 'alt' : null,
      this.#$shortcut(),
    ]
      .filter(Boolean)
      .join(' + ')
      .toUpperCase();
  }

  @Input() eventType: ShortcutEventType = 'keydown';

  @Input({ transform: booleanAttribute }) disabled = false;

  @Input({ transform: booleanAttribute }) shift = false;
  @Input({ transform: booleanAttribute }) ctrl = false;
  @Input({ transform: booleanAttribute }) meta = false;
  @Input({ transform: booleanAttribute }) alt = false;

  private readonly onShortcut$ = toObservable(this.#$shortcut).pipe(
    filter((shortcut): shortcut is string => shortcut !== null),
    switchMap((shortcut) =>
      fromEvent<KeyboardEvent>(window, this.eventType).pipe(
        filter(
          ({ key, shiftKey, ctrlKey, metaKey, altKey }) =>
            RegExp(shortcut, 'i').test(key) &&
            shiftKey === this.shift &&
            ctrlKey === this.ctrl &&
            metaKey === this.meta &&
            altKey === this.alt &&
            !this.disabled
        ),
        tap((ev) => {
          ev.preventDefault();
          this.action.emit();
        })
      )
    ),
    ignoreElements()
  );

  constructor() {
    this.onShortcut$.pipe(takeUntilDestroyed()).subscribe();
  }
}
