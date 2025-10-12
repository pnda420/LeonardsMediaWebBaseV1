import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerationLoadingComponent } from './generation-loading.component';

describe('GenerationLoadingComponent', () => {
  let component: GenerationLoadingComponent;
  let fixture: ComponentFixture<GenerationLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenerationLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerationLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
