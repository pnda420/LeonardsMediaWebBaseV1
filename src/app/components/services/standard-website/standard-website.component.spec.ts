import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StandardWebsiteComponent } from './standard-website.component';

describe('StandardWebsiteComponent', () => {
  let component: StandardWebsiteComponent;
  let fixture: ComponentFixture<StandardWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StandardWebsiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StandardWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
