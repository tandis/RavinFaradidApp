import { Routes } from '@angular/router';
import { FormListComponent } from './form-list/form-list.component';
import { FormEditComponent } from './form-editor/form-edit.component';
import { FormViewerComponent } from './form-viewer/form-viewer.component';
import { FormResponseListComponent } from './responses/form-response-list.component';
import { FormTemplateListComponent } from './form-template/form-template-list.component';
import { PendingChangesGuard } from './pending-changes.guard'
export const formsRoutes: Routes = [
  { path: 'list', component: FormListComponent},
  {
  path: 'create',
  canDeactivate: [PendingChangesGuard],
  loadComponent: () => import('./form-creator/form-create.component').then(m => m.FormCreateComponent)
},
  { path: 'edit/:id', component: FormEditComponent },
  { path: 'view/:id', component: FormViewerComponent },
  { path: 'templates', component: FormTemplateListComponent },
  { path: 'viewresponse/:id', component: FormResponseListComponent}
];
