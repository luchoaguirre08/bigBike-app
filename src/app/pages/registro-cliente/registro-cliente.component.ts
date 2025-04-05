import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QrGeneratorComponent } from 'src/app/components/qr-generator/qr-generator.component';
import { FormsModule, NgForm } from '@angular/forms';
import { addDoc, collection, doc, getFirestore, setDoc } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { BuscarQrClienteComponent } from 'src/app/components/buscar-qr-cliente/buscar-qr-cliente.component';
import { Citas } from 'src/app/models/appointment';

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [
    CommonModule,
    QrGeneratorComponent,
    FormsModule,
    BuscarQrClienteComponent,
  ],
  templateUrl: './registro-cliente.component.html',
  styles: [],
})
export class RegistroClienteComponent {
  db = getFirestore();
  cliente: Citas = { name: '', phone: '', id: '', qrUrl: '' };
  ultimoClienteRegistrado: Citas | null = null;
  documentoCliente = '';
  showButtons: boolean = false;
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
    };

    this.documentoCliente = JSON.stringify(datosQR);
    this.showButtons = true;
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const qrUrl = await this.qrGen.uploadQRToFirebase(this.cliente.id);
      this.cliente.qrUrl = qrUrl || ''; // ✅ asignar directamente

      const clienteCompleto = {
        ...this.cliente,
      };

      await setDoc(doc(this.db, 'clientes', this.cliente.id), clienteCompleto);
      this.ultimoClienteRegistrado = { ...clienteCompleto };
      form.resetForm();
      this.documentoCliente = '';
    } catch (error) {
      console.error('Error al guardar cliente:', error);
    }
  }
  sendQRToWhatsApp(phone: string) {
    if (!this.cliente.qrUrl || !this.ultimoClienteRegistrado?.name) {
      Swal.fire({
        icon: 'info',
        title: 'Código QR aún no disponible',
        text: 'Por favor, espera unos segundos mientras se genera el código QR.',
      });
      return;
    }

    const numero = phone;

    const mensaje = encodeURIComponent(
      `🚴‍♂️ ¡Hola ${this.ultimoClienteRegistrado.name}!\n\nGracias por registrarte en Big Bike Workshop.\n\nAquí tienes tu código QR para futuras citas:\n[🔗 Código QR](${this.ultimoClienteRegistrado.qrUrl})\n\n✅ Guarda esta imagen para usarla en nuestros servicios.`
    );


    const url = `https://wa.me/57${numero}?text=${mensaje}`;
    window.open(url, '_blank');
  }

  printQR() {
    const canvas = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    if (!canvas) return;

    const imageData = canvas.toDataURL('image/png');
    const printWindow = window.open('', '_blank');

    if (printWindow) {
      const doc = printWindow.document;

      doc.write(`
      <html>
        <head>
          <title>Imprimir QR</title>
          <style>
            @media print {
              body {
                margin: 0;
              }
              img {
                max-width: 100vw;
                max-height: 100vh;
                width: 100%;
                height: 100%;
                object-fit: contain;
                display: block;
                margin: 0 auto;
              }
            }
            body {
              margin: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100vh;
              background: white;
            }
            img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
          </style>
        </head>
        <body>
          <img src="${imageData}" alt="Código QR" />
        </body>
      </html>
    `);

      doc.close();

      // Esperar a que la imagen cargue antes de imprimir
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
        // Opcional: cerrar después de imprimir
        printWindow.onafterprint = () => printWindow.close();
      };
    }
  }
}
