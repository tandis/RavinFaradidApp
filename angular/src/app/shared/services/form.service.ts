import { Injectable } from '@angular/core';
import { RestService } from '@abp/ng.core';
import { BaseAppService } from './base-app-service';
import { FormDto } from '../dto/form.dto';

@Injectable({ providedIn: 'root' })
export class FormService extends BaseAppService<FormDto> {
  endpoint = 'forms';
  dtoType = FormDto;

  constructor(rest: RestService) {
    super(rest);
  }

  getActiveForms() {
    return this.rest.request(
      { method: 'GET', url: `/api/app/${this.endpoint}/active` },
      { apiName: this.apiName }
    );
  }
}
