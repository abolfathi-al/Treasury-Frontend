import { NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  signal,
  ViewEncapsulation,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'vl-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'd-flex flex-column',
  },
  imports: [NgTemplateOutlet, RouterLink, TranslatePipe],
})
export class FooterComponent {
  readonly appFooterContainerCSSClass = input<string>('');
  readonly currentYear = signal(new Date().getFullYear());
}
