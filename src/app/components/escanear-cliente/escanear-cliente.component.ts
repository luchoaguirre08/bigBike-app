import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-escanear-cliente',
  standalone: true,
  imports: [CommonModule, ZXingScannerModule],
  templateUrl: './escanear-cliente.component.html',
})
export class EscanearClienteComponent {
  formats = [BarcodeFormat.QR_CODE];
  mostrarScanner = false;
  @Output() codeScanned = new EventEmitter<string>();

  isProcessing = false;

  onCodeResult(result: string) {
    if (this.isProcessing) return; // evitar doble lectura

    this.isProcessing = true;
    this.codeScanned.emit(result);
    this.mostrarScanner = false;

    setTimeout(() => (this.isProcessing = false), 1000); // espera 1 seg para permitir escaneo de nuevo
  }
  toggleScanner() {
    this.mostrarScanner = !this.mostrarScanner;
  }
}
