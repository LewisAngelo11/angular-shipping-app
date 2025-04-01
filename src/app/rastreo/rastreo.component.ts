import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';  // Importar CommonModule

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
  status: string = 'DESCONOCIDO'; // Aquí se guarda el estado actual del paquete
  mensajeError: string | null = null; // Nuevo campo para manejar errores

  rastrear() {
    const rastreo = this.NumRastreo.nativeElement.value.trim(); // Elimina espacios en blanco

    if (!rastreo || rastreo.length !== 20) { // Validación previa en frontend
      this.mensajeError = 'Por favor, ingrese un número de rastreo válido de 20 dígitos.';
      return;
    }

    this.mensajeError = ''; // Borra el mensaje si todo está bien
    
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
        }
      },
      (error) => {
        if (error.status === 401){
          this.mensajeError = 'El número de rastreo ingresado no es válido. Verifique e intente nuevamente.';
        }
        console.error('Error en la solicitud:', error);
        this.mensajeError = 'Hubo un problema con el servidor. Intente nuevamente más tarde.';
      }
    );
  }

  getStatusColor(status: string) {
    // Cambia el color de acuerdo con el estatus
    if (this.status !== status) return '#002fff'; // Azul por defecto

    switch (status) {
      case 'EN PROCESO':
      case 'ENVIADO':
      case 'EN ENTREGA A DOMICILIO':
        return 'rgb(186, 0, 0)'; // Rojo
      case 'ENTREGADO':
        return 'rgb(15, 220, 1)' // Verde
      default:
        return '#002fff' // Si no es el estatus actual, no cambiar el color
    }
  }
  
  mostrarContenido(){
    this.contenidoVisible = !this.contenidoVisible; 
  }

}
