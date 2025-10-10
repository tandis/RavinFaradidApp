import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LocalizationService } from '@abp/ng.core';

@Injectable({ providedIn: 'root' })
export class LeptonXRtlService {
  constructor(
    @Inject(DOCUMENT) private doc: Document,
    private l10n: LocalizationService
  ) {}

  init(): void {
    // مقدار اولیه از سرویس یا fallback
    const initialLang = this.getCurrentLang();
    console.log({initialLang})
    this.applyRtl(initialLang);

    // واکنش به تغییر زبان در runtime
    this.l10n.languageChange$.subscribe(lang => {
      const code = lang || lang || 'en';
      this.applyRtl(code);
    });
  }

  private applyRtl(lang: string) {
    const isFa = lang?.toLowerCase().startsWith('fa');

    // lang روی html ست بشه
    this.doc.documentElement.setAttribute('lang', lang);

    // کلاس rtl برای فعال کردن RTL در LeptonX
    if (isFa) {
      //this.doc.documentElement.classList.add('translate-rtl');
      this.doc.documentElement.dir = "rtl";
      this.doc.body.dir = "rtl"
    } else {
      this.doc.documentElement.classList.remove('rtl');
      this.doc.documentElement.dir = "ltr";
      this.doc.body.dir = "ltr"
    }
  }

  private getCurrentLang(): string {
    // ۱) از سرویس ABP
    const svcLang = this.l10n.currentLang || this.l10n.currentLang;
    if (svcLang) return svcLang;

    // ۲) از html lang
    const htmlLang = this.doc?.documentElement?.lang;
    if (htmlLang) return htmlLang;

    // ۳) از کوکی .AspNetCore.Culture
    const cookie = this.readCultureCookie();
    if (cookie) return cookie;

    return 'en';
  }

  private readCultureCookie(): string | null {
    const name = '.AspNetCore.Culture=';
    const hit = (this.doc.cookie || '')
      .split(';')
      .map(x => x.trim())
      .find(p => p.startsWith(name));
    if (!hit) return null;

    const raw = decodeURIComponent(hit.substring(name.length));
    const m = /uic=([^|;]+)/i.exec(raw) || /c=([^|;]+)/i.exec(raw);
    return m ? m[1] : null;
  }
}
