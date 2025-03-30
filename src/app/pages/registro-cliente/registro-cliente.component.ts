import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrGeneratorComponent } from 'src/app/components/qr-generator/qr-generator.component';
import { FormsModule, NgForm } from '@angular/forms';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { BuscarQrClienteComponent } from 'src/app/components/buscar-qr-cliente/buscar-qr-cliente.component';

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [CommonModule, QrGeneratorComponent, FormsModule, BuscarQrClienteComponent],
  templateUrl: './registro-cliente.component.html',
  styles: [],
})
export class RegistroClienteComponent {
  db = getFirestore();
  cliente = { name: '', phone: '', email: '', id: '' };
  documentoCliente = '';
  showButtons: boolean=false;
  @ViewChild(QrGeneratorComponent) qrGen!: QrGeneratorComponent;

  async guardarCliente(form: NgForm) {
    const { isConfirmed } = await Swal.fire({
    title: '¿Registrar cliente?',
    text: 'Se generará un código QR con los datos del cliente.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Sí, guardar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
  });

  if (!isConfirmed) return;
  const datosQR = {
      id: this.cliente.id,
      name: this.cliente.name,
      phone: this.cliente.phone,
      email: this.cliente.email,
    };

    this.documentoCliente = JSON.stringify(datosQR);
this.showButtons=true;
    try {
       await new Promise((resolve) => setTimeout(resolve, 500));
      const qrUrl = await this.qrGen.uploadQRToFirebase(this.cliente.id);
console.log("url", qrUrl)
      const clienteCompleto = {
        ...this.cliente,
        qrUrl: qrUrl || '',
      };

      await setDoc(doc(this.db, 'clientes', this.cliente.id), clienteCompleto);
      console.log('Cliente guardado con QR', qrUrl);

      form.resetForm();
      this.documentoCliente = '';
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  }
}
