import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '../carousel/carousel.component';

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
  products: Product[] = [
    {
      name: 'Mantenimiento Preventivo de Suspensión',
      image: '/assets/images/suspension.jpg',
      shortDescription:
        'Asegura el óptimo funcionamiento de tu suspensión con nuestro mantenimiento preventivo especializado. Ideal para prolongar su vida útil y mantener un rendimiento suave.',

      fullDescription: `✔ Limpieza profunda de la suspensión para eliminar tierra y residuos acumulados.
✔ Revisión y limpieza de retenes y sellos para evitar fugas y desgaste prematuro.
✔ Cambio de lubricantes y fluidos internos para un rendimiento óptimo.
✔ Inspección de componentes internos (válvulas, juntas, amortiguadores) para detectar desgastes o daños.
✔ Ajuste de presión y configuración según tu peso y estilo de conducción.
✔ Prueba funcional completa para garantizar que esté lista para cualquier terreno.

🛠️ ¡Agenda tu mantenimiento preventivo ahora y siente la diferencia de una suspensión como nueva!
`,
    },
    {
      name: 'Mantenimiento Preventivo de Suspensión',
      image: '/assets/images/suspension.jpg',
      shortDescription:
        'Asegura el óptimo funcionamiento de tu suspensión con nuestro mantenimiento preventivo especializado. Ideal para prolongar su vida útil y mantener un rendimiento suave.',

      fullDescription: `✔ Limpieza profunda de la suspensión para eliminar tierra y residuos acumulados.
✔ Revisión y limpieza de retenes y sellos para evitar fugas y desgaste prematuro.
✔ Cambio de lubricantes y fluidos internos para un rendimiento óptimo.
✔ Inspección de componentes internos (válvulas, juntas, amortiguadores) para detectar desgastes o daños.
✔ Ajuste de presión y configuración según tu peso y estilo de conducción.
✔ Prueba funcional completa para garantizar que esté lista para cualquier terreno.

🛠️ ¡Agenda tu mantenimiento preventivo ahora y siente la diferencia de una suspensión como nueva!
`,
    },
    {
      name: 'Mantenimiento frenos',
      image: '/assets/images/suspension.jpg',
      shortDescription:
        'Asegura el óptimo funcionamiento de tu suspensión con nuestro mantenimiento preventivo especializado. Ideal para prolongar su vida útil y mantener un rendimiento suave.',

      fullDescription: `✔ Limpieza profunda de la suspensión para eliminar tierra y residuos acumulados.
✔ Revisión y limpieza de retenes y sellos para evitar fugas y desgaste prematuro.
✔ Cambio de lubricantes y fluidos internos para un rendimiento óptimo.
✔ Inspección de componentes internos (válvulas, juntas, amortiguadores) para detectar desgastes o daños.
✔ Ajuste de presión y configuración según tu peso y estilo de conducción.
✔ Prueba funcional completa para garantizar que esté lista para cualquier terreno.

🛠️ ¡Agenda tu mantenimiento preventivo ahora y siente la diferencia de una suspensión como nueva!
`,
    },

    {
      name: 'Mantenimiento de Suspensión',
      image: '/assets/images/suspension.jpg',
      shortDescription:
        'Asegura el óptimo funcionamiento de tu suspensión con nuestro mantenimiento preventivo especializado. Ideal para prolongar su vida útil y mantener un rendimiento suave.',

      fullDescription: `✔ Limpieza profunda de la suspensión para eliminar tierra y residuos acumulados.
✔ Revisión y limpieza de retenes y sellos para evitar fugas y desgaste prematuro.
✔ Cambio de lubricantes y fluidos internos para un rendimiento óptimo.
✔ Inspección de componentes internos (válvulas, juntas, amortiguadores) para detectar desgastes o daños.
✔ Ajuste de presión y configuración según tu peso y estilo de conducción.
✔ Prueba funcional completa para garantizar que esté lista para cualquier terreno.

🛠️ ¡Agenda tu mantenimiento preventivo ahora y siente la diferencia de una suspensión como nueva!
`,
    },
  ];

  selectedProduct: Product | null = null;

  openModal(product: Product) {
    this.selectedProduct = product;
  }

  closeModal() {
    this.selectedProduct = null;
  }
}
