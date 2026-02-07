import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html'
})
export class ConfirmModalComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() confirmLabel = 'Delete';
  @Input() cancelLabel = 'Cancel';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}
