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
    servicios: [] as {
      id: string;
      name: string;
      price: number;
      priceExtra?: number;
    }[],
    price: 0,
    typeBicycle: [],
    imageUrl: '', // 👈 nuevo campo
    status: 'Pendiente',
  };

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  storage = getStorage(); // Esto crea una instancia del Storage
  historialCliente: any;
  // Lista de productos
  products = [
    { id: 'mt-001', name: 'Mantenimiento general', price: 100000 },
    {
      id: 'mt-002',
      name: 'Mantenimiento preventivo de suspensión delantera',
      price: 45000,
    },
    {
      id: 'mt-003',
      name: 'Mantenimiento preventivo de suspensión trasera',
      price: 45000,
    },
    {
      id: 'mt-004',
      name: 'Mantenimiento completo de suspensión delantera',
      price: 90000,
    },
    {
      id: 'mt-005',
      name: 'Mantenimiento completo de suspensión trasera',
      price: 160000,
    },
    { id: 'mt-006', name: 'Mantenimiento Command Post (básico)', price: 40000 },
    { id: 'mt-007', name: 'Mantenimiento tensor', price: 30000 },
    { id: 'mt-008', name: 'Mantenimiento basculante', price: 60000 },
    { id: 'mt-009', name: 'Mantenimiento de frenos (c/u)', price: 40000 },
    { id: 'mt-010', name: 'Mantenimiento pedales', price: 40000 },
    { id: 'mt-011', name: 'Purga de frenos hidráulicos', price: 8000 },
    { id: 'mt-012', name: 'Puesta a punto', price: 40000 },
    { id: 'mt-013', name: 'Recarga tubeles', price: 15000 },
    {
      id: 'mt-014',
      name: 'Mantenimiento general + preventivo suspensión delantera',
      price: 130000,
    },
    { id: 'mt-015', name: 'Otros', price: 0 },
  ];

  productsRuta = [
    { id: 'rt-001', name: 'Mantenimiento general', price: 80000 },
    { id: 'rt-002', name: 'Mantenimiento tensor', price: 30000 },
    { id: 'rt-003', name: 'Mantenimiento de frenos (c/u)', price: 40000 },
    { id: 'rt-004', name: 'Mantenimiento pedales', price: 40000 },
    { id: 'rt-005', name: 'Purga de frenos hidráulicos', price: 8000 },
    { id: 'rt-006', name: 'Puesta a punto', price: 40000 },
    { id: 'rt-007', name: 'Recarga tubeles', price: 10000 },
    { id: 'rt-008', name: 'Otros', price: 0 },
  ];

  typesBicycle = ['Ruta', 'Montaña'];

  get isFormValid(): boolean {
    const { name, phone, date, bikeModel, servicios, price, typeBicycle } =
      this.form;
    return (
      !!name &&
      !!phone &&
      !!date &&
      !!bikeModel &&
      !!typeBicycle &&
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
      this.form.servicios = [];
      appointmentForm.resetForm();
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
      this.form.servicios = this.form.servicios.filter((s) => s.id !== p.id);
    }

    this.calcularPrecioTotal();
  }

  onTypeBicycleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;

    this.form.typeBicycle = [selectedValue];

    // Limpia servicios y precio
    this.form.servicios = [];
    this.form.price = 0;

    // No es necesario asignar a `this.products` si ya estás usando products y productsRuta separados en la vista.
  }
  isServicioSeleccionado(servicio: any): boolean {
    return this.form.servicios.some((s) => s.id === servicio.id);
  }

  isRutaSelected() {
    return this.form.typeBicycle?.includes('Ruta');
  }

  isMontanaSelected() {
    return this.form.typeBicycle?.includes('Montaña');
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
