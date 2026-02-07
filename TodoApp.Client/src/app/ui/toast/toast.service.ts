import { Injectable, signal } from '@angular/core';
import { Toast, ToastType, ToastAction } from './toast.model';

const MAX_TOASTS = 5;

@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  readonly toasts = signal<Toast[]>([]);

  show(
    message: string,
    type: ToastType = 'info',
    action?: ToastAction,
    duration?: number
  ) {
    if (this.toasts().some(t => t.message === message)) {
      return;
    }

    const toast: Toast = {
      id: ++this.counter,
      message,
      type,
      action,
      duration: duration ?? this.getDefaultDuration(type)
    };

    this.toasts.update(list => {
      const next = [...list, toast];
      return next.slice(-MAX_TOASTS);
    });

    if(toast.duration && toast.duration > 0) {
      setTimeout(() => this.remove(toast.id), toast.duration);
    }
  }

  success(msg: string, action?: ToastAction) {
    this.show(msg, 'success', action);
  }

  error(msg: string, action?: ToastAction) {
    this.show(msg, 'error', action, 0);
  }

  info(msg: string, action?: ToastAction) {
    this.show(msg, 'info', action);
  }

  remove(id: number) {
    this.toasts.update(list => list.filter(t => t.id !== id));
  }

  private getDefaultDuration(type: ToastType): number {
    switch (type) {
      case 'success':
        return 3000;
      case 'info':
        return 3000;
      case 'error':
        return 0; // never auto close
    }
  }
}
