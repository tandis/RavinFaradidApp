import type { AuditedEntityDto, FullAuditedEntityDto, PagedAndSortedResultRequestDto } from '@abp/ng.core';
//import type { FullAuditedEntityDto } from '../../../../abp/application/services/dto/models';
import type { FormPermissionLevel } from '../../../domain/entities/form-permission-level.enum';

export interface CreateFormResponseDto extends FullAuditedEntityDto<string> {
  extraProperties?: Record<string, object>;
  formId?: string;
  formVersionId?: string;
  responseData?: string;
  submittedAt?: string;
}

export interface CreateUpdateFormCategoryDto {
  name: string;
  description?: string;
  parentCategoryId?: string;
}

export interface CreateUpdateFormDto extends FullAuditedEntityDto<string> {
  title: string;
  description?: string;
  categoryId?: string;
  isActive: boolean;
  isAnonymousAllowed: boolean;
  jsonDefinition: string;
  themeDefinition?: string;
}

export interface CreateUpdateFormTemplateDto extends AuditedEntityDto<string> {
  name?: string;
  description?: string;
  jsonDefinition?: string;
}

export interface FormCategoryDto extends FullAuditedEntityDto<string> {
  name?: string;
  description?: string;
  parentCategoryId?: string;
  children: FormCategoryDto[];
}

export interface FormDto extends AuditedEntityDto<string> {
  title?: string;
  description?: string;
  isActive: boolean;
  categoryId?: string;
  publishedVersionId?: string;
  category: FormCategoryDto;
  versions: FormVersionDto[];
}

export interface FormResponseDto extends FullAuditedEntityDto<string> {
  formId?: string;
  formVersionId?: string;
  responseData?: string;
  submittedAt?: string;
}

export interface FormTemplateDto extends AuditedEntityDto<string> {
  name?: string;
  description?: string;
  jsonDefinition?: string;
}

export interface FormVersionDto extends FullAuditedEntityDto<string> {
  versionNumber: number;
  jsonDefinition?: string;
  themeDefinition?: string;
  definitionHash?: string;
  publishedAt?: string;
}

export interface FormViewerDto {
  formId?: string;
  title?: string;
  description?: string;
  isActive: boolean;
  isAnonymousAllowed: boolean;
  publishedVersion: FormViewerVersionDto;
}

export interface FormViewerVersionDto {
  id?: string;
  versionNumber: number;
  publishedAt?: string;
  schemaJson: object;
  themeJson: object;
}

export interface SaveAndPublishDto extends FullAuditedEntityDto<string> {
  title?: string;
  description?: string;
  categoryId?: string;
  isActive: boolean;
  isAnonymousAllowed: boolean;
  jsonDefinition: string;
  themeDefinition?: string;
}

export interface CreateUpdateFormPermissionDto {
  formId: string;
  userId?: string;
  roleId?: string;
  permissionLevel: FormPermissionLevel;
  concurrencyStamp?: string;
  isAnonymous: boolean;
}

export interface FormPermissionDto extends AuditedEntityDto<string> {
  formId?: string;
  userId?: string;
  roleId?: string;
  permissionLevel?: FormPermissionLevel;
  tenantId?: string;
  isAnonymous: boolean;
  concurrencyStamp?: string;
}

export interface FormPermissionListInput extends PagedAndSortedResultRequestDto {
  formId: string;
  userId?: string;
  roleId?: string;
}
