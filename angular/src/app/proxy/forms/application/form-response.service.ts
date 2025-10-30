import type { CreateFormResponseDto, FormResponseDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormResponseService {
  apiName = 'Default';
  

  create = (input: CreateFormResponseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormResponseDto>({
      method: 'POST',
      url: '/api/app/form-response',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/form-response/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormResponseDto>({
      method: 'GET',
      url: `/api/app/form-response/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getByLatestPublished = (formId: string, input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<FormResponseDto>>({
      method: 'GET',
      url: `/api/app/form-response/by-latest-published/${formId}`,
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<FormResponseDto>>({
      method: 'GET',
      url: '/api/app/form-response',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateFormResponseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormResponseDto>({
      method: 'PUT',
      url: `/api/app/form-response/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
