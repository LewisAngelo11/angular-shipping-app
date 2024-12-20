import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';  // Importar CommonModule
import { response } from 'express';

@Component({
  selector: 'app-rastreo',
  imports: [CommonModule],
  templateUrl: './rastreo.component.html',
  styleUrl: './rastreo.component.css'
})
export class RastreoComponent {
  @ViewChild('numRastreo') NumRastreo!: ElementRef;

  constructor(private authService: AuthService) {}
  contenidoVisible = false;
  idEnvio: number | null = null;
  idPaquete: number | null = null;
  estatus: string | null = null;
  remitente: string | null = null;
  destinatario: string | null = null;
  status: string = ''; // Aquí se guarda el estado actual del paquete

  // Define el orden de los estatus
estatusOrden = [
  'Recibido',
  'En Tránsito',
  'En proceso de entrega a domicilio',
  'Entregado'
];

rastrear() {
  const rastreo = this.NumRastreo.nativeElement.value;

  this.authService.rastrearPaquete(rastreo).subscribe(
    (response) => {
      if (response.status === 'success') {
        this.contenidoVisible = !this.contenidoVisible;
        this.idEnvio = response.id_Envio;
        this.idPaquete = response.id_Paquete;
        this.estatus = response.Estatus;
        this.remitente = response.Remitente;
        this.destinatario = response.Destinatario;
        this.status = response.Estatus;
      } else {
        alert('Número de rastreo no válido');
      }
    },
    (error) => {
      console.error('Hubo un error:', error);
      alert('Error en el servidor. Intente más tarde.');
    }
  );
}

// Función para obtener la clase según el estatus
getColorForStatus(status: string): string {
  const currentStatusIndex = this.estatusOrden.indexOf(this.status);
  const statusIndex = this.estatusOrden.indexOf(status);

  // Si el estatus de la etiqueta es antes o igual al estado actual, se aplica el color
  if (statusIndex <= currentStatusIndex) {
    return 'estatusCompletado';  // Clase para los estatus previos
  } else {
    return 'estatusPendiente';  // Clase para los estatus futuros
  }
}
  

  mostrarContenido(){
    this.contenidoVisible = !this.contenidoVisible; 
  }

}
