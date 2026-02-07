export interface CategoryListItem {
  id: number;
  name: string;
  createdAt: string;
}

export interface CategoryDetails extends CategoryListItem {
  updatedAt?: string | null;
}

export interface CategoryCreateRequest {
  name: string;
}

export type CategoryUpdateRequest = CategoryCreateRequest;
