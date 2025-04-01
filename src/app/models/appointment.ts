export interface Appointment {
  id?: string;
  cedula: string;
  name: string;
  phone: string;
  date: string;
  bikeModel: string;
  description: string;
  servicios: Servicio[];
  price?: number;
  priceExtra?: number;
  imageUrl?: string;
  status: 'Pendiente' | 'En progreso' | 'Completado' | 'Pagado';
}
interface Servicio {
  name: string;
  price: number;
}
