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
  typeBicycle?: string[];
  imageUrl?: string;
  status: 'Pendiente' | 'En progreso' | 'Completado' | 'Pagado';
}
interface Servicio {
  id: string;
  name: string;
  price: number;
}

export interface Citas{
    name: string,
     phone: string,
     id: string,
     qrUrl:string,
}
