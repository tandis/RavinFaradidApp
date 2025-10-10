import type { CreateFormResponseDto, FormResponseDto } from './application/contracts/dtos/models';
import type { FormAssignment } from './domain/entities/models';
import { RestService, Rest } from '@abp/ng.core';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  apiName = 'Default';
  

  assign = (formId: string, input: FormAssignment, config?: Partial<Rest.Config>) =>
    this.restService.request<any, void>({
      method: 'POST',
      url: `/api/app/forms/${formId}/assign`,
      body: input,
    },
    { apiName: this.apiName,...config });
  

  getStats = (formId: string, config?: Partial<Rest.Config>) =>
    this.restService.request<any, object>({
      method: 'GET',
      url: `/api/app/forms/${formId}/stats`,
    },
    { apiName: this.apiName,...config });
  

  submitResponse = (formId: string, input: CreateFormResponseDto, config?: Partial<Rest.Config>) =>
    this.restService.request<any, FormResponseDto>({
      method: 'POST',
      url: `/api/app/forms/${formId}/submit-response`,
      body: input,
    },
    { apiName: this.apiName,...config });

  constructor(private restService: RestService) {}
}
