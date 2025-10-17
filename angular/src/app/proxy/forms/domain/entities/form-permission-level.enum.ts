import { mapEnumToOptions } from '@abp/ng.core';

export enum FormParticipationLevel
{
    None        = 0, // هیچ دسترسی
    View        = 1, // مشاهده فرم (Form صفحه و سوالات)
    Submit      = 2, // ارسال پاسخ
    ManageOwn   = 3  // مشاهده/ویرایش/حذف پاسخ‌های «خودِ کاربر»
    // در آینده اگر خواستی: Review, ManageAllResponses, ...
}

export const formPermissionLevelOptions = mapEnumToOptions(FormParticipationLevel);
