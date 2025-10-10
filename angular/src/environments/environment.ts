import { Environment } from '@abp/ng.core';

const baseUrl = 'http://localhost:4200';

export const environment = {
  production: false,
  application: {
    baseUrl,
    name: 'RavinaFaradid',
    logoUrl: '',
  },
  oAuthConfig: {
    issuer: 'https://localhost:44397/',
    redirectUri: baseUrl,
    clientId: 'RavinaFaradid_App',
    responseType: 'code',
    scope: 'offline_access RavinaFaradid',
    requireHttps: true,
  },
  apis: {
    default: {
      url: 'https://localhost:44397',
      rootNamespace: 'RavinaFaradid',
    },
  },
 localization: {
    // حتماً از این فیلد استفاده کن
    defaultResourceName: 'RavinaFaradid',
    // شکل درست LanguageInfo:
    languages: [
      { cultureName: 'fa', uiCultureName: 'fa-IR', displayName: 'فارسی', flagIcon: 'fi fi-ir' },
      { cultureName: 'en', uiCultureName: 'en-US', displayName: 'English', flagIcon: 'fi fi-us' },
    ],
    fetchResources: true, // ✅ این مقدار را به true تغییر دهید
  },
} as Environment;
