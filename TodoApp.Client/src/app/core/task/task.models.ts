export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TaskListItem {
  id: number;
  title: string;
  isCompleted: boolean;
  categoryId?: number;
  categoryName?: string | null;
  createdAt: string;
  updatedAt?: string | null;
}

export interface TaskDetails extends TaskListItem {
  description?: string | null;
  updatedAt?: string | null;
}

export interface RecentTask {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string | null;
}

export interface TaskCreateRequest {
  title: string;
  description?: string | null;
  categoryId?: number | null;
}

export interface TaskUpdateRequest extends TaskCreateRequest {
  isCompleted: boolean;
}

export interface TaskCompleteRequest {
  isCompleted: boolean;
}
