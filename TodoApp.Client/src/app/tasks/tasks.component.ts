import { CommonModule } from '@angular/common';
import { Component, computed, DestroyRef, inject, signal } from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';

import { CategoriesFacade } from './categories/categories.facade';
import { CategoryListItem } from '../core/category/category.models';

import AuthService from '../core/auth/auth.service';
import { TasksFacade } from './tasks.facade';
import { TaskListItem } from '../core/task/task.models';
import { TaskDetailsComponent } from './details/task-details.component';
import { TasksListComponent } from './list/tasks-list.component';
import { TasksSidebarComponent } from './sidebar/tasks-sidebar.component';
import { TaskCreateRequest, TaskUpdateRequest } from '../core/task/task.models';

import { ConfirmModalService } from '../ui/modal/confirm-modal.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, TasksSidebarComponent, TasksListComponent, TaskDetailsComponent],
  providers: [TasksFacade, CategoriesFacade],
  templateUrl: './tasks.component.html'
})
export class TasksComponent {
  private readonly fb = inject(FormBuilder);

  private readonly auth = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  readonly user = toSignal(this.auth.user$, { initialValue: null });

  readonly categoriesFacade = inject(CategoriesFacade);
  readonly categories = this.categoriesFacade.categories;
  readonly loadingCategories = this.categoriesFacade.loading;
  readonly savingCategory = this.categoriesFacade.saving;
  readonly savingCategoryId = this.categoriesFacade.savingId;
  readonly editingCategoryId = this.categoriesFacade.editingId;

  protected readonly tasksFacade = inject(TasksFacade);
  readonly tasks = this.tasksFacade.tasks;
  readonly loadingTasks = this.tasksFacade.loading;
  readonly selectedTaskId = this.tasksFacade.selectedTaskId;
  readonly selectedTaskDetails = this.tasksFacade.selectedTaskDetails;
  readonly recentTasks = this.tasksFacade.recentTasks;
  readonly loadingRecent = this.tasksFacade.loadingRecent;

  private readonly confirm = inject(ConfirmModalService);

  readonly isCreatingTask = signal(false);

  readonly hasDetails = computed(() => this.isCreatingTask() || !!this.selectedTaskId());

  readonly filtersForm = this.fb.group({
    search: [''],
    status: ['all' as 'all' | 'open' | 'done']
  });

  readonly categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
  });

  readonly categoryEditForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]]
  });

  constructor() {
    this.categoriesFacade.load();

    this.tasksFacade.applyFilters({});

    this.tasksFacade.loadRecentTasks();

    this.filtersForm.valueChanges
      .pipe(debounceTime(250), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        const { search, status } = this.filtersForm.getRawValue();

        this.tasksFacade.applyFilters({
          search: search ?? undefined,
          status: status ?? 'all'
        });
      });
  }

  selectTask(id: number): void {
    this.isCreatingTask.set(false);
    this.tasksFacade.selectTask(id);
  }

  changePage(dir: 'prev' | 'next'): void {
    this.tasksFacade.changePage(dir);
  }

  onCategoryChange(filter: 'all' | 'none' | number): void {
    this.tasksFacade.setCategoryFilter(filter);
  }

  addCategory(): void {
    const name = this.categoryForm.controls['name'].value;
    if (!name) return;

    this.categoriesFacade.create(name, () => {
      this.categoryForm.reset();
    });
  }

  startCreateTask(): void {
    this.isCreatingTask.set(true);
    this.selectedTaskId.set(null);
    this.selectedTaskDetails.set(null);
  }

  onEditCategory(category: CategoryListItem): void {
    this.categoriesFacade.startEdit(category);
    this.categoryEditForm.enable();
    this.categoryEditForm.setValue({
      name: category.name
    });
  }

  onCancelEditCategory(): void {
    this.categoriesFacade.cancelEdit();
    this.categoryEditForm.reset();
    this.categoryEditForm.disable();
  }

  onSaveEditCategory(): void {
    const id = this.editingCategoryId();
    const name = this.categoryEditForm.controls['name'].value;

    if (!id || !name) return;

    this.categoriesFacade.update(id, name);
  }

  setStatus(status: 'all' | 'open' | 'done'): void {
    this.filtersForm.patchValue({ status });
  }

  createTask(payload: TaskCreateRequest): void {
    this.isCreatingTask.set(false);
    this.tasksFacade.createTask(payload);
  }

  updateTask(e: { id: number; payload: TaskUpdateRequest }): void {
    this.tasksFacade.updateTask(e.id, e.payload);
  }

  toggleComplete(task: TaskListItem): void {
    this.tasksFacade.toggleComplete(task);
  }

  deleteTask(id: number): void {
    this.confirm.open({
      title: 'Delete task?',
      description: 'This action cannot be undone'
    }).then(() => {
      this.tasksFacade.deleteTask(id);
    });
  }

  deleteCategory(id: number): void {
    this.confirm.open({
      title: 'Delete category?',
      description: 'Tasks will be moved to “No category”'
    }).then(() => {
      this.categoriesFacade.delete(id, () => {
        if (this.tasksFacade.categoryFilter() === id) {
          this.tasksFacade.setCategoryFilter('all');
        }
      });
    });
  }
}
