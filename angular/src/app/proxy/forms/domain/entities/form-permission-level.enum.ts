import { mapEnumToOptions } from '@abp/ng.core';

export enum FormPermissionLevel {
  None = 0,
  View = 1,
  Submit = 2,
  ManageOwn = 3,
}

export const formPermissionLevelOptions = mapEnumToOptions(FormPermissionLevel);
