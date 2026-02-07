import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { API_BASE_URL } from '../api.config';
import {
  PagedResult, RecentTask,
  TaskCompleteRequest,
  TaskCreateRequest,
  TaskDetails,
  TaskListItem,
  TaskUpdateRequest
} from './task.models';

export interface TaskQuery {
  page?: number;
  pageSize?: number;
  categoryId?: number | null;
  search?: string | null;
  isCompleted?: boolean | null;
}

@Injectable({ providedIn: 'root' })
export class TaskService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private apiBaseUrl: string) {}

  getTasks(query: TaskQuery = {}): Observable<PagedResult<TaskListItem>> {
    let params = new HttpParams();

    if (query.page !== undefined && query.page !== null) {
      params = params.set('page', String(query.page));
    }

    if (query.pageSize !== undefined && query.pageSize !== null) {
      params = params.set('pageSize', String(query.pageSize));
    }

    if (query.categoryId !== undefined) {
      params = params.set(
        'categoryId',
        query.categoryId === null ? 'null' : String(query.categoryId)
      );
    }

    if (query.search !== undefined && query.search !== null && query.search !== '') {
      params = params.set('search', query.search);
    }

    if (query.isCompleted !== undefined && query.isCompleted !== null) {
      params = params.set('isCompleted', String(query.isCompleted));
    }

    return this.http
      .get<PagedResult<TaskListItem>>(`${this.apiBaseUrl}/api/Tasks`, { params })
      .pipe(map((res) => this.mapPagedResult(res)));
  }

  getRecentTasks(limit = 5): Observable<RecentTask[]> {
    const params = new HttpParams().set('limit', String(limit));

    return this.http.get<RecentTask[]>(
      `${this.apiBaseUrl}/api/Tasks/recent`,
      { params }
    );
  }

  getTask(id: number): Observable<TaskDetails> {
    return this.http
      .get<TaskDetails>(`${this.apiBaseUrl}/api/Tasks/${id}`)
      .pipe(map((raw) => this.toTaskDetails(raw)));
  }

  createTask(payload: TaskCreateRequest): Observable<TaskDetails> {
    return this.http
      .post<TaskDetails>(`${this.apiBaseUrl}/api/Tasks`, payload)
      .pipe(map((raw) => this.toTaskDetails(raw)));
  }

  updateTask(id: number, payload: TaskUpdateRequest): Observable<TaskDetails> {
    return this.http
      .put<TaskDetails>(`${this.apiBaseUrl}/api/Tasks/${id}`, payload)
      .pipe(map((raw) => this.toTaskDetails(raw)));
  }

  setTaskCompleted(id: number, isCompleted: boolean): Observable<void> {
    const body: TaskCompleteRequest = { isCompleted };
    return this.http.patch<void>(`${this.apiBaseUrl}/api/Tasks/${id}/complete`, body);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/Tasks/${id}`);
  }

  private mapPagedResult(result: any): PagedResult<TaskListItem> {
    const itemsRaw = result.items ?? result.Items ?? [];
    const mappedItems = Array.isArray(itemsRaw)
      ? itemsRaw.map((item) => this.toTaskListItem(item))
      : [];

    const totalCount = result.totalCount ?? result.TotalCount ?? mappedItems.length;
    const page = result.page ?? result.Page ?? 1;
    const pageSize =
      result.pageSize ??
      result.PageSize ??
      (mappedItems.length || 10);
    const totalPages = result.totalPages ?? result.TotalPages ?? Math.ceil(totalCount / pageSize);

    return {
      items: mappedItems,
      totalCount,
      page,
      pageSize,
      totalPages
    };
  }

  private toTaskListItem(raw: any): TaskListItem {
    return {
      id: raw.id ?? raw.Id,
      title: raw.title ?? raw.Title ?? '',
      isCompleted: raw.isCompleted ?? raw.IsCompleted ?? false,
      categoryId: raw.categoryId ?? raw.CategoryId ?? null,
      categoryName: raw.categoryName ?? raw.CategoryName ?? null,
      createdAt: raw.createdAt ?? raw.CreatedAt ?? '',
      updatedAt: raw.updatedAt ?? raw.UpdatedAt ?? null
    };
  }

  private toTaskDetails(raw: any): TaskDetails {
    const base = this.toTaskListItem(raw);
    return {
      ...base,
      description: raw.description ?? raw.Description ?? null,
      updatedAt: raw.updatedAt ?? raw.UpdatedAt ?? null
    };
  }
}
