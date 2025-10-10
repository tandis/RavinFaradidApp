import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormService } from '@proxy/forms/application';
import { FormDto } from '@proxy/forms/application/contracts/dtos';
import { PagedAndSortedResultRequestDto } from '@abp/ng.core';
import { LocalizationPipe } from '@abp/ng.core';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';

@Component({
  selector: 'app-form-list',
  standalone: true,
  imports: [CommonModule, LocalizationPipe, NgxDatatableModule],
  templateUrl: './form-list.component.html',
  styleUrls: ['./form-list.component.scss']
})
export class FormListComponent implements OnInit {
  forms: FormDto[] = [];
  loading = false;

  // تنظیمات جدول
  columns = [
    { prop: 'title', name: 'Forms::Title' },
    { prop: 'description', name: 'Forms::Description' },
    { prop: 'isActive', name: 'Forms::Active' },
    { name: 'Forms::Operations' }
  ];

  constructor(private formService: FormService, private router: Router) {}

  ngOnInit() {
    this.load();
    console.log(LocalizationPipe)
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

  remove(id: string) {
    if (confirm($localize`:@@Forms:ConfirmDelete:Are you sure?`)) {
      this.formService.delete(id).subscribe(() => this.load());
    }
  }
}
