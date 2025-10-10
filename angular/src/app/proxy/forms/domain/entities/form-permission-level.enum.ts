import { mapEnumToOptions } from '@abp/ng.core';

export enum FormPermissionLevel {
  View = 0,
  Submit = 1,
  Edit = 2,
  Publish = 3,
  Delete = 4,
}

export const formPermissionLevelOptions = mapEnumToOptions(FormPermissionLevel);
