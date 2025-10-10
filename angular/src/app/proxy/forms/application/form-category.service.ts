import type { CreateUpdateFormCategoryDto, FormCategoryDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormCategoryService {
  apiName = 'Default';
  

  create = (input: CreateUpdateFormCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormCategoryDto>({
      method: 'POST',
      url: '/api/app/form-category',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/form-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormCategoryDto>({
      method: 'GET',
      url: `/api/app/form-category/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<FormCategoryDto>>({
      method: 'GET',
      url: '/api/app/form-category',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateFormCategoryDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormCategoryDto>({
      method: 'PUT',
      url: `/api/app/form-category/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
