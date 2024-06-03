import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeteringPopupComponent } from './metering-popup.component';

describe('MeteringPopupComponent', () => {
  let component: MeteringPopupComponent;
  let fixture: ComponentFixture<MeteringPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeteringPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MeteringPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
