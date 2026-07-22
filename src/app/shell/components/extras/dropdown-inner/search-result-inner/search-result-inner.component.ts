import { NgClass, NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  NgZone,
  OnDestroy,
  OnInit,
  inject,
  input,
  signal,
} from '@angular/core';
import {
  outputToObservable,
  takeUntilDestroyed,
} from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { SearchDirective } from '@shared/directives/search.directive';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';

type Modes =
  | 'velora-search-search'
  | 'velora-search-search-main'
  | 'velora-search-search-result'
  | 'velora-search-search-empty'
  | 'velora-search-preference'
  | 'velora-search-advanced';

const SEARCH_RESULT_INNER_CONSTANTS = {
  MENU_CLASS: 'menu menu-sub menu-sub-dropdown p-7 w-325px w-md-375px',
  DEFAULT_MODE: 'velora-search-search-main' as Modes,
  SEARCH_DELAY: 100,
  CSS_CLASSES: {
    DISPLAY_BLOCK: 'd-block',
    DISPLAY_NONE: 'd-none',
  },
} as const;

@Component({
  selector: 'vl-search-result-inner',
  templateUrl: './search-result-inner.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    NgClass,
    NgOptimizedImage,
    RouterLink,
    TranslateModule,
    InlineSVGModule,
    NgbTooltipModule,
    VeloraIconComponent,
  ],
  host: {
    class: SEARCH_RESULT_INNER_CONSTANTS.MENU_CLASS,
  },
})
export class SearchResultInnerComponent implements OnInit, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly ngZone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  readonly searchDirective = input<SearchDirective>();

  readonly activeMode = signal<Modes>(
    SEARCH_RESULT_INNER_CONSTANTS.DEFAULT_MODE
  );
  readonly recentlySearched = signal<ResultModel[]>(recentlySearchedModels);
  readonly results = signal<ResultModel[]>([]);

  private searchTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    const searchInstance = this.searchDirective();

    if (searchInstance) {
      outputToObservable(searchInstance.searchFilterEvent)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(this.handleProcesss.bind(this));
      outputToObservable(searchInstance.searchClear)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(this.handleClear.bind(this));
    }
  }

  ngOnDestroy(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
  }

  setMode(mode: Modes): void {
    this.activeMode.set(mode);
  }

  activeClass(mode: Modes): string {
    return this.activeMode().includes(mode)
      ? SEARCH_RESULT_INNER_CONSTANTS.CSS_CLASSES.DISPLAY_BLOCK
      : SEARCH_RESULT_INNER_CONSTANTS.CSS_CLASSES.DISPLAY_NONE;
  }

  handleProcesss(query: string): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    this.ngZone.runOutsideAngular(() => {
      this.searchTimeout = setTimeout(() => {
        const searchTerm = query.toLowerCase().trim();

        if (!searchTerm) {
          this.activeMode.set(SEARCH_RESULT_INNER_CONSTANTS.DEFAULT_MODE);
          this.results.set([]);
          this.cdr.markForCheck();
          return;
        }

        const filteredResults = resultModels.filter((result) => {
          return (
            result.title.toLowerCase().includes(searchTerm) ||
            result.description.toLowerCase().includes(searchTerm)
          );
        });

        this.results.set(filteredResults);
        this.activeMode.set(
          filteredResults.length > 0
            ? 'velora-search-search-result'
            : 'velora-search-search-empty'
        );
        this.cdr.markForCheck();

        const directive = this.searchDirective();
        if (directive) {
          directive.setSpinnerVisible(false);
        }
      }, SEARCH_RESULT_INNER_CONSTANTS.SEARCH_DELAY);
    });
  }

  handleClear(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }
    this.activeMode.set(SEARCH_RESULT_INNER_CONSTANTS.DEFAULT_MODE);
    this.results.set([]);
    this.cdr.markForCheck();

    const directive = this.searchDirective();
    if (directive) {
      directive.setSpinnerVisible(false);
    }
  }

  handlePreferenceSearch() {}

  handleAdvancedOptionsSearch() {}
}

interface ResultModel {
  icon?: string;
  image?: string;
  title: string;
  description: string;
}

const resultModels: Array<ResultModel> = [
  {
    image: './assets/media/avatars/40/40-6.webp',
    title: 'Karina Clark',
    description: 'Marketing Manager',
  },
  {
    image: './assets/media/avatars/40/40-2.webp',
    title: 'Olivia Bold',
    description: 'Software Engineer',
  },
  {
    image: './assets/media/avatars/40/40-9.webp',
    title: 'Ana Clark',
    description: 'UI/UX Designer',
  },
  {
    image: './assets/media/avatars/40/40-14.webp',
    title: 'Nick Pitola',
    description: 'Art Director',
  },
  {
    image: './assets/media/avatars/40/40-11.webp',
    title: 'Edward Kulnic',
    description: 'System Administrator',
  },
];

const recentlySearchedModels: Array<ResultModel> = [
  {
    icon: './assets/media/icons/duotune/electronics/elc004.svg',
    title: 'BoomApp by Velora',
    description: '#45789',
  },
  {
    icon: './assets/media/icons/duotune/graphs/gra001.svg',
    title: '"Kept API Project Meeting',
    description: '#84050',
  },
  {
    icon: './assets/media/icons/duotune/graphs/gra006.svg',
    title: '"KPI Monitoring App Launch',
    description: '#84250',
  },
  {
    icon: './assets/media/icons/duotune/graphs/gra002.svg',
    title: 'Project Reference FAQ',
    description: '#67945',
  },
  {
    icon: './assets/media/icons/duotune/communication/com010.svg',
    title: '"FitPro App Development',
    description: '#84250',
  },
  {
    icon: './assets/media/icons/duotune/finance/fin001.svg',
    title: 'Shopix Mobile App',
    description: '#45690',
  },
  {
    icon: './assets/media/icons/duotune/graphs/gra002.svg',
    title: '"Landing UI Design" Launch',
    description: '#24005',
  },
];
