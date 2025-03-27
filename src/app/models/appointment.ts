export interface Appointment {
  id?: string;
  name: string;
  phone: string;
  date: string;
  bikeModel: string;
  description: string;
  product?: string;
  price?: number;
  imageUrl?:string;
  status: 'Pendiente' | 'En progreso' | 'Completado' | 'Pagado';
}
