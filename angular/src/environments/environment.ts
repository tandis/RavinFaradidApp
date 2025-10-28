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
} as Environment;
