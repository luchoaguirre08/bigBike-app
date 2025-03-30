import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import Swal from 'sweetalert2';
import { EscanearClienteComponent } from 'src/app/components/escanear-cliente/escanear-cliente.component';

@Component({
  selector: 'app-historial-usuario',
  standalone: true,
  imports: [CommonModule, EscanearClienteComponent],
  templateUrl: './historial-usuario.component.html',
  styles: [],
})
export class HistorialUsuarioComponent {
  constructor(private appointmentService: AppointmentService) {}
  historialCliente: any;
  form: Appointment = {
    name: '',
    cedula: '',
    phone: '',
    date: '',
    bikeModel: '',
    description: '',
    price: 0,
    product: '',
    imageUrl: '', // 👈 nuevo campo
    status: 'Pendiente',
  };
  onQrScanned(documentId: string) {
    try {
      const cliente = JSON.parse(documentId);

      this.form.cedula = cliente.id;
      this.form.name = cliente.name;
      this.form.phone = cliente.phone;

      this.appointmentService
        .getClientHistory(cliente.id)
        .then((appointments) => {
          this.historialCliente = appointments;

          Swal.fire({
            icon: 'success',
            title: 'Cliente encontrado',
            text: `Se cargó la información de ${cliente.name} y su historial.`,
            timer: 2500,
            showConfirmButton: false,
          });
        });
    } catch (error) {
      Swal.fire('❌ Error', 'El código QR no es válido', 'error');
    }
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
