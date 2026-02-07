import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, map, shareReplay, tap } from 'rxjs/operators';

import { API_BASE_URL } from '../api.config';
import { AuthResponse, LoginRequest, RegisterRequest, User } from './auth.models';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly authSubject = new BehaviorSubject<AuthResponse | null>(null);
  private refreshInFlight$: Observable<AuthResponse> | null = null;

  private readonly loadingSubject = new BehaviorSubject<boolean>(false);
  readonly loading$ = this.loadingSubject.asObservable();

  readonly user$ = this.authSubject.asObservable().pipe(
    map((state) => (state && !this.isExpired(state.expiresAt) ? state.user : null))
  );

  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private apiBaseUrl: string,
  ) {}

  get accessToken(): string | null {
    const state = this.authSubject.value;
    if (!state) return null;
    return this.isExpired(state.expiresAt) ? null : state.accessToken;
  }

  get isAuthenticated(): boolean {
    return !!this.accessToken;
  }

  login(payload: LoginRequest): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    return this.http
      .post<AuthResponse>(
        `${this.apiBaseUrl}/api/User/login`,
        payload,
        { withCredentials: true }
      )
      .pipe(
        tap((res) => this.authSubject.next(res)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  register(payload: RegisterRequest): Observable<AuthResponse> {
    this.loadingSubject.next(true);

    return this.http
      .post<AuthResponse>(
        `${this.apiBaseUrl}/api/User/register`,
        payload,
        { withCredentials: true }
      )
      .pipe(
        tap((res) => this.authSubject.next(res)),
        finalize(() => this.loadingSubject.next(false))
      );
  }

  logout(options?: { redirect?: boolean }): Observable<void> {
    return this.http
      .post<void>(`${this.apiBaseUrl}/api/User/logout`, {}, { withCredentials: true })
      .pipe(
        catchError(() => of(void 0)),
        tap(() => {
          this.authSubject.next(null);
        })
      );
  }

  refreshAccessToken(): Observable<AuthResponse> {
    if (this.refreshInFlight$) {
      return this.refreshInFlight$;
    }

    this.refreshInFlight$ = this.http
      .post<AuthResponse>(
        `${this.apiBaseUrl}/api/User/refresh-token`,
        {},
        { withCredentials: true }
      )
      .pipe(
        tap((res) => this.authSubject.next(res)),
        catchError((err) => {
          this.authSubject.next(null);
          return throwError(() => err);
        }),
        finalize(() => {
          this.refreshInFlight$ = null;
        }),
        shareReplay(1)
      );

    return this.refreshInFlight$;
  }

  private isExpired(expiresAt: string): boolean {
    return Date.parse(expiresAt) <= Date.now();
  }
}

export default AuthService
