import { Injectable, inject, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { TaskService } from '../core/task/task.service';
import { TaskCreateRequest, TaskDetails, TaskListItem, TaskUpdateRequest, RecentTask } from '../core/task/task.models';

export interface TasksPage {
  items: TaskListItem[];
  totalPages: number;
  page: number;
}

export type TaskStatusFilter = 'all' | 'open' | 'done';

@Injectable()
export class TasksFacade {
  private readonly api = inject(TaskService);

  readonly tasks = signal<TasksPage | null>(null);
  readonly loading = signal(false);

  readonly selectedTaskId = signal<number | null>(null);
  readonly selectedTaskDetails = signal<TaskDetails | null>(null);

  readonly recentTasks = signal<RecentTask[]>([]);
  readonly loadingRecent = signal(false);

  readonly categoryFilter = signal<'all' | 'none' | number>('all');
  readonly search = signal<string | undefined>(undefined);
  readonly status = signal<TaskStatusFilter>('all');

  readonly page = signal(1);
  readonly pageSize = 10;

  private buildQuery() {
    const filter = this.categoryFilter();

    return {
      search: this.search(),

      // categoryId:
      // null  -> all categories
      // 0     -> no category
      // >0    -> specific category
      categoryId:
        filter === 'none'
          ? 0
          : typeof filter === 'number'
            ? filter
            : undefined,
      isCompleted:
        this.status() === 'all'
          ? null
          : this.status() === 'done',
    };
  }

  loadTasks(): void {
    this.loading.set(true);

    this.api
      .getTasks({
        page: this.page(),
        pageSize: this.pageSize,
        ...this.buildQuery()
      })
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe((result) => {
        this.tasks.set({
          items: result.items ?? [],
          totalPages: result.totalPages ?? 1,
          page: result.page ?? this.page()
        });
      });
  }

  loadTaskDetails(id: number): void {
    this.selectedTaskDetails.set(null);

    this.api.getTask(id).subscribe((details) => {
      this.selectedTaskDetails.set(details);
    });
  }

  loadRecentTasks(limit = 5): void {
    this.loadingRecent.set(true);

    this.api
      .getRecentTasks(limit)
      .pipe(finalize(() => this.loadingRecent.set(false)))
      .subscribe((tasks) => {
        this.recentTasks.set(tasks);
      });
  }

  createTask(payload: TaskCreateRequest): void {
    const filter = this.categoryFilter();
    const categoryId =
      typeof filter === 'number'
        ? filter
        : filter === 'none'
          ? null
          : undefined;

    this.api.createTask({ ...payload, categoryId }).subscribe((created) => {
      this.page.set(1);
      this.selectTask(created.id);
      this.reload();
    });
  }

  updateTask(id: number, payload: TaskUpdateRequest): void {
    this.api.updateTask(id, payload).subscribe((updated) => {
      this.selectedTaskDetails.set(updated);
      this.updateTaskListItem(updated);
      this.reload();
    });
  }

  deleteTask(id: number): void {
    this.api.deleteTask(id).subscribe(() => {
      if (this.selectedTaskId() === id) {
        this.clearSelection();
      }
      this.reload();
    });
  }

  selectTask(id: number): void {
    if (this.selectedTaskId() === id) {
      this.clearSelection();
      return;
    }

    this.selectedTaskId.set(id);
    this.loadTaskDetails(id);
  }

  updateTaskListItem(updated: TaskDetails): void {
    this.tasks.update((current) => {
      if (!current) return current;
      const items = current.items.map((item) =>
        item.id === updated.id
          ? {
            ...item,
            title: updated.title,
            isCompleted: updated.isCompleted,
            categoryId: updated.categoryId ?? undefined,
            categoryName: updated.categoryName ?? null,
            createdAt: updated.createdAt,
            updatedAt: updated.updatedAt ?? null
          }
          : item
      );
      return { ...current, items };
    });
  }

  toggleComplete(task: TaskListItem): void {
    this.api
      .setTaskCompleted(task.id, !task.isCompleted)
      .subscribe({
        next: () => {
          this.updateTaskCompletion(task.id, !task.isCompleted);

          if (this.selectedTaskId() === task.id) {
            this.loadTaskDetails(task.id);
          }
        }
      });
  }

  applyFilters(params: { search?: string; status?: TaskStatusFilter; }) {
    if (params.search !== undefined) {
      this.search.set(params.search?.trim() || undefined);
    }

    if (params.status) {
      this.status.set(params.status);
    }

    this.resetPage();

    this.loadTasks();
  }

  setCategoryFilter(filter: 'all' | 'none' | number) {
    this.categoryFilter.set(filter);
    this.applyFilters({});
  }

  resetPage(): void {
    this.page.set(1);
  }

  reload(): void {
    this.loadTasks();
  }

  clearSelection(): void {
    this.selectedTaskId.set(null);
    this.selectedTaskDetails.set(null);
  }

  changePage(direction: 'prev' | 'next'): void {
    const current = this.page();
    const total = this.tasks()?.totalPages ?? 1;

    const next =
      direction === 'prev'
        ? Math.max(1, current - 1)
        : Math.min(total, current + 1);

    if (next !== current) {
      this.page.set(next);
      this.reload();
    }
  }

  private updateTaskCompletion(id: number, isCompleted: boolean): void {
    this.tasks.update((current) => {
      if (!current) return current;

      return {
        ...current,
        items: current.items.map((item) =>
          item.id === id
            ? { ...item, isCompleted }
            : item
        )
      };
    });
  }
}
