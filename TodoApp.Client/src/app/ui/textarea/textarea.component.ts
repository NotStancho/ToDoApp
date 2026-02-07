import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

const TEXTAREA_SIZES = {
  sm: 'min-h-24 rounded-xl px-3 py-2 text-sm shadow-sm',
  md: 'min-h-32 rounded-xl px-3 py-2 text-base shadow-sm',
  lg: 'min-h-40 rounded-[14px] px-4 py-3 text-base'
} as const;

const TEXTAREA_STATE = {
  normal: 'border-stroke focus:border-mint-600/60 focus:shadow-focus',
  invalid: 'border-danger-600 focus:border-danger-600 focus:shadow-danger-focus'
} as const;

export type TextareaSize = keyof typeof TEXTAREA_SIZES;

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <textarea
      [id]="inputId || null"
      [rows]="rows"
      [placeholder]="placeholder"
      [formControl]="control"
      [class]="textareaClasses"
      [attr.aria-invalid]="isInvalid ? 'true' : null"
    ></textarea>
  `
})
export class TextareaComponent {
  @Input({ required: true }) control!: FormControl<string>;
  @Input() placeholder = '';
  @Input() rows = 4;
  @Input() inputId = '';
  @Input() size: TextareaSize = 'md';
  @Input() className = '';

  get isInvalid(): boolean {
    return !!this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  get textareaClasses(): string {
    const base = 'w-full border bg-white text-ink-900 transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';
    const size = TEXTAREA_SIZES[this.size] ?? TEXTAREA_SIZES.md;
    const state = this.isInvalid ? TEXTAREA_STATE.invalid : TEXTAREA_STATE.normal;

    return [base, size, state, this.className].filter(Boolean).join(' ');
  }
}
