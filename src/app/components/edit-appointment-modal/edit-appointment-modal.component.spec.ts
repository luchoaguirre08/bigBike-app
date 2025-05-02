import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAppointmentModalComponent } from './edit-appointment-modal.component';

describe('EditAppointmentModalComponent', () => {
  let component: EditAppointmentModalComponent;
  let fixture: ComponentFixture<EditAppointmentModalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EditAppointmentModalComponent]
    });
    fixture = TestBed.createComponent(EditAppointmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
