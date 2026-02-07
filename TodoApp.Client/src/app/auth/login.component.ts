import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

import AuthService from '../core/auth/auth.service';
import { FormFieldComponent } from '../ui/form-field/form-field.component';
import { ButtonComponent } from '../ui/button/button.component';
import { AuthLayoutComponent } from './auth-layout.component';
import { ToastService } from '../ui/toast/toast.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, FormFieldComponent, ButtonComponent, AuthLayoutComponent],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly toast = inject(ToastService);
  private readonly fb = inject(FormBuilder);
  protected readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  loading = false;

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/tasks';

    this.auth.login(this.form.getRawValue()).subscribe({
      next: () => this.router.navigateByUrl(returnUrl),
      error: (err) => {
        this.toast.error(
          err?.error?.message ?? 'Invalid email or password'
        );
      }
    });
  }
}
