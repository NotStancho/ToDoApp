import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login.component';
import { RegisterComponent } from './auth/register.component';
import { AccountComponent } from './auth/account.component';
import { TasksComponent } from './tasks/tasks.component';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'tasks', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'tasks', component: TasksComponent, canActivate: [authGuard] },
  { path: 'me', component: AccountComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'tasks' }
];
