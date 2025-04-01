import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // 👈 importante
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/models/appointment';
import Swal from 'sweetalert2';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { RegistroClienteComponent } from '../registro-cliente/registro-cliente.component';
import { EscanearClienteComponent } from 'src/app/components/escanear-cliente/escanear-cliente.component';
@Component({
  selector: 'app-schedule-appointment',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RegistroClienteComponent,
    EscanearClienteComponent,
  ],
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.css'],
})
export class ScheduleAppointmentComponent {
  form: Appointment = {
    name: '',
    cedula: '',
    phone: '',
    date: '',
    bikeModel: '',
    description: '',
    servicios: [] as { name: string; price: number; priceExtra?: number }[],
    price: 0,
    imageUrl: '', // 👈 nuevo campo
    status: 'Pendiente',
  };
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  storage = getStorage(); // Esto crea una instancia del Storage
  historialCliente: any;
  // Lista de productos
  products = [
    { name: 'Mantenimiento de suspensión delantera', price: 90000 },
    { name: 'Mantenimiento de suspensión trasera', price: 95000 },
    { name: 'Purgado de frenos hidráulicos', price: 60000 },
    { name: 'Cambio de pastillas de freno', price: 30000 },
    { name: 'Ajuste de frenos mecánicos', price: 25000 },
    { name: 'Mantenimiento Command Post', price: 85000 },
    { name: 'Cambio de líquido de frenos', price: 40000 },
    { name: 'Inspección completa de frenos y suspensión', price: 100000 },
  ];

  get isFormValid(): boolean {
    const { name, phone, date, bikeModel, servicios, price } = this.form;
    return (
      !!name &&
      !!phone &&
      !!date &&
      !!bikeModel &&
      !!servicios &&
      price !== null
    );
  }
  constructor(private appointmentService: AppointmentService) {}
  // onProductChange() {
  //   const selected = this.servicios.find((p) => p.name === this.form.servicios);
  //   this.form.price = selected?.price ?? 0;
  // }

  async submit(appointmentForm: NgForm) {
    const { isConfirmed } = await Swal.fire({
      title: '¿Confirmar cita?',
      text: '¿Estás seguro de que deseas agendar esta cita?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, agendar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (!isConfirmed) return;
    try {
      let imageUrl = '';
      if (this.selectedImageFile) {
        const filePath = `citas/${Date.now()}_${this.selectedImageFile.name}`;
        const storageRef = ref(this.storage, filePath);
        await uploadBytes(storageRef, this.selectedImageFile);
        imageUrl = await getDownloadURL(storageRef);
      }

      const cita = { ...this.form, imageUrl };
      await this.appointmentService.addAppointment(cita);

      Swal.fire('✅ Éxito', 'Cita agendada correctamente', 'success');

      appointmentForm.resetForm();
      this.form.servicios = [];
      this.selectedImageFile = null;
      this.previewImage = null;
    } catch (error) {
      console.error('Error al agendar cita', error);
      Swal.fire('❌ Error', 'Hubo un problema al agendar la cita', 'error');
    }
    this.fileInput.nativeElement.value = '';
  }

  selectedImageFile: File | null = null;
  previewImage: string | null = null;

  async onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.selectedImageFile = file;

    try {
      const filePath = `citas/${Date.now()}_${file.name}`;
      const storageRef = ref(this.storage, filePath);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);

      this.form.imageUrl = downloadURL;
      console.log('Imagen subida correctamente:', downloadURL);
    } catch (error) {
      console.error('Error al subir la imagen', error);
    }
  }

  toggleServicio(p: any, event: Event) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;

    if (checked) {
      this.form.servicios.push(p);
    } else {
      this.form.servicios = this.form.servicios.filter(
        (s) => s.name !== p.name
      );
    }

    this.calcularPrecioTotal();
  }

  calcularPrecioTotal() {
    const serviciosTotal = this.form.servicios.reduce(
      (total, s) => total + s.price,
      0
    );

    const extra = this.form.priceExtra || 0;

    this.form.price = serviciosTotal + extra;
  }

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
      console.error('QR inválido', error);
      Swal.fire('❌ Error', 'El código QR no es válido', 'error');
    }
  }


}
