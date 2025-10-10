import { BaseDto } from './base-dto';

export interface IFormDto {
  id?: string;
  title?: string;
  description?: string;
  jsonDefinition?: string;
  isPublished?: boolean;
   tenantId?: string;
   themeJson?:string;
}

export class FormDto extends BaseDto<FormDto> implements IFormDto {
  id!: string;
  title!: string;
  description?: string;
  isActive!: boolean;
  jsonDefinition?: string;
  tenantId?: string;
  isPublished?: boolean;
  themeJson?:string;
}
