import { Component } from '@angular/core';
import { ButtonComponent } from '@lcsga/components';

@Component({
  standalone: true,
  imports: [ButtonComponent],
  selector: 'nx-playground-root',
  template: `
    <pg-button ctrl shortcut="h" (action)="sayHello()">Say "Hello!"</pg-button>

    <pg-button shift meta alt shortcut="g" (action)="sayGoodbye()">Say "Good bye!"</pg-button>

    <pg-button shortcut="n" (action)="saySomething()">Say "Something"</pg-button>

    <pg-button (click)="sayNothing()">Say "Nothing"</pg-button>
  `,
  styles: [':host { @apply flex gap-x-4 p-4 }'],
})
export class AppComponent {
  protected sayHello(): void {
    alert('Hello!');
  }

  protected sayGoodbye(): void {
    alert('Good bye!');
  }

  protected saySomething(): void {
    alert('Something');
  }

  protected sayNothing(): void {
    alert('Nothing');
  }
}
