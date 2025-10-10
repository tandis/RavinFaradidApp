import { Component, OnInit } from '@angular/core';
import { InternetConnectionStatusComponent, LoaderBarComponent } from '@abp/ng.theme.shared';
import { ConfigStateService, DynamicLayoutComponent,ReplaceableComponentsService , getLocaleDirection } from '@abp/ng.core';
import { eThemeLeptonXComponents } from '@abp/ng.theme.lepton-x';

@Component({
  selector: 'app-root',
  template: `
    <abp-loader-bar />
    <abp-dynamic-layout />
    <abp-internet-status />
  `,
  imports: [LoaderBarComponent, DynamicLayoutComponent, InternetConnectionStatusComponent],
})
export class AppComponent {
  constructor(private configState: ConfigStateService) {}



}

