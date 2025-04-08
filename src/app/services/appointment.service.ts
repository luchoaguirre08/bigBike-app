import { Injectable } from '@angular/core';
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getFirestore,
} from 'firebase/firestore';
import { db } from '../firebase.init'; // 👈 este es el Firestore inicializado
import { Appointment } from '../models/appointment';

@Injectable({ providedIn: 'root' })
export class AppointmentService {
  private readonly appointmentCollection = collection(db, 'appointments');

  async getAppointments(): Promise<Appointment[]> {
    const snapshot = await getDocs(this.appointmentCollection);
    return snapshot.docs.map((doc) => {
      const data = doc.data() as unknown as Omit<Appointment, 'id'>;
      return { id: doc.id, ...data };
    });
  }

  async addAppointment(appointment: Appointment) {
    const cleaned = Object.fromEntries(
      Object.entries(appointment).filter(([_, v]) => v !== undefined)
    );
    return await addDoc(this.appointmentCollection, cleaned);
  }

  async updateAppointment(appointment: Appointment) {
    const ref = doc(db, 'appointments', String(appointment.id));
    return await updateDoc(ref, { ...appointment });
  }

  async deleteAppointment(id: string) {
    const ref = doc(db, 'appointments', id);
    return await deleteDoc(ref);
  }

  async getClientHistory(documentId: string): Promise<Appointment[]> {
    const snapshot = await getDocs(this.appointmentCollection);
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() } as Appointment))
      .filter((cita) => cita.cedula === documentId); // 👈 este campo lo debes tener
  }

  db = getFirestore();

  async getClientes() {
    const snapshot = await getDocs(collection(this.db, 'clientes'));
    return snapshot.docs.map((doc) => doc.data());
  }
}
