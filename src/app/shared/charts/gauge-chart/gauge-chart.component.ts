import { DecimalPipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import {
  D3GaugeChartDirective,
  GaugeChartSegment,
  getChartColorClass,
  getChartTone,
} from '../d3';

@Component({
  selector: 'vl-gauge-chart',
  standalone: true,
  imports: [DecimalPipe, NgClass, D3GaugeChartDirective],
  templateUrl: './gauge-chart.component.html',
  styleUrls: ['./gauge-chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GaugeChartComponent {
  readonly segments = input<readonly GaugeChartSegment[]>([]);
  readonly centerValue = input<string | number>('');
  readonly centerLabel = input<string>('');
  readonly size = input<number>(180);
  readonly thickness = input<number>(28);
  readonly gapAngle = input<number>(4);
  readonly cornerRadius = input<number>(6);
  readonly sweepAngle = input<number>(230);
  readonly showLegend = input<boolean>(true);
  readonly ariaLabel = input<string>('Gauge chart');

  readonly normalizedSegments = computed(() =>
    this.segments().filter((segment) => segment.value > 0)
  );
  readonly total = computed(() =>
    this.normalizedSegments().reduce((sum, segment) => sum + segment.value, 0)
  );
  readonly legendSegments = computed(() => {
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
