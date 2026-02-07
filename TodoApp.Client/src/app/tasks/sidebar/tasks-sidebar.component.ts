import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, TemplateRef, ViewChild, ViewContainerRef, inject, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { PopoverService } from '../../ui/popover/popover.service';
import { User } from '../../core/auth/auth.models';
import { CategoryListItem } from '../../core/category/category.models';
import { RecentTask } from '../../core/task/task.models';
import { CategoryFormComponent } from '../categories/category-form.component';
import AuthService from '../../core/auth/auth.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tasks-sidebar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, DatePipe, CategoryFormComponent],
  templateUrl: './tasks-sidebar.component.html'
})
export class TasksSidebarComponent implements OnChanges {
  @ViewChild('addCategoryTpl') addCategoryTpl!: TemplateRef<any>;

  private readonly popover = inject(PopoverService);
  private readonly vcr = inject(ViewContainerRef);

  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  readonly loggingOut = signal(false);

  @Input() user: User | null = null;
  @Input() categories: CategoryListItem[] = [];
  @Input() categoryFilter: 'all' | 'none' | number = 'all';
  @Input() recentTasks: RecentTask[] = [];
  @Input() loadingCategories = false;
  @Input() loadingRecent = false;
  @Input() selectedTaskId: number | null = null;
  @Input() categoryForm!: FormGroup;
  @Input() categoryEditForm!: FormGroup;
  @Input() editingCategoryId: number | null = null;
  @Input() savingCategory = false;
  @Input() savingCategoryId: number | null = null;
  @Input() closePopoverKey = 0;

  @Output() categoryChange = new EventEmitter<'all' | 'none' | number>();
  @Output() selectTask = new EventEmitter<number>();
  @Output() addCategory = new EventEmitter<void>();
  @Output() editCategory = new EventEmitter<CategoryListItem>();
  @Output() saveEditCategory = new EventEmitter<void>();
  @Output() cancelEditCategory = new EventEmitter<void>();
  @Output() deleteCategory = new EventEmitter<number>();

  get activeCategoryId(): number | null {
    return typeof this.categoryFilter === 'number' ? this.categoryFilter : null;
  }

  openAddCategory(anchor: HTMLElement): void {
    this.popover.open(anchor, this.addCategoryTpl, this.vcr);
  }

  closePopover(): void {
    this.popover.close();
  }

  openProfileMenu(anchor: HTMLElement, tpl: TemplateRef<any>): void {
    this.popover.open(anchor, tpl, this.vcr);
  }

  logoutFromPopover(): void {
    this.popover.close();
    this.logoutClick();
  }

  openCategoryMenu(anchor: HTMLElement, tpl: TemplateRef<any>, cat: CategoryListItem): void {
    this.popover.open(
      anchor,
      tpl,
      this.vcr,
      { cat }
    );
  }

  onEdit(cat: CategoryListItem): void {
    this.popover.close();
    this.editCategory.emit(cat);
  }

  onDelete(id: number): void {
    this.popover.close();
    this.deleteCategory.emit(id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['closePopoverKey'] && !changes['closePopoverKey'].firstChange) {
      this.closePopover();
    }
  }

  logoutClick(): void {
    if (this.loggingOut()) return;

    this.loggingOut.set(true);

    this.auth.logout()
      .pipe(finalize(() => this.loggingOut.set(false)))
      .subscribe(() => {
        this.router.navigateByUrl('/login');
      });
  }
}
