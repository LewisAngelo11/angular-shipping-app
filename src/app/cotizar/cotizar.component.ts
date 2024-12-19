import { Component,ViewChild,ElementRef } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../auth.service';
import { response } from 'express';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cotizar',
  imports: [RouterOutlet, RouterLink,CommonModule],
  templateUrl: './cotizar.component.html',
  styleUrl: './cotizar.component.css'
})
export class CotizarComponent {
  contenidoVisible = false;
  title = "Origen"
  title2 = "Destino"
  title3 = "Paquetes"
  txtPeso = "Mi peso"
  txtPesoVM = ""
  txtTarifa = ""
  txtIVA = ""
  txtCosto = ""
  txtDistancia = ""
  @ViewChild('CP') CP!: ElementRef;
  @ViewChild('Municipio') Mun!: ElementRef;
  @ViewChild('Ciudad') CD!: ElementRef;
  @ViewChild('Estado') Entidad!: ElementRef;
  @ViewChild('CPD') CPD!: ElementRef;
  @ViewChild('MunicipioD') MunD!: ElementRef;
  @ViewChild('EstadoD') EntidadD!: ElementRef;
  @ViewChild('CiudadD') CDD!: ElementRef;
  @ViewChild('Peso') Peso!: ElementRef;
  @ViewChild('Largo') Largo!: ElementRef;
  @ViewChild('Alto')Alto!: ElementRef;
  @ViewChild('Ancho') Ancho!: ElementRef;
  @ViewChild('Tarifa') Tarifa!: ElementRef;
  constructor(private authService: AuthService) {}

  buscarCPorigen(){

    const body = {
      CP: this.CP.nativeElement.value,
    };

    this.authService.EnocntrarCP(body).subscribe(
      (response) => {
        if (response.status === 'success'){
          //alert('datos obtenidos: ' + response.rol);
          this.Mun.nativeElement.value = response.municipio
          this.CD.nativeElement.value = response.localidad
          this.Entidad.nativeElement.value = response.entidad
        } else {
          alert('Error al registrar el usuario');
        }
      },
      (error) =>{
        console.error('Error en el inicio de sesión:', error);
        alert('Error en el servidor. Intente más tarde.');
      }
    );

  }

  buscarCPdestino(){

    const body = {
      CP: this.CPD.nativeElement.value,
    };

    this.authService.EnocntrarCP(body).subscribe(
      (response) => {
        if (response.status === 'success'){
          //alert('datos obtenidos exitosamente: ' + response.rol);
          this.MunD.nativeElement.value = response.municipio
          this.CDD.nativeElement.value = response.localidad
          this.EntidadD.nativeElement.value = response.entidad
        } else {
          alert('Error al registrar el usuario');
        }
      },
      (error) =>{
        console.error('Error en el inicio de sesión:', error);
        alert('Error en el servidor. Intente más tarde.');
      }
    );

  }

  agregarFila(){
      
  }

  enviarDatos(){
    const body = {
      Largo: this.Largo.nativeElement.value,
      Ancho: this.Ancho.nativeElement.value,
      Alto: this.Alto.nativeElement.value,
      Peso: this.Peso.nativeElement.value,
      EntidadO: this.Entidad.nativeElement.value,
      MunicipioO: this.Mun.nativeElement.value,
      LocalidadO: this.CD.nativeElement.value,
      MunicipioD: this.MunD.nativeElement.value,
      EntidadD: this.EntidadD.nativeElement.value,
      LocalidadD: this.CDD.nativeElement.value,
    }

    //Lamo al servicio cotizarpaquete que lo que hara es llamar al web service calculador del peso volumetrico
    this.authService.CotizarPaquete(body).subscribe(
      (response) => {
        if (response.status === 'success'){
          alert('datos obtenidos exitosamente: ' + response.rol);
          this.contenidoVisible = true; 
          this.txtTarifa = "$" + response.tarifa;
          this.txtPeso = this.Peso.nativeElement.value + " Kg";
          this.txtPesoVM = response.pesovm + " Kg";
          this.txtIVA = String("$" + (Number(response.tarifa)*16)/100)
          this.txtCosto = "$" + String((Number(response.tarifa) + (Number(response.tarifa)*16)/100))
          this.txtDistancia = response.distancia + " Km";

        } else {
          alert('Error al registrar el usuario');
        }
      },
      (error) =>{
        console.error('Hubo un error:', error);
        alert('Error en el servidor. Intente más tarde.');
      }
    );
  }
  mostrarContenido() { 
    this.contenidoVisible = !this.contenidoVisible; 
    this.txtPeso = this.Peso.nativeElement.value;
  }
    //PesoH = this.Peso.nativeElement.value;
}
