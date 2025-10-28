import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, inject, HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '@proxy/forms/application';
import { CreateUpdateFormDto , FormDto } from '@proxy/forms/application/contracts/dtos';
import { editorLocalization, SurveyCreatorModel } from 'survey-creator-core';
import { SurveyCreatorModule } from 'survey-creator-angular';
import { LocalizationPipe, ConfigStateService, LocalizationService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { DirtyAware } from '../pending-changes.guard';
import { PersianCalendarComponent } from '../../shared/components/PersianCalendar/persian_calendar_widget';

import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
import "survey-creator-core/i18n/persian";
editorLocalization.currentLocale = "fa";
editorLocalization.locales["fa"].qt["persiancalendar"] = "تقویم شمسی";
// کلیدهای لوکالایزیشن در یک آبجکت واحد
const LK = {
  PublishConfirmTitle: 'RavinaFaradid::Forms:PublishConfirmTitle',
  PublishConfirmText:  'RavinaFaradid::Forms:PublishConfirmText',
  PublishConfirmBtn:   'RavinaFaradid::Forms:PublishConfirmBtn',
  Cancel:              'RavinaFaradid::Forms:Cancel',
  DraftSaved:          'RavinaFaradid::Forms:DraftSaved',
  SavedAndPublished:   'RavinaFaradid::Forms:SavedAndPublished',
  DefaultErrorMessage: 'RavinaFaradid::Forms:DefaultErrorMessage',
  ValidationError:     'RavinaFaradid::Forms:ValidationErrorMessage',
  UnsavedChanges:      'RavinaFaradid::Forms:UnsavedChanges',
  Saved:               'RavinaFaradid::Forms:Saved',
  RestoreDraftTitle:   'RavinaFaradid::Forms:RestoreDraftTitle',
  RestoreDraftText:    'RavinaFaradid::Forms:RestoreDraftText',   // مثال: "یک پیش‌نویس در {0} پیدا شد..."
  RestoreButton:       'RavinaFaradid::Forms:RestoreButton',
  DiscardButton:       'RavinaFaradid::Forms:DiscardButton',
  AutoSavedAt:         'RavinaFaradid::Forms:AutoSavedAt',
  SaveAndPublishBtn:   'RavinaFaradid::Forms:PublishConfirmBtn',
  SaveDraft:            'RavinaFaradid::Forms:SaveDraft'
} as const;

// ✅ ثابت‌ها برای ذخیرهٔ محلی
const DRAFT_KEY = 'form-create-draft';
const FORM_ID_KEY = 'form-create-formId';
const AUTO_SAVE_DELAY = 1200; // ms

@Component({
  selector: 'app-form-create',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SurveyCreatorModule, LocalizationPipe],
  templateUrl: './form-create.component.html',
  styleUrls: ['./form-create.component.scss']
})
export class FormCreateComponent implements OnInit, AfterViewInit, OnDestroy, DirtyAware {

  @ViewChild('creatorContainer') containerRef!: ElementRef<HTMLDivElement>;

  private fb = inject(FormBuilder);
  private router = inject(Router);
  private toaster = inject(ToasterService);
  private formService = inject(FormService);
  private configState = inject(ConfigStateService);
  private localization = inject(LocalizationService);

  // برای استفاده از کلیدها در template
  LK = LK;

  creator!: SurveyCreatorModel;
  dirty = false;

  private resizeObs?: ResizeObserver;
  private boundAdjustHeight = this.adjustHeight.bind(this);

  // نگهداری شناسه فرم (اول create، بعداً update)
  private formId: string | null = localStorage.getItem(FORM_ID_KEY);

  // فرم متادیتا
  metaForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(128)]],
    description: ['', [Validators.maxLength(1024)]],
    isActive: [true],
  });

  // میانبر ترجمه
  private l(key: string, ...args: any[]) {
    return this.localization.instant(key, ...args);
  }

  ngOnInit(): void {
    this.creator = new SurveyCreatorModel({
      showLogicTab: true,
      showThemeTab: true,
      showJSONEditorTab: true,
      isAutoSave: false,
    });

    (this.creator as any).showSaveButton = false;
    this.creator.onModified.add(() => { this.dirty = true; });

    const culture = this.configState.getOne('localization')?.currentCulture?.cultureName ?? 'en';
    if (culture?.toLowerCase().startsWith('fa') || culture?.toLowerCase().startsWith('ar')) {
      document.documentElement.setAttribute('dir', 'rtl');
    }

    // اگر کسی Save داخلی را زد → پیش‌نویس
    this.creator.saveSurveyFunc = (_saveNo: number, callback: Function) => {
      this.saveDraft().finally(() => callback(true));
    };

    this.creator.onModified.add(() => {
      this.dirty = true;
      this.scheduleAutoSave();  // ← اتوسیو
    });

    //this.loadDraftFromLocal();
     this.tryRestoreDraftFromLocal(); // 👈 بازیابی پیش‌نویس با تایید کاربر
  }

  ngAfterViewInit(): void {
    this.adjustHeight();
    this.resizeObs = new ResizeObserver(this.boundAdjustHeight);
    this.resizeObs.observe(document.body);
    window.addEventListener('resize', this.boundAdjustHeight);
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
    window.removeEventListener('resize', this.boundAdjustHeight);
    (this.creator as any)?.dispose?.();
  }

  hasUnsavedChanges(): boolean {
    return this.dirty || !!localStorage.getItem(DRAFT_KEY);
  }

  private adjustHeight() {
    const toolbar = document.querySelector('.lpx-toolbar') as HTMLElement | null;
    const headerH = toolbar?.offsetHeight ?? 64;
    const h = window.innerHeight - headerH - 8;
    if (this.containerRef?.nativeElement) {
      this.containerRef.nativeElement.style.height = `${h}px`;
    }
  }

  // ===== ذخیره‌ها =====
  async saveDraft() {
    await this.save('draft');
  }

  confirmPublish() {
    Swal.fire({
      title: this.l(LK.PublishConfirmTitle),
      text:  this.l(LK.PublishConfirmText),
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: this.l(LK.PublishConfirmBtn),
      cancelButtonText:  this.l(LK.Cancel),
      reverseButtons: true
    }).then(async res => {
      if (res.isConfirmed) {
        await this.saveAndPublish();
      }
    });
  }

  private buildDtoFor(mode: 'draft' | 'publish'): CreateUpdateFormDto {
    const json = (this.creator as any)?.JSON ?? {};
    const theme = (this.creator as any)?.theme ?? (this.creator as any)?.themeEditorModel?.themeJson ?? {};

    return {
      title: json.title,
      description:json.description,
      // در Draft مقدار فعلی فرم را دست‌نخورده می‌گذاریم؛ در Publish می‌توانی true کنی (بسته به بک‌اند)
      isActive: mode === 'publish',
      isDeleted:false,
      jsonDefinition: JSON.stringify(json),
      themeDefinition: JSON.stringify(theme),
      isAnonymousAllowed: false
    } as CreateUpdateFormDto;
  }

async saveAndPublish() {

  try {
    // 1) اگر هنوز formId نداریم، اول فرم را بسازیم تا Id بگیریم
    if (!this.formId) {
      const json = (this.creator as any)?.JSON ?? {};
      const metaDto = {
        title: json.title ?? '',
        description: json.description ?? ''
      } as CreateUpdateFormDto;
      const created = await firstValueFrom(
        this.formService.create(metaDto, { apiName: 'default' })
      );
      this.formId = created.id;
      localStorage.setItem(FORM_ID_KEY, this.formId!);
    }

    // 2) ساخت payload از وضعیت فعلی Designer
    // const payload: CreateUpdateFormDto = {
    //   jsonDefinition: JSON.stringify((this.creator as any)?.JSON ?? {}),
    //   themeDefinition: JSON.stringify(
    //     (this.creator as any)?.theme ??
    //     (this.creator as any)?.themeEditorModel?.themeJson ?? {}
    //   ),
    //   title: (this.creator as any).Title,
    //   isActive: true,
    //   isAnonymousAllowed: false,
    //   isDeleted: false
    // };

     const dto = this.buildDtoFor('publish');

    // 3) فراخوانی سرویس انتشار واحد
    await firstValueFrom(
      this.formService.saveAndPublish(this.formId!, dto, { apiName: 'default' })
    );

    // 4) موفقیت: پاک‌سازی و هدایت
    this.dirty = false;
    this.clearDraft();
    localStorage.removeItem(FORM_ID_KEY);
    this.toaster.success(this.l('Forms:SavedAndPublished')); // یا pipe abpLocalization
    this.router.navigateByUrl('/forms/list');
  } catch (err: any) {
    const msg =
      err?.error?.error?.message ?? err?.message ?? this.l('Forms:DefaultErrorMessage');
    this.toaster.error(msg);
  } finally {
    this.dirty = false;
  }
}

  private save(mode: 'draft' | 'publish'): Promise<void> {
    return new Promise((resolve, reject) => {
      const surveyJson = (this.creator as any)?.JSON ?? {};
      const themeJson =
        (this.creator as any)?.theme ??
        (this.creator as any)?.themeEditorModel?.themeJson ??
        {};

      const dto: CreateUpdateFormDto = {
        title: surveyJson.title ?? '',
        description: surveyJson.description ?? '',
        isActive: mode === 'publish', // Draft=false, Publish=true
        jsonDefinition: JSON.stringify(surveyJson),
        themeDefinition: JSON.stringify(themeJson),
        isAnonymousAllowed: false
      } as CreateUpdateFormDto;

      const onSuccess = (result: FormDto) => {
        if (!this.formId && result?.id) {
          this.formId = result.id as any;
          this.dirty = true;
          localStorage.setItem(FORM_ID_KEY, this.formId);
        }
        this.dirty = true;
        this.clearDraft();

        const msg = mode === 'publish' ? this.l(LK.SavedAndPublished) : this.l(LK.DraftSaved);
        this.toaster.success(msg);

        if (mode === 'publish') {
          localStorage.removeItem(FORM_ID_KEY);
          this.router.navigateByUrl('/forms/list');
        }
        resolve();
      };

      const onError = (err: any) => {
        console.error(err);
        const msg = err?.error?.error?.message ?? err?.message ?? this.l(LK.DefaultErrorMessage);
        this.toaster.error(msg);
        this.dirty = false;
        reject(err);
      };

      if (!this.formId) {
        this.formService.create(dto, { apiName: 'default' }).subscribe({ next: onSuccess, error: onError });
      } else {
        this.formService.update(this.formId, dto, { apiName: 'default' }).subscribe({ next: onSuccess, error: onError });
      }
    });
  }

private autoSaveTimer: any = null;

private scheduleAutoSave(): void {
  clearTimeout(this.autoSaveTimer);
  this.autoSaveTimer = setTimeout(() => this.saveDraftToLocalSilent(), AUTO_SAVE_DELAY);
}

private saveDraftToLocalSilent(): void {
  try {
    const draft = {
      meta: this.metaForm.value,
      json: (this.creator as any)?.JSON,
      theme:
        (this.creator as any)?.theme ??
        (this.creator as any)?.themeEditorModel?.themeJson,
      lastSavedAt: new Date().toISOString()
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch (e) {
    console.warn('Local draft save failed:', e);
  }
}

saveDraftToLocal(): void {
  const draft = {
    meta: this.metaForm.value,
    json: (this.creator as any)?.JSON,
    theme:
      (this.creator as any)?.theme ??
      (this.creator as any)?.themeEditorModel?.themeJson,
    lastSavedAt: new Date().toISOString()
  };
  localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  this.toaster.info(this.l(LK.DraftSaved)); // ✅ پیام چندزبانه
}


// ✅ چندزبانه
private tryRestoreDraftFromLocal(): void {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return;

  let when = '';
  try {
    const { lastSavedAt } = JSON.parse(raw);
    if (lastSavedAt) {
      // فرمت تاریخ براساس فرهنگ جاری
      const culture = this.configState.getOne('localization')?.currentCulture?.cultureName ?? 'en';
      when = new Date(lastSavedAt).toLocaleString(culture);
    }
  } catch { /* ignore */ }

  Swal.fire({
    title: this.l(LK.RestoreDraftTitle),
    text:  when ? this.l(LK.RestoreDraftText, when) : this.l(LK.RestoreDraftText, ''),
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: this.l(LK.RestoreButton),
    cancelButtonText:  this.l(LK.DiscardButton),
    reverseButtons: true
  }).then(res => {
    if (res.isConfirmed) {
      this.loadDraftFromLocal();
    } else {
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem(FORM_ID_KEY);
    }
  });
}

  loadDraftFromLocal(): void {
  const raw = localStorage.getItem(DRAFT_KEY);
  if (!raw) return;
  try {
    const draft = JSON.parse(raw);
    this.metaForm.patchValue(draft.meta ?? {});
    if (draft.json) (this.creator as any).JSON = draft.json;
    if (draft.theme) {
      if ((this.creator as any).theme !== undefined) {
        (this.creator as any).theme = draft.theme;
      } else if ((this.creator as any).themeEditorModel?.themeJson !== undefined) {
        (this.creator as any).themeEditorModel.themeJson = draft.theme;
      }
    }
    this.dirty = true;
  } catch { /* ignore */ }
}




clearDraft(): void {
  localStorage.removeItem(DRAFT_KEY);
}

  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }

  // Ctrl+S = Draft, Ctrl+Shift+S = Publish
  @HostListener('window:keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    const key = e.key?.toLowerCase();
    if (e.ctrlKey && key === 's' && !e.shiftKey) {
      e.preventDefault();
      this.saveDraft();
    }
    if (e.ctrlKey && e.shiftKey && key === 's') {
      e.preventDefault();
      this.confirmPublish();
    }
  }
}
