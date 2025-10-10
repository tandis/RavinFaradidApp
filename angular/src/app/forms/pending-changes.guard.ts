import { CanDeactivateFn } from '@angular/router';

export interface DirtyAware {
  hasUnsavedChanges(): boolean;
}

export const PendingChangesGuard: CanDeactivateFn<DirtyAware> = (component) => {
  if (component?.hasUnsavedChanges?.()) {
    return confirm('تغییرات ذخیره نشده دارید. از خروج مطمئنید؟');
  }
  return true;
};
