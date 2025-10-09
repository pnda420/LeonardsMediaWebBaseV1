import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminGenPagesComponent } from './admin-gen-pages.component';

describe('AdminGenPagesComponent', () => {
  let component: AdminGenPagesComponent;
  let fixture: ComponentFixture<AdminGenPagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminGenPagesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminGenPagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
