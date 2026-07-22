import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  D3DonutChartDirective,
  DonutChartLegendSegment,
  DonutChartSegment,
  getChartColorClass,
  getChartTone,
} from '../d3';

@Component({
  selector: 'vl-donut-chart',
  standalone: true,
  imports: [DecimalPipe, NgClass, D3DonutChartDirective],
  templateUrl: './donut-chart.component.html',
  styleUrls: ['./donut-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DonutChartComponent {
  readonly segments = input<readonly DonutChartSegment[]>([]);
  readonly centerValue = input<string | number>('');
  readonly centerLabel = input<string>('');
  readonly size = input<number>(150);
  readonly thickness = input<number>(22);
  readonly gapAngle = input<number>(3);
  readonly cornerRadius = input<number>(5);
  readonly showLegend = input<boolean>(true);
  readonly ariaLabel = input<string>('Donut chart');

  readonly normalizedSegments = computed(() =>
    this.segments().filter((segment) => segment.value > 0)
  );
  readonly total = computed(() =>
    this.normalizedSegments().reduce((sum, segment) => sum + segment.value, 0)
  );
  readonly legendSegments = computed<readonly DonutChartLegendSegment[]>(() => {
    const total = this.total();

    if (total <= 0) {
      return [];
    }

    return this.normalizedSegments().map((segment, index) => ({
      ...segment,
      colorClass: getChartColorClass(segment, index),
      tone: getChartTone(segment, index),
      percent: segment.value / total,
    }));
  });
}
