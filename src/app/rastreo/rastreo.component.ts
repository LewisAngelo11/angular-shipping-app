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
          console.log(this.status); // Verifica el valor de status
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

  getStatusColor(status: string) {
    // Cambia el color de acuerdo con el estatus
    if (this.status === status) {
      if (status === 'EN PROCESO') return 'rgb(186, 0, 0)';
      else if (status === 'ENVIADO') return 'rgb(186, 0, 0)';
      else if (status === 'ENTREGA') return 'rgb(186, 0, 0)';
      else if (status === 'ENTREGADO') return 'rgb(15, 220, 1)';
    }
    return '#002fff'; // Si no es el estatus actual, no cambiar el color
  }
  
  mostrarContenido(){
    this.contenidoVisible = !this.contenidoVisible; 
  }

}
