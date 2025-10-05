import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndividualWebsiteComponent } from './individual-website.component';

describe('IndividualWebsiteComponent', () => {
  let component: IndividualWebsiteComponent;
  let fixture: ComponentFixture<IndividualWebsiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndividualWebsiteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndividualWebsiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
