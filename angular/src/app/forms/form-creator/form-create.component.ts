import {
  Component, OnInit, AfterViewInit, OnDestroy,
  ViewChild, ElementRef, inject, effect, computed,
  HostListener
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormService } from '@proxy/forms/application';
import { CreateUpdateFormDto , FormDto} from '@proxy/forms/application/contracts/dtos';
import { SurveyCreatorModel } from 'survey-creator-core';
import { SurveyCreatorModule } from 'survey-creator-angular';
import { LocalizationPipe, PermissionDirective, ConfigStateService } from '@abp/ng.core';
import { ToasterService } from '@abp/ng.theme.shared';
import { DirtyAware } from '../pending-changes.guard';

@Component({
  selector: 'app-form-create',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SurveyCreatorModule, // <survey-creator>
    LocalizationPipe
],
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
  private syncing = false;
  private get survey(): any {
    return (this.creator as any)?.survey;
  }

  creator!: SurveyCreatorModel;
  dirty = false;
  private resizeObs?: ResizeObserver;

  // فرم متادیتا (عنوان و توضیح)
  metaForm = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(128)]],
    description: ['', [Validators.maxLength(1024)]],
    isActive: [true],
  });

  ngOnInit(): void {
    // گزینه‌های Creator
    this.creator = new SurveyCreatorModel({
      showLogicTab: true,
      showThemeTab: true,
      // ابزارهای متداول:
      showJSONEditorTab: true,
      isAutoSave: false,

    });

    // تغییرات باعث Dirty شود
    this.creator.onModified.add(() => { this.dirty = true; });

    this.loadDraftFromLocal();
    // اگر RTL لازم است، سمت HTML dir را رعایت کردید؛ Creator خودش با CSS کار می‌کند.
    const culture = this.configState.getOne('localization')?.currentCulture?.cultureName ?? 'en';
    if (culture?.toLowerCase().startsWith('fa') || culture?.toLowerCase().startsWith('ar')) {
      document.documentElement.setAttribute('dir', 'rtl');
    }

    this.creator.saveSurveyFunc = (saveNo: number, callback: Function) => {
      console.log("form save")
      this.save();
    }
  }

  ngAfterViewInit(): void {
    // ارتفاع داینامیک (سازگار با LeptonX toolbar)
    const adjustHeight = () => {
      const toolbar = document.querySelector('.lpx-toolbar') as HTMLElement | null;
      const headerH = toolbar?.offsetHeight ?? 64;
      const h = window.innerHeight - headerH - 8;
      if (this.containerRef?.nativeElement) {
        this.containerRef.nativeElement.style.height = `${h}px`;
      }
    };
    adjustHeight();

    // واکنش به تغییر اندازه
    this.resizeObs = new ResizeObserver(adjustHeight);
    this.resizeObs.observe(document.body);
    window.addEventListener('resize', adjustHeight);
  }

  ngOnDestroy(): void {
    this.resizeObs?.disconnect();
    window.removeEventListener('resize', this.adjustHeight);
    // Survey Creator دیسپوز
    (this.creator as any)?.dispose?.();
  }

   hasUnsavedChanges(): boolean {
    return this.dirty || !!localStorage.getItem('form-create-draft');
  }

  private adjustHeight() {
    const toolbar = document.querySelector('.lpx-toolbar') as HTMLElement | null;
    const headerH = toolbar?.offsetHeight ?? 64;
    const h = window.innerHeight - headerH - 8;
    if (this.containerRef?.nativeElement) {
      this.containerRef.nativeElement.style.height = `${h}px`;
    }
  }

  save(): void {
  //  if (this.metaForm.invalid) {
  //     this.metaForm.markAllAsTouched();
  //     this.toaster.error('Forms:ValidationErrorMessage');
  //     return;
  //   }

    // تهیه JSON فرم از Creator
    const surveyJson = (this.creator as any)?.JSON ?? {};
    // تم: API رسمی برای استخراج تم بسته به نسخه متفاوت است؛ برای سازگاری، به صورت محافظه‌کار:
    const themeJson = (this.creator as any)?.theme ?? (this.creator as any)?.themeEditorModel?.themeJson ?? {};

    const value = this.metaForm.value;

    const surveyTitle = surveyJson.title ?? '';
    const surveyDescription = surveyJson.description ?? '';

    const dto: CreateUpdateFormDto = {
      title: surveyTitle,                         // فیلدها را مطابق DTO خودت چک کن
      description: surveyDescription ?? '',
      isActive: this.metaForm.value.isActive ?? true,
      jsonDefinition: JSON.stringify(surveyJson),
      themeDefinition: JSON.stringify(themeJson),
      isAnonymousAllowed: false
    } as CreateUpdateFormDto;

    // اگر apiName پیش‌فرضت 'default' است و سرویس 'Default' می‌خواهد، این گزینه را بده:
    this.formService.create(dto, { apiName: 'default' }).subscribe({
      next: (created: FormDto) => {
        this.dirty = false;
        this.clearDraft();
        this.toaster.success('Forms:SavedSuccessfully');
        this.router.navigateByUrl('/forms/list');
      },
      error: (err) => {
        console.error(err);
        // تلاش برای نمایش پیام خطای سرور
        const msg = err?.error?.error?.message ?? err?.message ?? 'Forms:DefaultErrorMessage';
        this.toaster.error(msg);
      }
    });
  }

  // ذخیرهٔ محلی (AutoSave سفارشی اختیاری)
  saveDraftToLocal(): void {
    const draft = {
      meta: this.metaForm.value,
      json: this.creator.JSON,
      theme: this.creator.theme
    };
    localStorage.setItem('form-create-draft', JSON.stringify(draft));
    this.toaster.info('Forms:SavedSuccessfully'); // یا Forms:DraftSaved
  }

  loadDraftFromLocal(): void {
    const raw = localStorage.getItem('form-create-draft');
    if (!raw) return;
    const draft = JSON.parse(raw);
    this.metaForm.patchValue(draft.meta ?? {});
    if (draft.json) this.creator.JSON = draft.json;
    if (draft.theme) this.creator.theme = draft.theme;
    this.dirty = true;
  }

  clearDraft(): void {
    localStorage.removeItem('form-create-draft');
  }

  // هشدار بستن تب مرورگر در صورت تغییرات ذخیره‌نشده
  @HostListener('window:beforeunload', ['$event'])
  beforeUnloadHandler(event: BeforeUnloadEvent) {
    if (this.hasUnsavedChanges()) {
      event.preventDefault();
      event.returnValue = '';
    }
  }
}
