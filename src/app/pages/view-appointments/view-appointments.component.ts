import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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
  formatFecha(fecha: string | Date): string {
    let dateObj: Date;

    if (typeof fecha === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      const [year, month, day] = fecha.split('-').map(Number);
      // month - 1 porque los meses en JavaScript van de 0 (enero) a 11 (diciembre)
      dateObj = new Date(year, month - 1, day);
    } else {
      dateObj = new Date(fecha);
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    };

    const formatted = new Intl.DateTimeFormat('es-CO', options).format(dateObj);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }

  actualizarPagosFiltrados() {
    this.pagos = this.appointments.filter((a) => {
      if (a.status !== 'Pagado' || !a.date) return false;
      return a.date.startsWith(this.filtroMes);
    });
  }

  async update(appointment: Appointment, nuevoEstado: Appointment['status']) {
    const { isConfirmed } = await Swal.fire({
      title: '¿Cambiar estado?',
      text: `¿Deseas cambiar el estado a "${nuevoEstado}"?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (isConfirmed) {
      appointment.status = nuevoEstado;
      await this.appointmentService.updateAppointment(appointment);
      await this.loadAppointments();
      Swal.fire('✅ Estado actualizado', '', 'success');
    }
  }

  async cobrar(appointment: Appointment) {
    const { isConfirmed } = await Swal.fire({
      title: '¿Marcar como pagado?',
      text: `Esta acción marcará la cita como "Pagado".`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, cobrar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (isConfirmed) {
      appointment.status = 'Pagado';
      await this.appointmentService.updateAppointment(appointment);
      await this.loadAppointments();
      Swal.fire('💰 Cita cobrada', '', 'success');
    }
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
  enviarWhatsapp(nombre: string, telefono: string) {
    Swal.fire({
      title: '¿Estás seguro?',
      text: `¿Quieres notificar a ${nombre} que su bicicleta ya está lista?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        const mensaje = `Hola ${nombre}, tu bicicleta ya está lista. ¡Te esperamos en el taller! 🚴‍♂️🔧`;
        const url = `https://wa.me/57${telefono}?text=${encodeURIComponent(
          mensaje
        )}`;
        window.open(url, '_blank');
      }
    });
  }
}




