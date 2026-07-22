import { Injectable, inject } from '@angular/core';
import Swal, { SweetAlertIcon, SweetAlertOptions, SweetAlertResult } from 'sweetalert2';
import { TranslateService } from '@ngx-translate/core';
import { GlobalEventsService } from './events.service';

const TOAST_CONFIG = {
  width: 'auto',
  toast: true,
  position: 'bottom-end' as const,
  showConfirmButton: false,
  timer: 6000,
  timerProgressBar: true
};

const MODAL_CONFIG = {
  buttonsStyling: false,
  width: 450,
  heightAuto: false,
  focusConfirm: true
};

const CONFIRM_CONFIG = {
  icon: 'warning' as SweetAlertIcon,
  showCancelButton: true,
  buttonsStyling: false,
  width: 450,
  heightAuto: false,
  focusCancel: true,
  customClass: {
    title: 'text-gray-800',
    actions: 'flex-row-reverse',
    confirmButton: 'btn fw-bold btn-light-primary',
    cancelButton: 'btn fw-bold btn-light-primary',
    htmlContainer: 'mh-400px'
  }
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly translate = inject(TranslateService);
  private readonly globalEvents = inject(GlobalEventsService);

  private readonly onOpen = () => this.globalEvents.hasOpenNotification$$.next(Date.now());
  private readonly onClose = () => this.globalEvents.hasOpenNotification$$.next(-1);

  toast(options?: Partial<SweetAlertOptions>): Promise<SweetAlertResult<unknown>> {
    return Swal.fire({
      ...TOAST_CONFIG,
      title: this.translate.instant('validation.errorOccurred'),
      willOpen: this.onOpen,
      willClose: this.onClose,
      ...options
    } as SweetAlertOptions);
  }

  modal(options?: Partial<SweetAlertOptions>): Promise<SweetAlertResult<unknown>> {
    return Swal.fire({
      ...MODAL_CONFIG,
      confirmButtonText: this.translate.instant('common.actions.okGotIt'),
      customClass: { confirmButton: 'btn fw-bold btn-primary' },
      willOpen: this.onOpen,
      willClose: this.onClose,
      ...options
    } as SweetAlertOptions);
  }

  confirmSubmit(options?: Partial<SweetAlertOptions>): Promise<SweetAlertResult<unknown>> {
    return Swal.fire({
      ...CONFIRM_CONFIG,
      confirmButtonText: this.translate.instant('common.actions.submit'),
      cancelButtonText: this.translate.instant('common.actions.noReturn'),
      willOpen: this.onOpen,
      willClose: this.onClose,
      ...options
    } as SweetAlertOptions);
  }

  confirmDelete(options?: Partial<SweetAlertOptions>): Promise<SweetAlertResult<unknown>> {
    return Swal.fire({
      ...CONFIRM_CONFIG,
      confirmButtonText: this.translate.instant('common.actions.confirmDelete'),
      cancelButtonText: this.translate.instant('common.actions.noReturn'),
      willOpen: this.onOpen,
      willClose: this.onClose,
      ...options
    } as SweetAlertOptions);
  }
}

