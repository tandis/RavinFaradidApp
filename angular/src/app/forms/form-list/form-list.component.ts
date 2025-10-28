import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormService } from '@proxy/forms/application';
import { FormDto } from '@proxy/forms/application/contracts/dtos';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { LocalizationPipe } from '@abp/ng.core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgbModal,NgbDropdownModule  } from '@ng-bootstrap/ng-bootstrap';
import { PermissionsPageComponent } from 'src/app/features/forms-permissions/permissions-page/permissions-page.component';
import { QRCodeComponent  } from 'angularx-qrcode';

@Component({
  selector: 'app-form-list',
  standalone: true,
  imports: [CommonModule, LocalizationPipe, NgxDatatableModule,NgbDropdownModule,QRCodeComponent ],
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {
  @ViewChild('shareTpl') shareTpl!: TemplateRef<any>;
  forms: FormDto[] = [];
  loading = false;
  shareLink = '';
  shareFileNamePart = '';        // برای نام فایل خروجی QR
  qrPngDataUrl: string | null = null;  // از angularx-qrcode می‌گیریم
  // تنظیمات جدول
  columns = [
    { prop: 'title', name: 'Forms::Title' },
    { prop: 'description', name: 'Forms::Description' },
    { prop: 'isActive', name: 'Forms::Active' },
    { name: 'Forms::Operations' }
  ];

  constructor(private formService: FormService,
    private modal: NgbModal,
    private router: Router) {}

  ngOnInit() {
    this.load();
    console.log(LocalizationPipe)
  }

  openPermissionsModal(form: FormDto, preselect?: { type: 'user'|'role'|'anonymous'; id?: string; name?: string }) {
  const ref = this.modal.open(PermissionsPageComponent, {
    size: 'lg', centered: true, backdrop: 'static', keyboard: false
  });
  ref.componentInstance.formId = form.id;
 if (preselect) ref.componentInstance.initialPrincipal = preselect;
}

  load() {
    this.loading = true;
    const request: PagedAndSortedResultRequestDto = {
      maxResultCount: 10,
      skipCount: 0,
      sorting: ''
    };

    this.formService.getList(request).subscribe({
      next: res => {
        this.forms = res.items;
        this.loading = false;
      },
      error: () => (this.loading = false)
    });
  }

  create() {
    this.router.navigate(['/forms/create']);
  }

  edit(id: string) {
    this.router.navigate(['/forms/edit', id]);
  }

  view(id: string) {
    this.router.navigate(['/forms/view', id]);
  }

   /** ✅ نمایش داده‌های ذخیره‌شده (Responses/List) */
  viewResponses(id: string) {
    // مسیر پیشنهادی؛ اگر route دیگری داری، جایگزین کن
    this.router.navigate(['/forms/viewresponse', id]);
  }

  /** ✅ داشبورد نموداری فرم */
  openDashboard(id: string) {
    // مسیر پیشنهادی؛ اگر route دیگری داری، جایگزین کن
    this.router.navigate(['/forms', id, 'dashboard']);
  }

  /** ✅ اشتراک‌گذاری فرم (لینک عمومی) */
  share(form: FormDto) {
    // اگر اسلاگ داری، به‌جای id از slug استفاده کن
    const slug = (form as any)?.slug as string | undefined;
    const publicPath = `/forms/public/${slug ?? form.id}`;
    const origin = (typeof window !== 'undefined' && window.location?.origin) ? window.location.origin : '';
    this.shareLink = origin ? new URL(publicPath, origin).toString() : publicPath;
    this.shareFileNamePart = slug ?? form.id;
    this.qrPngDataUrl = null; // هر بار ریست می‌کنیم (تا رویداد جدید بگیریم)
    this.modal.open(this.shareTpl, { centered: true, size: 'sm' });
  }

  copyShareLink(input: HTMLInputElement) {
    input.select();
    // ساده‌ترین روش بدون وابستگی: Clipboard API
    navigator.clipboard?.writeText(this.shareLink);
  }

  remove(id: string) {
    if (confirm($localize`:@@Forms:ConfirmDelete:Are you sure?`)) {
      this.formService.delete(id).subscribe(() => this.load());
    }
  }
}
