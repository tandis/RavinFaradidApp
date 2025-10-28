import { Component, OnDestroy, OnInit, Optional, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyModule } from 'survey-angular-ui';
import { Model, surveyLocalization } from 'survey-core';
//import "survey-creator-core/i18n/persian";
import "survey-core/survey.i18n";
import { Subject, switchMap, takeUntil, of, tap, catchError, map } from 'rxjs';
import { RestService, Rest } from '@abp/ng.core';

import { FormService } from '@proxy/forms/application/form.service';
import { FormResponseService } from '@proxy/forms/application/form-response.service';

// ⬅️ مسیر ایمپورت را با پروژه‌ی خودت تنظیم کن
import type { FormDto, FormVersionDto /* , CreateFormResponseDto */ } from '@proxy/forms/application/contracts/dtos/models';
surveyLocalization.locales["fa"];
interface FormViewerVersionDto {
  id: string;
  versionNumber: number;
  publishedAt?: string | null;
  schemaJson: any;     // JSON پارس‌شده SurveyJS
  themeJson?: any;
}

interface FormViewerDto {
  formId: string;
  title: string;
  description?: string | null;
  isActive: boolean;
  isAnonymousAllowed: boolean;
  publishedVersion: FormViewerVersionDto | null;
}

@Component({
  selector: 'app-form-viewer',
  standalone: true,
  imports: [CommonModule, SurveyModule],
  templateUrl: './form-viewer.component.html',
  styleUrls: ['./form-viewer.component.scss']
})
export class FormViewerComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject<void>();

  // state
  loading = signal<boolean>(false);
  error = signal<string | null>(null);
  view  = signal<FormViewerDto | null>(null);
  surveyModel = signal<Model | null>(null);

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private rest: RestService,
    private responses: FormResponseService
  ) {}

  ngOnInit(): void {
    this.loading.set(true);

    this.route.paramMap
      .pipe(
        switchMap(pm => {
          const id = pm.get('id') || pm.get('formId');
          if (!id) {
            this.error.set('شناسه فرم در مسیر یافت نشد.');
            return of(null);
          }

          // اگر پروکسی getViewer را ساختی، می‌توانی این را جایگزین کنی:
          // return this.forms.getViewer(id)
          return this.rest.request<any, FormViewerDto>(
            { method: 'GET', url: `/api/app/form/${id}/viewer` },
            { apiName: 'Default' } as Partial<Rest.Config>
          ).pipe(
            tap(dto => dto && this.initialize(dto)),
            catchError(err => {
              console.error('Load viewer error', err);
              this.error.set(err?.error?.message ?? 'خطا در بارگذاری فرم.');
              return of(null);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.loading.set(false));
  }

  /** آماده‌سازی مدل SurveyJS و اتصال ثبت پاسخ */
  private initialize(dto: FormViewerDto) {
    this.view.set(dto);

    if (!dto.isActive) {
      this.error.set('این فرم غیرفعال است.');
      this.surveyModel.set(null);
      return;
    }

    if (!dto.publishedVersion?.schemaJson) {
      this.error.set('نسخهٔ منتشرشده برای این فرم در دسترس نیست.');
      this.surveyModel.set(null);
      return;
    }

    const model = new Model(dto.publishedVersion.schemaJson);
    model.locale = 'fa' as any;
    (model as any).rtl = true;

    model.onComplete.add((sender) => {
      const v = this.view();
      if (!v?.publishedVersion?.id) return;

      // اگر CreateFormResponseDto را داری، به همان تایپ تغییر بده
      const payload: any /* CreateFormResponseDto */ = {
        formId: v.formId,
        formVersionId: v.publishedVersion.id,
        // با توجه به اسکیمای DB (ResponseData NVARCHAR(MAX) + CHECK isjson) بهتره string بفرستیم
        responseData: JSON.stringify(sender.data)
      };
console.log(payload)
      this.loading.set(true);
      this.responses.create(payload)
        .pipe(
          tap(() => {
            this.loading.set(false);
            alert('پاسخ شما با موفقیت ثبت شد.');
          }),
          catchError(err => {
            console.error('Submit error', err);
            this.loading.set(false);
            this.error.set(err?.error?.message ?? 'در ارسال پاسخ مشکلی پیش آمد.');
            return of(null);
          }),
          takeUntil(this.destroy$)
        )
        .subscribe();
    });

    this.surveyModel.set(model);
  }

  onCancel() {
    if (window.history.length > 1) {
      this.router.navigateByUrl('/', { skipLocationChange: true })
        .then(() => window.history.back());
    } else {
      this.router.navigate(['/forms']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
