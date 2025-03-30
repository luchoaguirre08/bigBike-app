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

  onCodeResult(result: string) {
    this.codeScanned.emit(result);
    console.log('QR escaneado', this.codeScanned.emit(result));
  }
  toggleScanner() {
    this.mostrarScanner = !this.mostrarScanner;
  }
}
