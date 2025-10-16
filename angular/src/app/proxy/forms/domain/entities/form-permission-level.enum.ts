import { mapEnumToOptions } from '@abp/ng.core';

export enum FormPermissionLevel {
  None = 0,
  View = 1,
  Submit = 2,
  Edit = 3,
  Publish = 4,
  Delete = 5,
  Owner = 6,
}

export const formPermissionLevelOptions = mapEnumToOptions(FormPermissionLevel);
