// models/product.model.ts
export interface Product {
  id?: string;
  name: string;
  image: string;
  shortDescription: string;
  fullDescription: string;
  price?: number;
}
