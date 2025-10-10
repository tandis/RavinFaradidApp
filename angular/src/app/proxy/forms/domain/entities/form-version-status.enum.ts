import { mapEnumToOptions } from '@abp/ng.core';

export enum FormVersionStatus {
  Draft = 0,
  Published = 1,
  Archived = 2,
}

export const formVersionStatusOptions = mapEnumToOptions(FormVersionStatus);
