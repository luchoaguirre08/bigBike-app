import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-view-appointments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './view-appointments.component.html',
  styleUrls: ['./view-appointments.component.css'],
})
export class ViewAppointmentsComponent {
  appointments: Appointment[] = [];
  groupedAppointments: { [status: string]: Appointment[] } = {};
  estados = ['Pendiente', 'En progreso', 'Completado'];
  pagos: Appointment[] = [];
  mostrarPagos = false;

  filtroMes: string; // formato: "YYYY-MM"

  constructor(private appointmentService: AppointmentService) {
    const hoy = new Date();
    this.filtroMes = `${hoy.getFullYear()}-${(hoy.getMonth() + 1)
      .toString()
      .padStart(2, '0')}`;
  }

  async ngOnInit() {
    await this.loadAppointments();
  }

  async loadAppointments() {
    this.appointments = await this.appointmentService.getAppointments();
    this.groupAppointmentsByStatus();
    this.actualizarPagosFiltrados();
  }

  groupAppointmentsByStatus() {
    this.groupedAppointments = {};
    for (const estado of this.estados) {
      this.groupedAppointments[estado] = this.appointments.filter(
        (a) => a.status === estado
      );
    }
  }

  actualizarPagosFiltrados() {
    this.pagos = this.appointments.filter((a) => {
      if (a.status !== 'Pagado' || !a.date) return false;
      return a.date.startsWith(this.filtroMes);
    });
  }

  async update(appointment: Appointment, nuevoEstado: Appointment['status']) {
    appointment.status = nuevoEstado;
    await this.appointmentService.updateAppointment(appointment);
    await this.loadAppointments();
  }

  async cobrar(appointment: Appointment) {
    appointment.status = 'Pagado';
    await this.appointmentService.updateAppointment(appointment);
    await this.loadAppointments();
  }

  get totalPagos(): number {
    return this.pagos.reduce((acc, a) => acc + (a.price || 0), 0);
  }

  imagenModalUrl: string | null = null;
  mostrarModalImagen = false;

  abrirModalImagen(url: string) {
    this.imagenModalUrl = url;
    this.mostrarModalImagen = true;
  }

  cerrarModalImagen() {
    this.mostrarModalImagen = false;
    this.imagenModalUrl = null;
  }
}




