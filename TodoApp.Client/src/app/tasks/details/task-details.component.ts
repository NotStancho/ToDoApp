import { CommonModule, DatePipe } from '@angular/common';
import { Component, DestroyRef, EventEmitter, inject, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CategoryListItem } from '../../core/category/category.models';
import { TaskCreateRequest, TaskDetails, TaskUpdateRequest } from '../../core/task/task.models';

import { SelectComponent } from '../../ui/select/select.component';
import { InputComponent } from '../../ui/input/input.component';
import { TextareaComponent } from '../../ui/textarea/textarea.component';
import { ButtonComponent } from '../../ui/button/button.component';

@Component({
  selector: 'app-task-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, SelectComponent, InputComponent, TextareaComponent, ButtonComponent],
  templateUrl: './task-details.component.html'
})
export class TaskDetailsComponent implements OnInit, OnChanges {
  @Input() task: TaskDetails | null = null;
  @Input() categories: CategoryListItem[] = [];
  @Input() isCreating = false;
  @Input() loading = false;

  @Output() create = new EventEmitter<TaskCreateRequest>();
  @Output() update = new EventEmitter<{ id: number; payload: TaskUpdateRequest }>();
  @Output() delete = new EventEmitter<void>();

  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  private patching = false;

  readonly form = this.fb.nonNullable.group({
    title: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
    description: [''],
    categoryId: [null as number | null],
    isCompleted: [false]
  });

  ngOnInit() {
    this.form.valueChanges
      .pipe(
        debounceTime(600),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(() => this.persist());
  }

  ngOnChanges() {
    this.patchForm();
  }

  private persist() {
    if (this.patching) return;
    if (this.form.invalid) return;
    if (this.form.pristine) return;

    const v = this.form.getRawValue();

    if (this.isCreating && !this.task) {
      this.create.emit({
        title: v.title.trim(),
        description: v.description?.trim() || null,
        categoryId: v.categoryId ?? null
      });
      return;
    }

    if (!this.task) return;

    this.update.emit({
      id: this.task.id,
      payload: {
        title: v.title.trim(),
        description: v.description?.trim() || null,
        categoryId: v.categoryId ?? null,
        isCompleted: v.isCompleted
      }
    });
  }

  private patchForm() {
    this.patching = true;
    this.form.reset(
      {
        title: this.task?.title ?? '',
        description: this.task?.description ?? '',
        categoryId: this.task?.categoryId ?? null,
        isCompleted: this.task?.isCompleted ?? false
      },
      { emitEvent: false }
    );
    this.form.markAsPristine();
    this.patching = false;
  }

  get categoryOptions() {
    return [
      { id: null, label: 'No category' },
      ...this.categories.map(c => ({
        id: c.id,
        label: c.name
      }))
    ];
  }

  onCategoryChange(value: number | null) {
    this.form.controls['categoryId'].setValue(value);
    this.form.controls['categoryId'].markAsDirty();
  }
}
