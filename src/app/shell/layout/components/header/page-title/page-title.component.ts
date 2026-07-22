import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';

import {
  PageInfoService,
  PageLink,
} from '@core/services/page-info.service';

@Component({
  selector: 'vl-page-title',
  templateUrl: './page-title.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, RouterLink],
})
export class PageTitleComponent implements OnInit {
  private readonly pageInfo = inject(PageInfoService);
  private readonly destroyRef = inject(DestroyRef);

  private readonly _title = signal<string>('');
  private readonly _description = signal<string>('');
  private readonly _breadcrumbs = signal<PageLink[]>([]);

  readonly title = computed(() => this._title());
  readonly description = computed(() => this._description());
  readonly breadcrumbs = computed(() => this._breadcrumbs());

  readonly appPageTitleDirection = input<string>('');
  readonly appPageTitleBreadcrumb = input<boolean>(false);
  readonly appPageTitleDescription = input<boolean>(false);
  readonly titleClasses = computed(() => ({
    'flex-column justify-content-center': Boolean(
      this.appPageTitleDirection()
    ),
    'align-items-center': !this.appPageTitleDirection(),
  }));
  readonly descriptionClasses = computed(() => ({
    'pt-2': this.appPageTitleDirection() === 'column',
  }));
  readonly breadcrumbListClasses = computed(() => ({
    'pt-1': this.appPageTitleDirection() === 'column',
  }));

  ngOnInit(): void {
    this.pageInfo.init();

    this.pageInfo.titleSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((title) => {
        this._title.set(title);
      });

    this.pageInfo.descriptionSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((description) => {
        this._description.set(description);
      });

    this.pageInfo.breadcrumbsSubject
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((breadcrumbs) => {
        this._breadcrumbs.set(breadcrumbs);
      });
  }
}
