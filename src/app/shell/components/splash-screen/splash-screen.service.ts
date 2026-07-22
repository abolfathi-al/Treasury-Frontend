import { ElementRef, Injectable } from '@angular/core';
import { AnimationUtil } from '@utils';

@Injectable({
  providedIn: 'root',
})
export class SplashScreenService {
  // Private properties
  private el: ElementRef;
  private stopped: boolean;

  /**
   * Service constructor
   */
  constructor() {}

  /**
   * Init
   *
   * @param element: ElementRef
   */
  init(element: ElementRef) {
    this.el = element;
  }

  /**
   * Hide splash screen using CSS animation (Angular 20 migration)
   */
  hide() {
    if (this.stopped || !this.el) {
      return;
    }

    // Use CSS animation instead of AnimationBuilder for Angular 20 compatibility
    const element = this.el.nativeElement;
    
    // Add fade-out animation class
    AnimationUtil.animateClass(element, 'splash-screen-fade-out', () => {
      // Remove element after animation completes
      if (typeof element.remove === 'function') {
        element.remove();
      } else {
        element.style.display = 'none !important';
      }
      this.stopped = true;
    });
  }
}
