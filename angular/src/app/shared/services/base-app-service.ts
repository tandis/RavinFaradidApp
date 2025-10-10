import { RestService } from '@abp/ng.core';
import { Observable, map } from 'rxjs';
import { BaseDto } from '../dto/base-dto';

export abstract class BaseAppService<T extends BaseDto<T>> {
  protected constructor(protected rest: RestService, protected apiName = 'Default') {}
  abstract endpoint: string;
  abstract dtoType: new () => T;

  getAll(): Observable<T[]> {
    return this.rest.request<any, any>(
      { method: 'GET', url: `/api/app/${this.endpoint}` },
      { apiName: this.apiName }
    ).pipe(map(res => res.items?.map((i: any) => (this.dtoType as any).fromJS(i)) ?? []));
  }

  get(id: string): Observable<T> {
    return this.rest.request<any, any>(
      { method: 'GET', url: `/api/app/${this.endpoint}/${id}` },
      { apiName: this.apiName }
    ).pipe(map(res => (this.dtoType as any).fromJS(res)));
  }

  create(input: T): Observable<T> {
    return this.rest.request<any, any>(
      { method: 'POST', url: `/api/app/${this.endpoint}`, body: input.toJSON() },
      { apiName: this.apiName }
    ).pipe(map(res => (this.dtoType as any).fromJS(res)));
  }

  update(id: string, input: T): Observable<T> {
    return this.rest.request<any, any>(
      { method: 'PUT', url: `/api/app/${this.endpoint}/${id}`, body: input.toJSON() },
      { apiName: this.apiName }
    ).pipe(map(res => (this.dtoType as any).fromJS(res)));
  }

  delete(id: string): Observable<void> {
    return this.rest.request<void, void>(
      { method: 'DELETE', url: `/api/app/${this.endpoint}/${id}` },
      { apiName: this.apiName }
    );
  }
}
