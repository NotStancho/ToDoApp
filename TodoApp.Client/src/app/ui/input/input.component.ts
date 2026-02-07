import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl, ReactiveFormsModule } from '@angular/forms';

const INPUT_SIZES = {
  sm: 'rounded-xl px-3 py-2 text-sm shadow-sm',
  md: 'rounded-xl px-3 py-2 text-base shadow-sm',
  lg: 'rounded-[14px] px-4 py-3 text-base'
} as const;

const INPUT_STATE = {
  normal: 'border-stroke focus:border-mint-600/60 focus:shadow-focus',
  invalid: 'border-danger-600 focus:border-danger-600 focus:shadow-danger-focus'
} as const;

export type InputSize = keyof typeof INPUT_SIZES;

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <input
      [id]="inputId || null"
      [type]="type"
      [placeholder]="placeholder"
      [autocomplete]="autocomplete"
      [formControl]="formControl"
      [class]="inputClasses"
      [attr.aria-invalid]="isInvalid ? 'true' : null"
    />
  `
})
export class InputComponent {
  @Input({ required: true }) control!: AbstractControl<string | null>;
  @Input() placeholder = '';
  @Input() type = 'text';
  @Input() autocomplete = 'off';
  @Input() inputId = '';
  @Input() size: InputSize = 'md';
  @Input() className = '';

  get isInvalid(): boolean {
    return !!this.control && this.control.invalid && (this.control.dirty || this.control.touched);
  }

  get inputClasses(): string {
    const base = 'w-full border bg-white text-ink-900 transition focus:outline-none disabled:cursor-not-allowed disabled:opacity-60';
    const size = INPUT_SIZES[this.size] ?? INPUT_SIZES.md;
    const state = this.isInvalid ? INPUT_STATE.invalid : INPUT_STATE.normal;

    return [base, size, state, this.className].filter(Boolean).join(' ');
  }

  get formControl(): FormControl {
    return this.control as FormControl;
  }
}
