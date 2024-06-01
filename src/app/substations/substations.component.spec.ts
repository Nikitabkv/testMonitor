import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstationsComponent } from './substations.component';

describe('SubstationsComponent', () => {
  let component: SubstationsComponent;
  let fixture: ComponentFixture<SubstationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubstationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SubstationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
