import type { CreateUpdateFormTemplateDto, FormDto, FormTemplateDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormTemplateService {
  apiName = 'Default';
  

  create = (input: CreateUpdateFormTemplateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormTemplateDto>({
      method: 'POST',
      url: '/api/app/form-template',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createFormFromTemplate = (templateId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormDto>({
      method: 'POST',
      url: `/api/app/form-template/form-from-template/${templateId}`,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/form-template/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormTemplateDto>({
      method: 'GET',
      url: `/api/app/form-template/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<FormTemplateDto>>({
      method: 'GET',
      url: '/api/app/form-template',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateFormTemplateDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormTemplateDto>({
      method: 'PUT',
      url: `/api/app/form-template/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
