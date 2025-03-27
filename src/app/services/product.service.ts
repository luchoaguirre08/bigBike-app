// product.service.ts
import { Injectable } from '@angular/core';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.init';
import { Product } from '../models/product.model';


@Injectable({ providedIn: 'root' })
export class ProductService {
  private collectionRef = collection(db, 'products');

  async getProducts(): Promise<Product[]> {
    const snapshot = await getDocs(this.collectionRef);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as Omit<Product, 'id'>;
      return { id: doc.id, ...data };
    });
  }
}
