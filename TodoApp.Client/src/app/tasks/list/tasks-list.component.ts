import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

import { TaskListItem } from '../../core/task/task.models';
import { PaginationComponent } from '../../ui/pagination/pagination.component';
import { ButtonComponent } from '../../ui/button/button.component';
import { InputComponent } from '../../ui/input/input.component';

@Component({
  selector: 'app-tasks-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DatePipe, PaginationComponent, ButtonComponent, InputComponent],
  templateUrl: './tasks-list.component.html'
})
export class TasksListComponent {
  @Input() tasks: { items: TaskListItem[]; totalPages: number; page: number } | null = null;
  @Input() loading = false;
  @Input() selectedTaskId: number | null = null;
  @Input() filtersForm!: FormGroup;

  @Output() selectTask = new EventEmitter<number>();
  @Output() toggleComplete = new EventEmitter<TaskListItem>();
  @Output() pageChange = new EventEmitter<'prev' | 'next'>();
  @Output() createTask = new EventEmitter<void>();
  @Output() statusChange = new EventEmitter<'all' | 'open' | 'done'>();
}
