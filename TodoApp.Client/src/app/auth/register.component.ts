import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';

import AuthService from '../core/auth/auth.service';
import { FormFieldComponent } from '../ui/form-field/form-field.component';
import { ButtonComponent } from '../ui/button/button.component';
import { AuthLayoutComponent } from './auth-layout.component';
import {ToastService} from '../ui/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormFieldComponent, ButtonComponent, AuthLayoutComponent],
  templateUrl: './register.component.html'
})
export class RegisterComponent {
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  loading = false;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    nickname: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.auth.register(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl('/tasks'),
      error: (err) => {
        this.toast.error(
          err?.error?.message ?? 'Registration failed'
        );
      }
    });
  }
}
