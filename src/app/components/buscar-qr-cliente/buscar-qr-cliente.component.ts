import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { doc, getDoc, getFirestore } from 'firebase/firestore';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-buscar-qr-cliente',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './buscar-qr-cliente.component.html',
  styles: [],
})
export class BuscarQrClienteComponent {
  db = getFirestore();
  documento = '';
  qrUrl = '';
  clienteNombre = '';

  async buscarQR() {
    const ref = doc(this.db, 'clientes', this.documento);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data() as { qrUrl: string; name: string }; // 👈 Indicamos el tipo esperado
      this.qrUrl = data.qrUrl;
      this.clienteNombre = data.name;
    } else {
      this.qrUrl = '';
      this.clienteNombre = '';
      Swal.fire('❌ No encontrado', 'El cliente no está registrado', 'error');
    }
  }

  imprimirQR() {
    if (!this.qrUrl) return;

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
          <img src="${this.qrUrl}" alt="Código QR" onload="window.print(); window.onafterprint = () => window.close();" />
        </body>
      </html>
    `);

      doc.close();
    }
  }

  descargarQR() {
    if (!this.qrUrl) return;

    // Abre el QR en una nueva pestaña
    window.open(this.qrUrl, '_blank');

    // Muestra alerta con instrucciones
    Swal.fire({
      icon: 'info',
      title: 'Imagen abierta',
      text: 'Haz clic derecho sobre la imagen y selecciona "Guardar como..." para descargarla.',
      confirmButtonText: 'Entendido',
    });
  }
}
