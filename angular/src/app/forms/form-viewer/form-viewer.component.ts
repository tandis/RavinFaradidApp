import { Component, OnDestroy, OnInit, Optional, Inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyModule } from 'survey-angular-ui';
import { Model } from 'survey-core';
import "survey-creator-core/i18n/persian";

import { Subject, switchMap, takeUntil, of, tap, catchError, map } from 'rxjs';
import { RestService, Rest } from '@abp/ng.core';

import { FormService } from '@proxy/forms/application/form.service';
import { FormResponseService } from '@proxy/forms/application/form-response.service';

// ⬅️ مسیر ایمپورت را با پروژه‌ی خودت تنظیم کن
import type { FormDto, FormVersionDto /* , CreateFormResponseDto */ } from '@proxy/forms/application/contracts/dtos/models';

interface FormViewDto {
  id: string;
  title: string;
  description?: string | null;
  isActive: boolean;
  isPublished: boolean;
  publishedVersion?: {
    id?: string;
    version?: number;
    schemaJson: any;
    updatedAt?: string;
  } | null;
}

@Component({
  selector: 'app-form-viewer',
  standalone: true,
  imports: [CommonModule, SurveyModule],
  templateUrl: './form-viewer.component.html',
  styleUrls: ['./form-viewer.component.css']
})
export class FormViewerComponent implements OnInit, OnDestroy {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forms: FormService,
    private responses: FormResponseService,
    private rest: RestService,
    @Optional() @Inject('API_BASE_URL') private baseUrl?: string
  ) {}

  private destroy$ = new Subject<void>();

  form = signal<FormViewDto | null>(null);
  surveyModel = signal<Model | null>(null);
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  dir = computed<'rtl' | 'ltr'>(() => 'rtl');

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
          // ✅ اینجا نوع FormDto استفاده می‌شود تا با خروجی پروکسی هم‌خوان باشد
          return this.forms.get(id).pipe(
            switchMap((formDto: FormDto) => this.buildViewFromForm(formDto)),
            tap(view => view && this.initializeSurvey(view)),
            catchError(err => {
              console.error('Load form error', err);
              this.error.set('خطا در بارگذاری فرم.');
              return of(null);
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe(() => this.loading.set(false));
  }

  /** از FormDto نسخهٔ منتشرشده را می‌خوانیم و FormViewDto می‌سازیم */
  private buildViewFromForm(form: FormDto) {
    if (!form) return of(null);

    const isPublished = !!form.publishedVersionId;
    const base: FormViewDto = {
      id: form.id,
      title: form.title ?? 'بدون عنوان',
      description: (form as any).description ?? null, // اگر در FormDto description تعریف شده، مستقیم استفاده کن
      isActive: (form as any).isActive ?? true,
      isPublished,
      publishedVersion: null
    };

    if (!isPublished || !form.publishedVersionId) {
      return of(base);
    }

    // نسخهٔ منتشرشده را با ID بخوان
    return this.getFormVersionById(form.publishedVersionId).pipe(
      map((ver: FormVersionDto | null) => {
        if (!ver) return base;
        const updatedAt =
          (ver as any).lastModificationTime ||
          (ver as any).creationTime ||
          undefined;

        return {
          ...base,
          publishedVersion: {
            id: ver.id,
            version: (ver as any).version,
            updatedAt,
            schemaJson: this.ensureObject((ver as any).jsonDefinition)
          }
        } as FormViewDto;
      }),
      catchError(err => {
        console.error('Load version error', err);
        return of(base);
      })
    );
  }

  private getFormVersionById(versionId: string) {
    // ✅ خروجی را FormVersionDto تایپ کن
    return this.rest.request<any, FormVersionDto>(
      { method: 'GET', url: `/api/app/form-version/${versionId}` },
      { apiName: 'Default' } as Partial<Rest.Config>
    );
  }

  private ensureObject(jsonMaybe: any): any {
    if (!jsonMaybe) return null;
    if (typeof jsonMaybe === 'string') {
      try { return JSON.parse(jsonMaybe); } catch { return null; }
    }
    return jsonMaybe;
  }

  private initializeSurvey(view: FormViewDto | null) {
    if (!view) return;
    this.form.set(view);

    if (!view.isPublished || !view.publishedVersion?.schemaJson) {
      this.error.set('این فرم هنوز منتشر نشده یا اسکیمای معتبر ندارد.');
      this.surveyModel.set(null);
      return;
    }

    const model = new Model(view.publishedVersion.schemaJson);
    model.locale = 'fa';
    (model as any).rtl = true;

    model.onComplete.add((sender) => {
      const f = this.form();
      if (!f) return;

      // اگر نوع دقیق CreateFormResponseDto را داری، از آن استفاده کن
      // const payload: CreateFormResponseDto = { formId: f.id, versionId: f.publishedVersion?.id!, answers: sender.data };
      const payload: any = { formId: f.id, versionId: f.publishedVersion?.id, answers: sender.data };

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
            this.error.set('در ارسال پاسخ مشکلی پیش آمد.');
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
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => window.history.back());
    } else {
      this.router.navigate(['/forms']);
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
