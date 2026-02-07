import { CommonModule } from '@angular/common';
import {AfterViewInit, Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './category-form.component.html'
})
export class CategoryFormComponent implements AfterViewInit {
  @ViewChild('input') inputRef!: ElementRef<HTMLInputElement>;

  @Input() form!: FormGroup;
  @Input() formClass = '';
  @Input() inputClass = '';
  @Input() placeholder = 'Category name';
  @Input() submitLabel = 'Add';
  @Input() cancelLabel = 'Cancel';
  @Input() showActions = true;
  @Input() disableSubmit = false;
  @Input() showValidation = false;
  @Input() validationMessage = 'Name must be 2–100 characters.';

  @Output() submitForm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
  @Output() inputEnter = new EventEmitter<void>();
  @Output() inputEscape = new EventEmitter<void>();

  ngAfterViewInit(): void {
    queueMicrotask(() => {
      this.inputRef?.nativeElement.focus();
    });
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.showActions) return;
    this.submitForm.emit();
  }
}
