import { Routes } from '@angular/router';
import { FormListComponent } from './form-list/form-list.component';
import { FormEditorComponent } from './form-editor/form-editor.component';
import { FormViewerComponent } from './form-viewer/form-viewer.component';
import { FormResponseListComponent } from './form-response-list.component';
import { FormTemplateListComponent } from './form-template/form-template-list.component';
import { PendingChangesGuard } from './pending-changes.guard'
export const formsRoutes: Routes = [
  { path: 'list', component: FormListComponent},
  {
  path: 'create',
  canDeactivate: [PendingChangesGuard],
  loadComponent: () => import('./form-creator/form-create.component').then(m => m.FormCreateComponent)
},
  { path: 'editor', component: FormEditorComponent },
  { path: 'view/:id', component: FormViewerComponent },
  { path: 'templates', component: FormTemplateListComponent }
];
