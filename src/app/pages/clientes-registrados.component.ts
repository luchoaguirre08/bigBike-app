import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
  setDoc,
} from 'firebase/firestore';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-clientes-registrados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes-registrados.component.html',
})
export class ClientesRegistradosComponent implements OnInit {
  clientes: any[] = [];
  clienteExpandido: number | null = null;
  db = getFirestore();

  async ngOnInit() {
    const snapshot = await getDocs(collection(this.db, 'clientes'));
    this.clientes = snapshot.docs.map((doc) => ({
      idDoc: doc.id,
      ...doc.data(),
    }));
  }

  toggleCliente(index: number) {
    this.clienteExpandido = this.clienteExpandido === index ? null : index;
  }

  async guardarCambios(cliente: any) {
    const { isConfirmed } = await Swal.fire({
      title: '¿Guardar cambios?',
      text: 'Estás a punto de actualizar la información del cliente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, guardar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    });

    if (!isConfirmed) return;

    try {
      await setDoc(doc(this.db, 'clientes', cliente.id), cliente);
      Swal.fire({
        title: '¡Actualizado!',
        text: 'La información del cliente se ha guardado correctamente.',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      Swal.fire('Error', 'Hubo un problema al guardar los cambios.', 'error');
    }
  }
}
