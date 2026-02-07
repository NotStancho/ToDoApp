import { booleanAttribute, Component, Input } from '@angular/core';

const BUTTON_VARIANTS = {
  primary: 'bg-linear-to-br from-mint-600 to-mint-500 text-white font-bold hover:-translate-y-0.5 hover:shadow-cta',
  secondary: 'border border-stroke bg-white text-ink-700 hover:bg-sand-50',
  ghost: 'text-ink-700 hover:bg-sand-50',
  danger: 'border border-danger-600/30 text-danger-700 hover:border-danger-600/60 hover:bg-danger-600/10'
} as const;

const BUTTON_SIZES = {
  sm: 'rounded-lg px-3 py-1.5 text-sm',
  md: 'rounded-xl px-4 py-2 text-sm',
  lg: 'rounded-2xl px-4 py-3.5 text-base'
} as const;

export type ButtonVariant = keyof typeof BUTTON_VARIANTS;
export type ButtonSize = keyof typeof BUTTON_SIZES;

@Component({
  selector: 'app-button',
  standalone: true,
  template: `
    <button
      [type]="type"
      [disabled]="disabled"
      [class]="classes"
    >
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input({ transform: booleanAttribute }) disabled = false;
  @Input() className = '';

  get classes(): string {
    const base =
      'inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold transition duration-200 focus-visible:outline-none focus-visible:shadow-focus disabled:pointer-events-none disabled:opacity-60';
    const variant = BUTTON_VARIANTS[this.variant] ?? BUTTON_VARIANTS.primary;
    const size = BUTTON_SIZES[this.size] ?? BUTTON_SIZES.md;

    return [base, size, variant, this.className].filter(Boolean).join(' ');
  }
}
