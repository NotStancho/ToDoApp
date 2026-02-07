import { Injectable, signal } from '@angular/core';
import { finalize } from 'rxjs/operators';

import { CategoryService } from '../../core/category/category.service';
import { CategoryListItem } from '../../core/category/category.models';

@Injectable()
export class CategoriesFacade {
  readonly categories = signal<CategoryListItem[]>([]);
  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly savingId = signal<number | null>(null);
  readonly editingId = signal<number | null>(null);

  constructor(private readonly categoriesApi: CategoryService) {}

  load(): void {
    this.loading.set(true);

    this.categoriesApi
      .getAll()
      .pipe(finalize(() => this.loading.set(false)))
      .subscribe({
        next: (categories) => this.categories.set(categories)
      });
  }

  startEdit(category: CategoryListItem): void {
    this.editingId.set(category.id);
  }

  cancelEdit(): void {
    this.editingId.set(null);
  }

  create(name: string, onDone?: () => void): void {
    if (this.saving()) return;
    if (!name.trim()) return;

    this.saving.set(true);

    this.categoriesApi
      .create({ name: name.trim() })
      .pipe(finalize(() => this.saving.set(false)))
      .subscribe({
        next: () => {
          this.load();
          onDone?.();
        }
      });
  }

  update(id: number, name: string): void {
    if (this.savingId()) return;
    if (!name.trim()) return;

    this.savingId.set(id);

    this.categoriesApi
      .update(id, { name: name.trim() })
      .pipe(finalize(() => this.savingId.set(null)))
      .subscribe({
        next: () => {
          this.categories.update(list =>
            list.map(c =>
              c.id === id ? { ...c, name: name.trim() } : c
            )
          );

          this.editingId.set(null);
        }
      });
  }

  delete(id: number, onDeleted?: () => void): void {
    if (this.savingId()) return;

    this.savingId.set(id);

    this.categoriesApi
      .delete(id)
      .pipe(finalize(() => this.savingId.set(null)))
      .subscribe({
        next: () => {
          this.load();
          onDeleted?.();
        }
      });
  }
}
