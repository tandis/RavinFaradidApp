import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { LocalizationService } from '@abp/ng.core';

@Injectable({ providedIn: 'root' })
export class RtlService {
  constructor(
    private l10n: LocalizationService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  init(): void {
    // مقدار اولیه
    const initialLang = this.l10n.currentLang;
    this.applyDirection(this.isRtlLang(initialLang));

    // واکنش به تغییر زبان
    this.l10n.languageChange$.subscribe(lang => {
      const isRtl = this.isRtlLang(lang ?? lang);
      this.applyDirection(isRtl);
    });
  }

  private isRtlLang(code?: string): boolean {
    if (!code) return false;
    const lc = code.toLowerCase();
    return lc.startsWith('fa') || lc.startsWith('ar') || lc.startsWith('he') || lc.startsWith('ur');
  }

  private applyDirection(isRtl: boolean) {
    this.doc.documentElement.setAttribute('dir', isRtl ? 'rtl' : 'ltr');
    this.doc.body?.setAttribute('dir', isRtl ? 'rtl' : 'ltr');

    // تغییر href لینک‌های موجود (بر اساس id)
    this.updateHref('bootstrap-dim', 'bootstrap-dim', isRtl);
    this.updateHref('font-bundle', 'font-bundle', isRtl);
    this.updateHref('layout-bundle', 'layout-bundle', isRtl);
    this.updateHref('abp-bundle', 'abp-bundle', isRtl);
  }

  private updateHref(id: string, base: string, isRtl: boolean) {
    const link = this.doc.getElementById(id) as HTMLLinkElement | null;
    if (link) {
      link.href = isRtl ? `${base}.rtl.css` : `${base}.css`;
    }
  }
}
