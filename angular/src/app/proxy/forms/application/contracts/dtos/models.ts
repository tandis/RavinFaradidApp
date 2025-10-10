import type { AuditedEntityDto, FullAuditedEntityDto } from '@abp/ng.core';

export interface CreateFormResponseDto extends FullAuditedEntityDto<string> {
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
