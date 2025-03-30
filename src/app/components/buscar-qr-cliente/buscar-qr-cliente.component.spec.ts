import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarQrClienteComponent } from './buscar-qr-cliente.component';

describe('BuscarQrClienteComponent', () => {
  let component: BuscarQrClienteComponent;
  let fixture: ComponentFixture<BuscarQrClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [BuscarQrClienteComponent]
    });
    fixture = TestBed.createComponent(BuscarQrClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
