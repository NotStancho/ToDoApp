import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { finalize, tap } from 'rxjs/operators';
import AuthService from '../core/auth/auth.service';
import {AsyncPipe} from '@angular/common';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-account',
  imports: [
    AsyncPipe,
    ButtonComponent
  ],
  templateUrl: './account.component.html'
})
export class AccountComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly user$ = this.auth.user$;
  loading = false;

  logout(): void {
    if (this.loading) return;

    this.loading = true;

    this.auth.logout()
      .pipe(
        tap(() => this.router.navigateByUrl('/login')),
        finalize(() => this.loading = false)
      )
      .subscribe();
  }
}
