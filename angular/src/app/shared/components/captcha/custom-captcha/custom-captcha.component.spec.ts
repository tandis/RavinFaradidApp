import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomCaptchaComponent } from './custom-captcha.component';

describe('CustomCaptchaComponent', () => {
  let component: CustomCaptchaComponent;
  let fixture: ComponentFixture<CustomCaptchaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomCaptchaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomCaptchaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
