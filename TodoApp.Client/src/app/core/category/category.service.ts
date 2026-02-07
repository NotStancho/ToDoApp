import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { API_BASE_URL } from '../api.config';
import {
  CategoryCreateRequest,
  CategoryDetails,
  CategoryListItem,
  CategoryUpdateRequest
} from './category.models';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient, @Inject(API_BASE_URL) private apiBaseUrl: string) {}

  getAll(): Observable<CategoryListItem[]> {
    return this.http
      .get<CategoryListItem[]>(`${this.apiBaseUrl}/api/Categories`)
      .pipe(map((res: any) => (Array.isArray(res) ? res.map((c) => this.toCategory(c)) : [])));
  }

  getById(id: number): Observable<CategoryDetails> {
    return this.http
      .get<CategoryDetails>(`${this.apiBaseUrl}/api/Categories/${id}`)
      .pipe(map((raw) => this.toCategoryDetails(raw)));
  }

  create(payload: CategoryCreateRequest): Observable<CategoryDetails> {
    return this.http
      .post<CategoryDetails>(`${this.apiBaseUrl}/api/Categories`, payload)
      .pipe(map((raw) => this.toCategoryDetails(raw)));
  }

  update(id: number, payload: CategoryUpdateRequest): Observable<CategoryDetails> {
    return this.http
      .put<CategoryDetails>(`${this.apiBaseUrl}/api/Categories/${id}`, payload)
      .pipe(map((raw) => this.toCategoryDetails(raw)));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiBaseUrl}/api/Categories/${id}`);
  }

  private toCategory(raw: any): CategoryListItem {
    return {
      id: raw.id ?? raw.Id,
      name: raw.name ?? raw.Name ?? '',
      createdAt: raw.createdAt ?? raw.CreatedAt ?? ''
    };
  }

  private toCategoryDetails(raw: any): CategoryDetails {
    const base = this.toCategory(raw);
    return {
      ...base,
      updatedAt: raw.updatedAt ?? raw.UpdatedAt ?? null
    };
  }
}
