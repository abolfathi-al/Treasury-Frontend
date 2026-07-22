import { StyleUtil } from './style.util';
import { DomUtil } from './dom.util';
import { LoggerService } from '@core/services/logger.service';

const DEFAULT_DURATION = 500;
const DEFAULT_SPEED = 600;
const ANIMATION_END_EVENT = 'animationend';
const TRANSITION_END_EVENT = 'transitionend';

export class AnimationUtil {
  static animate(
    from: number,
    to: number,
    duration: number,
    update: Function,
    complete?: Function
  ): void {
    try {
      const easings = {
        linear: function (t: number, b: number, c: number, d: number) {
          return (c * t) / d + b;
        },
      };

      if (!complete) {
        complete = function () {};
      }

      const change = to - from;

      function loop(timestamp: number) {
        const time = (timestamp || +new Date()) - start;

        if (time >= 0) {
          update(easings.linear(time, from, change, duration));
        }
        if (time >= 0 && time >= duration) {
          update(to);
          if (complete) {
            complete();
          }
        } else {
          window.requestAnimationFrame(loop);
        }
      }

      update(from);

      const start =
        window.performance && window.performance.now ? window.performance.now() : +new Date();

      window.requestAnimationFrame(loop);
    } catch (error) {
      LoggerService.Error('Animation failed', 'AnimationUtil', {
        data: { from, to, duration },
        error
      });
    }
  }

  static animateClass(
    element: HTMLElement,
    animationName: string,
    callBack?: Function
  ): void {
    try {
      const animateClasses = animationName.split(' ');
      animateClasses.forEach((cssClass) => element.classList.add(cssClass));
      
      const handleAnimationEnd = () => {
        animateClasses.forEach((cssClass) => element.classList.remove(cssClass));
        if (callBack) {
          callBack();
        }
      };

      element.addEventListener(ANIMATION_END_EVENT, handleAnimationEnd, { once: true });
    } catch (error) {
      LoggerService.Error('Animate class failed', 'AnimationUtil', {
        data: { element, animationName },
        error
      });
    }
  }

  static transitionEnd(element: HTMLElement, callBack: Function): void {
    try {
      element.addEventListener(TRANSITION_END_EVENT, callBack as EventListener, { once: true });
    } catch (error) {
      LoggerService.Error('Transition end failed', 'AnimationUtil', {
        data: { element },
        error
      });
    }
  }

  static animationEnd(element: HTMLElement, callBack: Function): void {
    try {
      element.addEventListener(ANIMATION_END_EVENT, callBack as EventListener, { once: true });
    } catch (error) {
      LoggerService.Error('Animation end failed', 'AnimationUtil', {
        data: { element },
        error
      });
    }
  }

  static animationDelay(element: HTMLElement, value: string): void {
    try {
      StyleUtil.set(element, 'animation-delay', value);
    } catch (error) {
      LoggerService.Error('Animation delay failed', 'AnimationUtil', {
        data: { value },
        error
      });
    }
  }

  static animationDuration(element: HTMLElement, value: string): void {
    try {
      StyleUtil.set(element, 'animation-duration', value);
    } catch (error) {
      LoggerService.Error('Animation duration failed', 'AnimationUtil', {
        data: { value },
        error
      });
    }
  }

  static slideUp(element: HTMLElement, duration: number = DEFAULT_DURATION): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!element) {
          LoggerService.Warn('Element is null or undefined', 'AnimationUtil', {
            data: { element },
          });
          return resolve();
        }

        if (!DomUtil.isVisibleElement(element)) {
          return resolve();
        }

        const speed = duration || DEFAULT_SPEED;
        const calcHeight = DomUtil.getElementActualHeight(element);
        let calcPaddingTop: number = 0;
        let calcPaddingBottom: number = 0;

        if (StyleUtil.get(element, 'padding-top')) {
          calcPaddingTop = parseInt(StyleUtil.get(element, 'padding-top'));
        }

        if (StyleUtil.get(element, 'padding-bottom')) {
          calcPaddingBottom = parseInt(StyleUtil.get(element, 'padding-bottom'));
        }

        // Set up for animation
        element.style.cssText = 'display: block; overflow: hidden;';

        let completedAnimations = 0;
        const totalAnimations = 1 + (calcPaddingTop ? 1 : 0) + (calcPaddingBottom ? 1 : 0);

        const checkComplete = () => {
          completedAnimations++;
          if (completedAnimations >= totalAnimations) {
            element.style.height = '';
            element.style.display = 'none';
            resolve();
          }
        };

        if (calcPaddingTop) {
          AnimationUtil.animate(0, calcPaddingTop, speed, function (value: number) {
            element.style.paddingTop = (calcPaddingTop - value) + 'px';
          }, checkComplete);
        }

        if (calcPaddingBottom) {
          AnimationUtil.animate(0, calcPaddingBottom, speed, function (value: number) {
            element.style.paddingBottom = (calcPaddingBottom - value) + 'px';
          }, checkComplete);
        }

        AnimationUtil.animate(0, calcHeight || 0, speed, function (value: number) {
          element.style.height = ((calcHeight || 0) - value) + 'px';
        }, checkComplete);

      } catch (error) {
        LoggerService.Error('SlideUp animation failed', 'AnimationUtil', {
          data: { element },
          error
        });
        reject(error);
      }
    });
  }

  static slideDown(element: HTMLElement, duration: number = DEFAULT_DURATION): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        if (!element) {
          LoggerService.Warn('Element is null or undefined', 'ComponentName', {
            data: { element },
          });
          return resolve();
        }

        if (DomUtil.isVisibleElement(element)) {
          return resolve();
        }

        const speed = duration || DEFAULT_SPEED;
        const calcHeight = DomUtil.getElementActualHeight(element);
        let calcPaddingTop: number = 0;
        let calcPaddingBottom: number = 0;

        if (StyleUtil.get(element, 'padding-top')) {
          calcPaddingTop = parseInt(StyleUtil.get(element, 'padding-top'));
        }

        if (StyleUtil.get(element, 'padding-bottom')) {
          calcPaddingBottom = parseInt(StyleUtil.get(element, 'padding-bottom'));
        }

        element.style.cssText = 'display: block; overflow: hidden;';

        let completedAnimations = 0;
        const totalAnimations = 1 + (calcPaddingTop ? 1 : 0) + (calcPaddingBottom ? 1 : 0);

        const checkComplete = () => {
          completedAnimations++;
          if (completedAnimations >= totalAnimations) {
            element.style.height = '';
            element.style.display = '';
            element.style.overflow = '';
            resolve();
          }
        };

        if (calcPaddingTop) {
          AnimationUtil.animate(0, calcPaddingTop, speed, function (value: number) {
            element.style.paddingTop = value + 'px';
          }, () => {
            element.style.paddingTop = '';
            checkComplete();
          });
        }

        if (calcPaddingBottom) {
          AnimationUtil.animate(0, calcPaddingBottom, speed, function (value: number) {
            element.style.paddingBottom = value + 'px';
          }, () => {
            element.style.paddingBottom = '';
            checkComplete();
          });
        }

        AnimationUtil.animate(0, calcHeight || 0, speed, function (value: number) {
          element.style.height = value + 'px';
        }, checkComplete);

      } catch (error) {
        LoggerService.Error('SlideDown animation failed', 'AnimationUtil', {
          data: { element },
          error
        });
        reject(error);
      }
    });
  }

  static scrollTo(element: HTMLElement | null, offset: number, duration: number = DEFAULT_DURATION): void {
    try {
      let targetPos = element ? DomUtil.getElementOffset(element).top : 0;
      let scrollPos = DomUtil.getScrollTop();

      if (offset) {
        scrollPos += offset;
        targetPos = targetPos - offset;
      }

      const from = scrollPos;
      const to = targetPos;

      AnimationUtil.animate(from, to, duration, function (value: number) {
        document.documentElement.scrollTop = value;
        document.body.scrollTop = value;
      });
    } catch (error) {
      LoggerService.Error('Scroll to failed', 'AnimationUtil', {
        data: { offset, duration },
        error
      });
    }
  }

  static scrollTop(offset: number, duration: number): void {
    try {
      AnimationUtil.scrollTo(null, offset, duration);
    } catch (error) {
      LoggerService.Error('Scroll top failed', 'AnimationUtil', {
        data: { offset, duration },
        error
      });
    }
  }
}
