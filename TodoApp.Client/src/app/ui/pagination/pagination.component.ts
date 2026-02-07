import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html'
})
export class PaginationComponent {
  @Input() page = 1;
  @Input() totalPages = 1;
  @Input() loading = false;

  @Output() prev = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
}
