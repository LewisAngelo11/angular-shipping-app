import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Aquí se importa FormsModule
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-cotizar',
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './cotizar.component.html',
  styleUrl: './cotizar.component.css'
})

export class CotizarComponent {
  contenidoVisible = false;
  title = "Lugar de origen y destino"
  title2 = "Destino"
  title3 = "Detalles del Paquete"
  title4 = "¿Quién Envía?"
  title5 = "¿Quién Recibe?"
  txtPeso = "Mi peso"
  txtPesoVM = "";
  txtTarifa = "";
  txtIVA = "";
  txtCosto = "";
  txtDistancia = "";
  // Propiedades para los datos del usuario
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  email: string = '';
  rows: number = 1;

  // Arreglo para mantener los datos de cada fila
  rowsData: { peso: string, largo: string, ancho: string, alto: string }[] = [
    { peso: '', largo: '', ancho: '', alto: '' }
  ];

  // Inputs de Origen
  @ViewChild('CP') CP!: ElementRef;
  @ViewChild('Municipio') Mun!: ElementRef;
  @ViewChild('Ciudad') CD!: ElementRef;
  @ViewChild('Estado') Entidad!: ElementRef;
  // Inputs de Destino
  @ViewChild('CPD') CPD!: ElementRef;
  @ViewChild('MunicipioD') MunD!: ElementRef;
  @ViewChild('EstadoD') EntidadD!: ElementRef;
  @ViewChild('CiudadD') CDD!: ElementRef;
  // Inputs del Remitente
  @ViewChild('nombreR') NombreR!: ElementRef;
  @ViewChild('ape1R') Apellido1R!: ElementRef;
  @ViewChild('ape2R') Apellido2R!: ElementRef;
  @ViewChild('emailR') EmailR!: ElementRef;
  // Inputs del Destinatario
  @ViewChild('nombreD') NombreD!: ElementRef;
  @ViewChild('ape1D') Apellido1D!: ElementRef;
  @ViewChild('ape2D') Apellido2D!: ElementRef;
  @ViewChild('emailD') EmailD!: ElementRef;
  @ViewChild('fechaR') FechaR!: ElementRef;
  @ViewChild('Tarifa') Tarifa!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object,
  private authService: AuthService, private router: Router) {}

  ngOnInit() {
    if(isPlatformBrowser(this.platformId)) {
      this.solicitarUbicacion();
      if (this.authService.isAuthenticated()){
        this.authService.ConsultarUser().subscribe(
          perfil => {
            this.nombre = perfil.Nombre;
            this.apellidoPaterno = perfil.Apellido1;
            this.apellidoMaterno = perfil.Apellido2;
            this.email = perfil.Email;
          },
          error => {
            console.error("Error al obtener el perfil:",error);
          }
        );  
      }
    }
  }

  // Función para solicitar la ubicacion actual del usuario
  solicitarUbicacion() {
    // Verifica si la geolocalización está disponible en el navegador
    if (navigator.geolocation) {
      // Solicita la ubicación actual del usuario
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Ubicación obtenida:', position.coords); // Muestra la ubicación obtenida en la consola
        },
        (error) => {
          console.error('Error al obtener ubicación:', error.message);
        }
      );
    } else {
      // Si la geolocalización no está soportada, se muestra un mensaje en la consola
      console.error('Geolocalización no soportada por el navegador.');
    }
  }

  buscarCPorigen(){
    const body = {
      CP: this.CP.nativeElement.value,
    };

    this.authService.EnocntrarCP(body).subscribe(
      (response) => {
        if (response.status === 'success'){
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
    if (this.rows < 10) {
      this.rows++;
      this.rowsData.push({ peso: '', largo: '', ancho: '', alto: '' });
    }
  }

  quitarFila(){
    if (this.rows > 1) {
      this.rows--;
      this.rowsData.pop();
    }
  }

  enviarDatos(){
    // Ejemplo de envío al backend si deseas enviar todos los paquetes
    const paquetes = this.rowsData.map(row => ({
      largo: row.largo,
      ancho: row.ancho,
      alto: row.alto,
      peso: row.peso,
    }));

    const body = {
      paquetes: paquetes,
      EntidadO: this.Entidad.nativeElement.value,
      MunicipioO: this.Mun.nativeElement.value,
      LocalidadO: this.CD.nativeElement.value,
      MunicipioD: this.MunD.nativeElement.value,
      EntidadD: this.EntidadD.nativeElement.value,
      LocalidadD: this.CDD.nativeElement.value,
    }

    console.log(this.rowsData);  // Aquí tienes TODAS las filas con sus valores

    //Lamo al servicio cotizarpaquete que lo que hara es llamar al web service calculador del peso volumetrico
    this.authService.CotizarPaquete(body).subscribe(
      (response) => {
        if (response.status === 'success'){
          this.contenidoVisible = true;

          this.txtTarifa = "$" + response.tarifa;
          this.txtPeso = body.paquetes.map(p => p.peso).join(", ") + " Kg";
          this.txtPesoVM = response.pesovm.join(", ") + " Kg";

          const tarifa = Number(response.tarifa);
          this.txtIVA = "$" + (tarifa * 0.16).toFixed(2);
          this.txtCosto = "$" + (tarifa + (tarifa * 0.16)).toFixed(2);
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
  }

  EnviarPaquete(){
    const paquetes = this.rowsData.map(row => ({
      largo: row.largo,
      ancho: row.ancho,
      alto: row.alto,
      peso: row.peso,
    }));

    const body = {
      tarifa: this.txtCosto,
      Origen: this.Entidad.nativeElement.value + "," + this.CD.nativeElement.value,
      Destino: this.EntidadD.nativeElement.value + "," + this.CDD.nativeElement.value + "," + this.MunD.nativeElement.value,
      NombreR: this.NombreR.nativeElement.value,
      ApellidoR: this.Apellido1R.nativeElement.value,
      Apellido2R: this.Apellido2R.nativeElement.value,
      EmailR: this.EmailR.nativeElement.value,
      NombreD: this.NombreD.nativeElement.value,
      ApellidoD: this.Apellido1D.nativeElement.value,
      Apellido2D: this.Apellido2D.nativeElement.value,
      EmailD: this.EmailD.nativeElement.value,
      FechaR: this.FechaR.nativeElement.value,
      paquetes: paquetes
    }

    this.authService.enviarpaquete(body).subscribe(
      (response) => {
        if (response.status === 'success'){
          alert('Entrega añadida Codigo de rastreo: ' + response.Rastreo_Code);
        } else {
          alert('Error al registrar la entrega');
        }
      },
      (error) =>{
        console.error('Hubo un error:', error);
        alert('Error en el servidor. Intente más tarde.');
      }
    );
  }
}
