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
