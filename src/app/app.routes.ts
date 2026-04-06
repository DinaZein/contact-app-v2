import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component')
      .then(m => m.RegisterComponent)
  },
  {
 path: 'contacts',
  canActivate: [authGuard],
  loadComponent: () =>
    import('./components/contact/contact.component')
      .then(m => m.ContactComponent)
  },
  {
    path: 'error',
    loadComponent: () => import('./pages/error/error.component')
      .then(m => m.ErrorComponent)
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];