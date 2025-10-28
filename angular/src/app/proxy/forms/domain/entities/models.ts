import type { FullAuditedAggregateRoot } from '../../../volo/abp/domain/entities/auditing/models';
import type { FormPermissionLevel } from './form-permission-level.enum';
import type { FormVersionStatus } from './form-version-status.enum';

export interface Form extends FullAuditedAggregateRoot<string> {
  title?: string;
  description?: string;
  isActive: boolean;
  tenantId?: string;
  categoryId?: string;
  category: FormCategory;
  publishedVersionId?: string;
  isAnonymousAllowed: boolean;
  versions: FormVersion[];
  responses: FormResponse[];
  permissions: FormPermission[];
}

export interface FormAssignment extends FullAuditedAggregateRoot<string> {
  formId?: string;
  targetUserId?: string;
  targetRoleId?: string;
  startDate?: string;
  endDate?: string;
  tenantId?: string;
  form: Form;
}

export interface FormCategory extends FullAuditedAggregateRoot<string> {
  name?: string;
  description?: string;
  parentCategoryId?: string;
  tenantId?: string;
  parentCategory: FormCategory;
  children: FormCategory[];
  forms: Form[];
}

export interface FormPermission extends FullAuditedAggregateRoot<string> {
  formId?: string;
  userId?: string;
  roleId?: string;
  isAnonymous: boolean;
  permissionLevel?: FormPermissionLevel;
  tenantId?: string;
  form: Form;
}

export interface FormResponse extends FullAuditedAggregateRoot<string> {
  formId?: string;
  formVersionId?: string;
  tenantId?: string;
  responseData?: string;
  submittedAt?: string;
  form: Form;
  version: FormVersion;
}

export interface FormVersion extends FullAuditedAggregateRoot<string> {
  formId?: string;
  versionNumber: number;
  jsonDefinition?: string;
  themeDefinition?: string;
  definitionHash?: string;
  publishedAt?: string;
  status?: FormVersionStatus;
  form: Form;
}
