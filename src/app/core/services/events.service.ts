import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationCancel, NavigationEnd, NavigationStart } from '@angular/router';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';
import { NgbModal, NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';

export enum KEY {
  ENTER = 'Enter',
  KEY_UP = 'keyup',
  UP = 'ArrowUp',
  DOWN = 'ArrowDown',
  LEFT = 'ArrowLeft',
  RIGHT = 'ArrowRight',
  ESCAPE = 'Escape',
  INSERT = 'Insert',
  DELETE = 'Delete',
  PLUS = '+',
  F1 = 'F1',
  F5 = 'F5',
}

@Injectable({
  providedIn: 'root',
})
export class GlobalEventsService {
  private readonly router = inject(Router);
  private readonly offcanvasService = inject(NgbOffcanvas);
  private readonly modalService = inject(NgbModal);

  private readonly _keydown = signal<KeyboardEvent | null>(null);
  private readonly _hasOpenNotification = signal<number>(0);
  private readonly _hasOpenDrawer = signal<boolean>(false);

  readonly keydown$$: BehaviorSubject<KeyboardEvent | null>;
  readonly keydown$: Observable<KeyboardEvent>;

  readonly hasOpenNotification$$: BehaviorSubject<number>;
  readonly hasOpenNotification$: Observable<boolean>;

  readonly hasOpenDrawer$$: BehaviorSubject<boolean>;
  readonly hasOpenDrawer$: Observable<boolean>;

  readonly keydown = computed(() => this._keydown());
  readonly hasOpenNotification = computed(() => Math.sign(this._hasOpenNotification()) === -1);
  readonly hasOpenDrawer = computed(() => this._hasOpenDrawer());

  constructor() {
    this.keydown$$ = new BehaviorSubject<KeyboardEvent | null>(null);
    this.keydown$ = this.keydown$$.asObservable().pipe(filter(Boolean));

    this.hasOpenNotification$$ = new BehaviorSubject(0);
    this.hasOpenNotification$ = this.hasOpenNotification$$.asObservable().pipe(
      map((time) => Math.sign(time) === -1)
    );

    this.hasOpenDrawer$$ = new BehaviorSubject(false);
    this.hasOpenDrawer$ = this.hasOpenDrawer$$.asObservable();

    this.setupRouterEvents();
  }

  private setupRouterEvents(): void {
    this.router.events.pipe(
      tap((event) => {
        if (event instanceof NavigationStart) {
          this.closeAllOverlays();
        }
        if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
          this.resetState();
        }
      })
    ).subscribe();
  }

  private closeAllOverlays(): void {
    this.offcanvasService.dismiss();
    this.modalService.dismissAll();
  }

  private resetState(): void {
    this.keydown$$.next(null);
    this._keydown.set(null);
    this.hasOpenNotification$$.next(-1);
    this._hasOpenNotification.set(-1);
  }

  setKeydown(event: KeyboardEvent | null): void {
    this._keydown.set(event);
    this.keydown$$.next(event);
  }

  setHasOpenNotification(value: number): void {
    this._hasOpenNotification.set(value);
    this.hasOpenNotification$$.next(value);
  }

  setHasOpenDrawer(value: boolean): void {
    this._hasOpenDrawer.set(value);
    this.hasOpenDrawer$$.next(value);
  }
}
