import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormTemplateListComponent } from './form-template-list.component';

describe('FormTemplateListComponent', () => {
  let component: FormTemplateListComponent;
  let fixture: ComponentFixture<FormTemplateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormTemplateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
