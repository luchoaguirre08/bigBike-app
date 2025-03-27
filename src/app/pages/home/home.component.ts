import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductCardsComponent } from 'src/app/components/product-cards/product-cards.component';
import { CarouselComponent } from 'src/app/components/carousel/carousel.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ProductCardsComponent,CarouselComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {

}
