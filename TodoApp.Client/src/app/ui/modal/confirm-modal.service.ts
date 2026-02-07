import { ApplicationRef, Injectable, createComponent, inject } from '@angular/core';
import { ConfirmModalComponent } from './confirm-modal.component';

@Injectable({ providedIn: 'root' })
export class ConfirmModalService {
  private readonly appRef = inject(ApplicationRef);

  open(config: {
    title: string;
    description?: string;
    confirmLabel?: string;
    cancelLabel?: string;
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      const componentRef = createComponent(ConfirmModalComponent, {
        environmentInjector: this.appRef.injector
      });

      Object.assign(componentRef.instance, {
        title: config.title,
        description: config.description ?? '',
        confirmLabel: config.confirmLabel ?? 'Confirm',
        cancelLabel: config.cancelLabel ?? 'Cancel'
      });

      const subConfirm = componentRef.instance.confirm.subscribe(() => {
        cleanup();
        resolve();
      });

      const subCancel = componentRef.instance.cancel.subscribe(() => {
        cleanup();
        reject();
      });

      this.appRef.attachView(componentRef.hostView);
      document.body.appendChild(componentRef.location.nativeElement);

      const cleanup = () => {
        subConfirm.unsubscribe();
        subCancel.unsubscribe();
        this.appRef.detachView(componentRef.hostView);
        componentRef.destroy();
      };
    });
  }
}
