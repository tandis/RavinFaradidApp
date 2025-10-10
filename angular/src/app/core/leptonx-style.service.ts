import { Injectable } from '@angular/core';
import { LocalizationService } from '@abp/ng.core';

@Injectable({ providedIn: 'root' })
export class BootstrapRtlService {
  constructor(private l10n: LocalizationService) {}

  init(): void {
    this.apply(this.l10n.currentLang || 'en');

    this.l10n.languageChange$.subscribe(lang => {
      this.apply(lang || 'en');
    });
  }

  private apply(lang: string) {
    const isRtl = lang.toLowerCase().startsWith('fa') || lang.toLowerCase().startsWith('ar');

    // dir روی body
    document.body.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    // استایل‌ها
    const ltrLink = document.querySelector<HTMLLinkElement>('link[href*="bootstrap.ltr.css"]');
    const rtlLink = document.querySelector<HTMLLinkElement>('link[href*="bootstrap.rtl.css"]');

    if (ltrLink) ltrLink.disabled = isRtl;
    if (rtlLink) rtlLink.disabled = !isRtl;
  }
}
