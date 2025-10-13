import type { CreateUpdateFormDto, FormDto, FormVersionDto, FormViewerDto } from './contracts/dtos/models';
import { RestService, Rest } from '@abp/ng.core';
import type { PagedAndSortedResultRequestDto, PagedResultDto } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  apiName = 'Default';
  

  archiveVersion = (formId: string, versionId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormVersionDto>({
      method: 'POST',
      url: '/api/app/form/archive-version',
      params: { formId, versionId },
    },
    { apiName: this.apiName,...config });
  

  create = (input: CreateUpdateFormDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormDto>({
      method: 'POST',
      url: '/api/app/form',
      body: input,
    },
    { apiName: this.apiName,...config });
  

  createNewVersion = (formId: string, jsonDefinition: string, themeDefinition?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormVersionDto>({
      method: 'POST',
      url: `/api/app/form/new-version/${formId}`,
      params: { jsonDefinition, themeDefinition },
    },
    { apiName: this.apiName,...config });
  

  createNextVersion = (formId: string, jsonDefinition: string, themeDefinition?: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormVersionDto>({
      method: 'POST',
      url: `/api/app/form/next-version/${formId}`,
      params: { jsonDefinition, themeDefinition },
    },
    { apiName: this.apiName,...config });
  

  delete = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'DELETE',
      url: `/api/app/form/${id}`,
    },
    { apiName: this.apiName,...config });
  

  get = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormDto>({
      method: 'GET',
      url: `/api/app/form/${id}`,
    },
    { apiName: this.apiName,...config });
  

  getList = (input: PagedAndSortedResultRequestDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, PagedResultDto<FormDto>>({
      method: 'GET',
      url: '/api/app/form',
      params: { sorting: input.sorting, skipCount: input.skipCount, maxResultCount: input.maxResultCount },
    },
    { apiName: this.apiName,...config });
  

  getPublishedVersion = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormVersionDto>({
      method: 'GET',
      url: `/api/app/form/${id}/published-version`,
    },
    { apiName: this.apiName,...config });
  

  getViewer = (id: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormViewerDto>({
      method: 'GET',
      url: `/api/app/form/${id}/viewer`,
    },
    { apiName: this.apiName,...config });
  

  publishVersion = (formId: string, versionId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormVersionDto>({
      method: 'POST',
      url: '/api/app/form/publish-version',
      params: { formId, versionId },
    },
    { apiName: this.apiName,...config });
  

  unpublishCurrentVersion = (formId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormVersionDto>({
      method: 'POST',
      url: `/api/app/form/unpublish-current-version/${formId}`,
    },
    { apiName: this.apiName,...config });
  

  update = (id: string, input: CreateUpdateFormDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormDto>({
      method: 'PUT',
      url: `/api/app/form/${id}`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
