import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { VeloraIconComponent } from '@shared/icons/velora-icon/velora-icon.component';
import {
  NgbModal,
  NgbModalModule,
  NgbModalRef,
} from '@ng-bootstrap/ng-bootstrap';
import { ModalConfig } from '../modal.config';

@Component({
  selector: 'vl-modal',
  templateUrl: './modal.component.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgbModalModule, VeloraIconComponent],
})
export class ModalComponent {
  private readonly modalService = inject(NgbModal);
  readonly modalConfig = input.required<ModalConfig>();
  private readonly modalContent =
    viewChild.required<TemplateRef<ModalComponent>>('modal');
  private modalRef!: NgbModalRef;

  open(): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.modalRef = this.modalService.open(this.modalContent());
      this.modalRef.result.then(resolve, resolve);
    });
  }

  async close(): Promise<void> {
    const config = this.modalConfig();
    if (config.shouldClose === undefined || (await config.shouldClose())) {
      const result = config.onClose === undefined || (await config.onClose());
      this.modalRef.close(result);
    }
  }

  async dismiss(): Promise<void> {
    const config = this.modalConfig();
    if (config.disableDismissButton !== undefined) {
      return;
    }

    if (config.shouldDismiss === undefined || (await config.shouldDismiss())) {
      const result =
        config.onDismiss === undefined || (await config.onDismiss());
      this.modalRef.dismiss(result);
    }
  }
}
