import { NgOptimizedImage } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  OnInit,
  viewChild,
} from '@angular/core';
import { SplashScreenService } from './splash-screen.service';

@Component({
  selector: 'vl-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
})
export class SplashScreenComponent implements OnInit {
  private readonly splashScreenService = inject(SplashScreenService);

  readonly splashScreen = viewChild.required<ElementRef>('splashScreen');

  ngOnInit(): void {
    this.splashScreenService.init(this.splashScreen());
  }
}
