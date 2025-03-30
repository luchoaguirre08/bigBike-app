import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EscanearClienteComponent } from './escanear-cliente.component';

describe('EscanearClienteComponent', () => {
  let component: EscanearClienteComponent;
  let fixture: ComponentFixture<EscanearClienteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EscanearClienteComponent]
    });
    fixture = TestBed.createComponent(EscanearClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
