import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '../carousel/carousel.component';
import { PRODUCTS } from 'src/app/constants/products-data';

export interface Product {
  name: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
}

@Component({
  selector: 'app-product-cards',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  templateUrl: './product-cards.component.html',
  styleUrls: ['./product-cards.component.css'],
})
export class ProductCardsComponent {
  products: Product[] = PRODUCTS;
  selectedProduct: Product | null = null;

  openModal(product: Product) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }
}
