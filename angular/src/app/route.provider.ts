import { RoutesService, eLayoutType } from '@abp/ng.core';
import { APP_INITIALIZER } from '@angular/core';

export const APP_ROUTE_PROVIDER = [
  { provide: APP_INITIALIZER, useFactory: configureRoutes, deps: [RoutesService], multi: true },
];

function configureRoutes(routesService: RoutesService) {
  return () => {
    routesService.add([
      {
        path: '/',
        name: '::Menu:Home',
        iconClass: 'fas fa-home',
        order: 1,
        layout: eLayoutType.application,
      },
       // 📋 منوی والد فرم‌ها
      {
        path: '/forms',
        name: '::Permission:Forms',
        iconClass: 'fa fa-wpforms',
        order: 200,
        layout: eLayoutType.application,
      },

      // 🔹 زیرمنو: لیست فرم‌ها
      {
        path: '/forms/list',
        name: '::Forms:Title',
        parentName: '::Permission:Forms',
        order: 1,
        iconClass: 'fa fa-list',
      },

      // 🔹 زیرمنو: سازنده فرم
      {
        path: '/forms/create',
        name: '::Forms:New',
        parentName: '::Permission:Forms',
        order: 2,
        iconClass: 'fa fa-pencil-alt',
      },

      // 🔹 زیرمنو: تمپلت‌ها
      {
        path: '/forms/templates',
        name: '::Forms:Templates',
        parentName: '::Permission:Forms',
        order: 3,
        iconClass: 'fa fa-layer-group',
      },
    ]);
  };
}
