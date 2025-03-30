import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrGeneratorComponent } from 'src/app/components/qr-generator/qr-generator.component';
import { FormsModule, NgForm } from '@angular/forms';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [CommonModule, QrGeneratorComponent, FormsModule],
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
    const datosQR = {
      id: this.cliente.id,
      name: this.cliente.name,
      phone: this.cliente.phone,
      email: this.cliente.email,
    };

    this.documentoCliente = JSON.stringify(datosQR);
this.showButtons=true;
    try {
      const qrUrl = await this.qrGen.uploadQRToFirebase(this.cliente.id);

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
