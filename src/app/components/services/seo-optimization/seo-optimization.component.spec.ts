import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeoOptimizationComponent } from './seo-optimization.component';

describe('SeoOptimizationComponent', () => {
  let component: SeoOptimizationComponent;
  let fixture: ComponentFixture<SeoOptimizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeoOptimizationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeoOptimizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
