import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import { PopoverService } from '../popover/popover.service';

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select.component.html',
})
export class SelectComponent<T extends number | null> {
  @Input() options: { id: T; label: string }[] = [];
  @Input() value: T | null = null;
  @Input() placeholder = 'Select';

  @Output() change = new EventEmitter<T | null>();

  constructor(
    private popover: PopoverService,
    private vcr: ViewContainerRef
  ) {}

  get selectedLabel(): string {
    return this.options.find(o => o.id === this.value)?.label ?? this.placeholder;
  }

  open(btn: HTMLElement, dropdownTpl: TemplateRef<any>) {
    this.popover.open(btn, dropdownTpl, this.vcr, null, {
      offsetY: 0,
      matchWidth: true,
    });
  }

  select(id: T) {
    this.change.emit(id);
    this.popover.close();
  }
}
