import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from './toast.service';
import {Toast} from './toast.model';


@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-50 w-90 space-y-2">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast-enter flex items-center gap-3 rounded-2xl px-4 py-3 text-sm shadow-lg backdrop-blur
             border border-white/10"
          [ngClass]="{
        'bg-mint-600/95 text-white': toast.type === 'success',
        'bg-danger-600/95 text-white': toast.type === 'error',
        'bg-ink-900/95 text-white': toast.type === 'info'
      }"
        >
          <!-- icon -->
          <span class="text-lg leading-none">
        @switch (toast.type) {
          @case ('success') { ✓ }
          @case ('error') { ! }
          @case ('info') { ℹ }
        }
      </span>

          <!-- content -->
          <div class="flex-1 leading-snug">
            {{ toast.message }}
          </div>

          <!-- actions -->
          <div class="flex gap-1">
            @if (toast.action) {
              <button
                class="rounded-md bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
                (click)="onAction($event, toast)"
              >
                {{ toast.action.label }}
              </button>
            }

            <button
              class="rounded-md bg-white/20 px-2 py-1 text-xs hover:bg-white/30"
              (click)="close($event, toast.id)"
            >
              ✕
            </button>
          </div>
        </div>
      }
    </div>
  `
})
export class ToastContainerComponent {
  readonly toastService = inject(ToastService);
  close(event: MouseEvent, id: number) {
    event.stopPropagation();
    event.preventDefault();
    this.toastService.remove(id);
  }

  onAction(event: MouseEvent, toast: Toast) {
    event.stopPropagation();
    toast.action?.handler();
    this.toastService.remove(toast.id);
  }
}
