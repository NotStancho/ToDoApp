import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-form-field',
  imports: [InputComponent],
  template: `
    <div class="mt-4">
      <label class="mb-2 block font-semibold text-ink-700" [for]="inputId">
        {{ label }}
      </label>
      <app-input
        [inputId]="inputId"
        [type]="type"
        [placeholder]="placeholder"
        [autocomplete]="autocomplete"
        [control]="control"
        size="lg"
      />
      @if (control.touched && control.invalid) {
        <div class="mt-2 text-sm text-danger-600">
          {{ errorText }}
        </div>
      }
    </div>
  `
})
export class FormFieldComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) inputId!: string;
  @Input({ required: true }) control!: FormControl<string>;
  @Input() type = 'text';
  @Input() placeholder = '';
  @Input() autocomplete = 'off';
  @Input() errorText = 'Invalid value.';
}
