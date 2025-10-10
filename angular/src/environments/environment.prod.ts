import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: true,
  application: {
    baseUrl,
    name: 'RavinaFaradid',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44338/',
    redirectUri: baseUrl,
    clientId: 'RavinaFaradid_App',
    responseType: 'code',
    scope: 'offline_access RavinaFaradid',
    requireHttps: true
  },
  apis: {
    default: {
      url: 'https://localhost:44338',
      rootNamespace: 'RavinaFaradid',
    },
  },
  leptonX: {
    rtl: true,               // 👈 فعال بودن RTL
    rtlLanguages: ['ar', 'fa'] // 👈 اضافه کردن فارسی
  },
  localization: {
    languages: [
      {
        culture: 'fa',
        name: 'فارسی',
        // ...
      },
      // ... سایر زبان‌ها
    ],
    defaultCulture: 'fa',
    fetchResources: true, // ✅ این مقدار را به true تغییر دهید
  },
} as Environment;
