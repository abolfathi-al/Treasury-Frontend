import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  NavigationCancel,
  NavigationEnd,
  Router,
  RouterOutlet,
} from '@angular/router';

@Component({
  selector: 'vl-content',
  templateUrl: './content.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [NgClass, RouterOutlet],
})
export class ContentComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly contentContainerCSSClass = input<string>('');
  readonly appContentContiner = input<'fixed' | 'fluid'>();
  readonly appContentContainerClass = input<string>('');
  readonly contentContainerClasses = computed(() => ({
    'container-xxl': this.appContentContiner() === 'fixed',
    'container-fluid': this.appContentContiner() === 'fluid',
  }));

  ngOnInit(): void {
    this.routingChanges();
  }

  private routingChanges(): void {
    this.router.events
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        if (
          event instanceof NavigationEnd ||
          event instanceof NavigationCancel
        ) {
          // Routing change handled
        }
      });
  }
}
