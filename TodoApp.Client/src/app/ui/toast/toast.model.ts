export type ToastType = 'success' | 'error' | 'info';

export interface ToastAction {
  label: string;
  handler: () => void;
}

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
  action?: ToastAction;
  duration?: number;
}
