import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
@Component({
  selector: 'app-edit-appointment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-appointment-modal.component.html',
  styleUrls: ['./edit-appointment-modal.component.css'],
})
export class EditAppointmentModalComponent implements OnInit {
  @Input() appointment: any;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<any>();
  storage = getStorage(); // Esto crea una instancia del Storage
  formData: any = {
    cedula: '',
    name: '',
    phone: '',
    date: '',
    bikeModel: '',
    typeBicycle: '',
    services: [],
    price: 0,
    description: '',
    priceExtra: 0,
    imageUrl: '',
  };

  previewImage: any = null;
  typesBicycle = ['Montaña', 'Ruta'];

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

  get serviciosActuales() {
    return this.formData.typeBicycle === 'Ruta'
      ? this.productsRuta
      : this.products;
  }

  ngOnInit(): void {
    if (this.appointment) {
      this.formData = { ...this.formData, ...this.appointment };
      this.formData.date = this.formatDate(this.formData.date);
      this.previewImage = this.formData.imageUrl || null;
    }
  }

  formatDate(date: string) {
    return new Date(date).toISOString().split('T')[0];
  }

  toggleServicio(p: any, event: Event) {
    const input = event.target as HTMLInputElement;
    const checked = input.checked;

    if (checked) {
      this.formData.servicios.push(p);
    } else {
      this.formData.servicios = this.formData.servicios.filter((s: { id: any; }) => s.id !== p.id);
    }

    this.calcularPrecioTotal();
  }

  calcularPrecioTotal() {
    const serviciosTotal = this.formData.servicios.reduce(
      (total: any, s: { price: any }) => total + s.price,
      0
    );

    const extra = this.formData.priceExtra || 0;

    this.formData.price = serviciosTotal + extra;
  }

  selectedImageFile: File | null = null;

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

      this.formData.imageUrl = downloadURL;
      console.log('Imagen subida correctamente:', downloadURL);
    } catch (error) {
      console.error('Error al subir la imagen', error);
    }
  }

  submit() {
    this.onSave.emit(this.formData);
  }

  close() {
    this.onClose.emit();
  }

  isRutaSelected() {
    return this.formData.typeBicycle?.includes('Ruta');
  }

  isMontanaSelected() {
    return this.formData.typeBicycle?.includes('Montaña');
  }

  onTypeBicycleChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    const selectedValue = select.value;

    this.formData.typeBicycle = [selectedValue];

    // Limpia servicios y precio
    this.formData.servicios = [];
    this.formData.price = 0;

    // No es necesario asignar a `this.products` si ya estás usando products y productsRuta separados en la vista.
  }
  isServicioSeleccionado(servicio: any): boolean {
    return this.formData.servicios.some(
      (s: { id: any }) => s.id === servicio.id
    );
  }
}
