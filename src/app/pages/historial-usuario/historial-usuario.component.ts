import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Appointment } from 'src/app/models/appointment';
import { AppointmentService } from 'src/app/services/appointment.service';
import Swal from 'sweetalert2';
import { EscanearClienteComponent } from 'src/app/components/escanear-cliente/escanear-cliente.component';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

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
    servicios: [],
    imageUrl: '', // 👈 nuevo campo
    status: 'Pendiente',
  };
  db = getFirestore();
    async onQrScanned(documentId: string) {

      try {
        const datosQR = JSON.parse(documentId);
        const clienteId = datosQR.id;

        const docRef = doc(this.db, 'clientes', clienteId);
        const snap = await getDoc(docRef);

        if (snap.exists()) {
          const cliente = snap.data() as any;

          this.form.cedula = cliente.id;
          this.form.name = cliente.name;
          this.form.phone = cliente.phone;

          // Historial
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
        } else {
          Swal.fire(
            '❌ No encontrado',
            'El cliente no existe en la base de datos.',
            'warning'
          );
        }
      } catch (error) {
        console.error('QR inválido', error);
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
  leerImagenQR(event: Event) {
      const file = (event.target as HTMLInputElement)?.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async () => {
        const image = new Image();
        image.src = reader.result as string;
        image.onload = async () => {
          const { BrowserQRCodeReader } = await import('@zxing/browser');
          const codeReader = new BrowserQRCodeReader();

          try {
            const result = await codeReader.decodeFromImageElement(image);
            this.onQrScanned(result.getText());
          } catch (err) {
            console.error('No se pudo leer el QR', err);
            Swal.fire(
              '❌ Error',
              'No se pudo leer el código QR de la imagen',
              'error'
            );
          }
        };
      };
      reader.readAsDataURL(file);
    }
}
