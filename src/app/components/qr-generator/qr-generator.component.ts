import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QRCodeModule } from 'angularx-qrcode';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

@Component({
  selector: 'app-qr-generator',
  standalone: true,
  imports: [CommonModule, QRCodeModule],
  templateUrl: './qr-generator.component.html',
})
export class QrGeneratorComponent {
  @Input() value!: string;

  downloadQR() {
    const canvas = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'cliente-qr.png';
    link.click();
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

  private getQRBlob(): Promise<Blob | null> {
    const canvas = document.querySelector('qrcode canvas') as HTMLCanvasElement;
    return new Promise((resolve) => {
      if (canvas) {
        canvas.toBlob((blob) => resolve(blob), 'image/png');
      } else {
        resolve(null);
      }
    });
  }

  // ✅ Subir QR como imagen a Firebase
  async uploadQRToFirebase(fileName: string): Promise<string | null> {
    const blob = await this.getQRBlob();
    if (!blob) return null;

    const storage = getStorage();
    const filePath = `qr-codes/${fileName}.png`;
    const storageRef = ref(storage, filePath);

    try {
      const snapshot = await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error) {
      console.error('Error al subir QR', error);
      return null;
    }
  }
}
