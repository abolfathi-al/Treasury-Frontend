import { NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { D3ProgressBreakdownDirective, ProgressBreakdownItem } from '../d3';

@Component({
  selector: 'vl-progress-breakdown',
  standalone: true,
  imports: [NgClass, D3ProgressBreakdownDirective],
  templateUrl: './progress-breakdown.component.html',
  styleUrls: ['./progress-breakdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBreakdownComponent {
  readonly items = input<readonly ProgressBreakdownItem[]>([]);
  readonly compact = input<boolean>(false);
  readonly ariaLabel = input<string>('Progress breakdown');

  readonly normalizedItems = computed(() =>
    this.items().map((item) => ({
      ...item,
      percentage: Math.max(0, Math.min(100, item.percentage)),
      tone: item.tone ?? 'primary',
    }))
  );
}
