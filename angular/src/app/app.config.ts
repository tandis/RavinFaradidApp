import { APP_BOOTSTRAP_LISTENER, APP_INITIALIZER, ApplicationConfig, importProvidersFrom, inject, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { appRoutes } from './app.routes';
import { APP_ROUTE_PROVIDER } from './route.provider';
import { ConfigStateService, provideAbpCore, withOptions } from '@abp/ng.core';
import { environment } from '../environments/environment';
import { registerLocale, storeLocaleData } from '@abp/ng.core/locale';
import { provideAbpOAuth } from '@abp/ng.oauth';
import { provideSettingManagementConfig } from '@abp/ng.setting-management/config';
import { provideAccountConfig } from '@abp/ng.account/config';
import { provideIdentityConfig } from '@abp/ng.identity/config';
import { provideTenantManagementConfig } from '@abp/ng.tenant-management/config';
import { provideFeatureManagementConfig } from '@abp/ng.feature-management';
import { provideLogo, withEnvironmentOptions } from '@volo/ngx-lepton-x.core';
import { ThemeLeptonXModule } from '@abp/ng.theme.lepton-x';
import { SideMenuLayoutModule } from '@abp/ng.theme.lepton-x/layouts';
import { AccountLayoutModule } from '@abp/ng.theme.lepton-x/account';
import { ThemeSharedModule, withHttpErrorConfig, withValidationBluePrint, provideAbpThemeShared } from '@abp/ng.theme.shared';
import { provideThemeLeptonX } from "@abp/ng.theme.lepton-x";
import { provideSideMenuLayout } from "@abp/ng.theme.lepton-x/layouts";
import { RtlService } from './core/rtl-service';
import { registerLocaleData } from '@angular/common';
import localeFa from '@angular/common/locales/fa';
import localeEn from '@angular/common/locales/en';

// import(
//   /* webpackChunkName: "_locale-your-locale-js"*/
//   /* webpackMode: "eager" */
//   "@angular/common/locales/fa.js"
// ).then((m) => storeLocaleData(m.default, "fa"));

// registerLocaleData(localeFa);
// registerLocaleData(localeEn);

// // 👇 dynamic provider factory
// export function localeFactory(configState: ConfigStateService) {
//   const culture = configState.getOne('localization')?.currentCulture?.cultureName ?? 'en';
//   // cultureName = "fa" | "en" | "ar" | ...
//   console.log('Current culture:', culture);
//   return culture.toLowerCase().startsWith('fa') ? 'fa' : 'en';
// }



export const appConfig: ApplicationConfig = {
    providers: [
    provideRouter(appRoutes),
    APP_ROUTE_PROVIDER,
    provideAbpCore(withOptions({
        environment,
        registerLocaleFn: registerLocale(),
    })),
    provideSideMenuLayout(),
    provideThemeLeptonX(),
    provideAbpOAuth(),
    provideSettingManagementConfig(),
    provideAccountConfig(),
    provideIdentityConfig(),
    provideTenantManagementConfig(),
    provideFeatureManagementConfig(),
    provideAnimations(),
    {
     provide: APP_BOOTSTRAP_LISTENER,
      multi: true,
      useFactory: (rtl: RtlService) => () => rtl.init(),
      deps: [RtlService]
    },
    provideLogo(withEnvironmentOptions(environment)), importProvidersFrom(ThemeLeptonXModule.forRoot(), SideMenuLayoutModule.forRoot(), AccountLayoutModule.forRoot(), ThemeSharedModule), provideAbpThemeShared(withValidationBluePrint({
        wrongPassword: 'Please choose 1q2w3E*'
    }))
],
};

