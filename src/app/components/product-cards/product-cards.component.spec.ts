import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardsComponent } from './product-cards.component';

describe('ProductCardsComponent', () => {
  let component: ProductCardsComponent;
  let fixture: ComponentFixture<ProductCardsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ProductCardsComponent]
    });
    fixture = TestBed.createComponent(ProductCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
