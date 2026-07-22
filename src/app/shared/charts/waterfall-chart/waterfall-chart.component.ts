import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  D3WaterfallChartDirective,
  WaterfallChartItem,
  getChartTone,
} from '../d3';

@Component({
  selector: 'vl-waterfall-chart',
  standalone: true,
  imports: [DecimalPipe, NgClass, D3WaterfallChartDirective],
  templateUrl: './waterfall-chart.component.html',
  styleUrls: ['./waterfall-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaterfallChartComponent {
  readonly items = input<readonly WaterfallChartItem[]>([]);
  readonly height = input<number>(260);
  readonly ariaLabel = input<string>('Waterfall chart');
  readonly showLegend = input<boolean>(true);

  readonly legendItems = computed(() =>
    this.items().map((item, index) => ({
      ...item,
      tone: item.tone ?? getChartTone(item, index),
    }))
  );
}
