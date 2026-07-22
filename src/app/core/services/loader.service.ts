import { Injectable, signal, computed } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  private readonly _isLoading = signal<boolean>(false);
  private readonly showLoader$$ = new Subject<boolean>();

  readonly isLoading = computed(() => this._isLoading());
  readonly showLoader$: Observable<boolean> = this.showLoader$$.asObservable();

  show(): void {
    this._isLoading.set(true);
    this.showLoader$$.next(true);
  }

  hide(): void {
    this._isLoading.set(false);
    this.showLoader$$.next(false);
  }
}
