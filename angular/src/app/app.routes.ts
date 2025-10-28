import { Routes } from '@angular/router';
import { formsRoutes } from './forms/forms.routes';
import { AuthGuard, eLayoutType } from '@abp/ng.core';

export const appRoutes: Routes = [{
  path: 'forms/:formId/permissions',
  canActivate: [AuthGuard],
  data: { requiredPolicy: 'Ravina.Forms.FormPermissions.View' },
  loadComponent: () =>
  import('./features/forms-permissions/permissions-page/permissions-page.component')
  .then(m => m.PermissionsPageComponent)
  },
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./home/home.routes').then(m => m.homeRoutes),
  },
  {
    path: 'account',
    loadChildren: () => import('@abp/ng.account').then(m => m.createRoutes()),
  },
  {
    path: 'identity',
    loadChildren: () => import('@abp/ng.identity').then(m => m.createRoutes()),
  },
  {
    path: 'tenant-management',
    loadChildren: () =>
      import('@abp/ng.tenant-management').then(m => m.createRoutes()),
  },
  {
    path: 'setting-management',
    loadChildren: () =>
      import('@abp/ng.setting-management').then(m => m.createRoutes()),
  },
  {
  path:'forms',
  children: formsRoutes
  }
];
