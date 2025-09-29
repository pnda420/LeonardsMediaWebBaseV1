import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LargeWebsiteComponent } from './large-website.component';

describe('LargeWebsiteComponent', () => {
  let component: LargeWebsiteComponent;
  let fixture: ComponentFixture<LargeWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LargeWebsiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LargeWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
