import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms'; // 👈 importante
import { AppointmentService } from 'src/app/services/appointment.service';
import { Appointment } from 'src/app/models/appointment';
import Swal from 'sweetalert2';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
@Component({
  selector: 'app-schedule-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './schedule-appointment.component.html',
  styleUrls: ['./schedule-appointment.component.css'],
})
export class ScheduleAppointmentComponent {
  form: Appointment = {
    name: '',
    phone: '',
    date: '',
    bikeModel: '',
    description: '',
    price: 0,
    product: '',
    imageUrl: '', // 👈 nuevo campo
    status: 'Pendiente',
  };
  storage = getStorage(); // Esto crea una instancia del Storage

  // Lista de productos
  products = [
    { name: 'Mantenimiento suspensión', price: 50000 },
    { name: 'Cambio pastillas', price: 25000 },
    { name: 'Diagnóstico general' }, // sin precio
  ];
  get isFormValid(): boolean {
    const { name, phone, date, bikeModel, product, price } = this.form;
    return (
      !!name && !!phone && !!date && !!bikeModel && !!product && price !== null
    );
  }
  constructor(private appointmentService: AppointmentService) {}
  // Agrega esta función dentro del componente
  onProductChange(event: Event) {
    const value = (event.target as HTMLSelectElement).value;
    console.log('Producto seleccionado:', value);
  }

  async submit(appointmentForm: NgForm) {
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

      // Limpiar formulario y estado
      appointmentForm.resetForm(); // ✅ Borra campos y sus estados
      this.selectedImageFile = null;
      this.previewImage = null;
    } catch (error) {
      console.error('Error al agendar cita', error);
      Swal.fire('❌ Error', 'Hubo un problema al agendar la cita', 'error');
    }
  }

  selectedImageFile: File | null = null;
  previewImage: string | null = null;

  async onImageSelected(event: any) {
    const file: File = event.target.files[0];
    if (!file) return;

    // Vista previa
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.selectedImageFile = file; // ✅ ahora sí se asigna

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
}
