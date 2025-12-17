import { Component, ViewChild, ElementRef, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Aquí se importa FormsModule
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-cotizar',
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
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
  txtFechaEntrega = "";
  // Propiedades para los datos del usuario
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  telefono: string = '';
  email: string = '';
  rows: number = 1;
  isAutenticated = false;

  asentamientosOrigen: string[] = [];
  asentamientosDestino: string[] = [];

  // Arreglo para mantener los datos de cada fila
  rowsData: { peso: string, largo: string, ancho: string, alto: string }[] = [
    { peso: '', largo: '', ancho: '', alto: '' }
  ];

  // Inputs de Origen
  @ViewChild('CP') CP!: ElementRef;
  @ViewChild('Municipio') Mun!: ElementRef;
  @ViewChild('Ciudad') CD!: ElementRef;
  @ViewChild('Estado') Entidad!: ElementRef;
  @ViewChild('AsentamientoOrigen') AsentamientoOrigen!: ElementRef;
  @ViewChild('DireccionOrigen') DireccionOrigen!: ElementRef;
  // Inputs de Destino
  @ViewChild('CPD') CPD!: ElementRef;
  @ViewChild('MunicipioD') MunD!: ElementRef;
  @ViewChild('EstadoD') EntidadD!: ElementRef;
  @ViewChild('CiudadD') CDD!: ElementRef;
  @ViewChild('AsentamientoDestino') AsentamientoDestino!: ElementRef;
  @ViewChild('DireccionDestino') DireccionDestino!: ElementRef;
  // Inputs del Remitente
  @ViewChild('nombreR') NombreR!: ElementRef;
  @ViewChild('ape1R') Apellido1R!: ElementRef;
  @ViewChild('ape2R') Apellido2R!: ElementRef;
  @ViewChild('phoneR') TeledonoR!: ElementRef;
  @ViewChild('emailR') EmailR!: ElementRef;
  // Inputs del Destinatario
  @ViewChild('nombreD') NombreD!: ElementRef;
  @ViewChild('ape1D') Apellido1D!: ElementRef;
  @ViewChild('ape2D') Apellido2D!: ElementRef;
  @ViewChild('phoneD') TelefonoD!: ElementRef;
  @ViewChild('emailD') EmailD!: ElementRef;
  @ViewChild('Tarifa') Tarifa!: ElementRef;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.solicitarUbicacion();
      if (this.authService.isAuthenticated()) {
        this.authService.ConsultarUser().subscribe(
          perfil => {
            this.nombre = perfil.Nombre;
            this.apellidoPaterno = perfil.Apellido1;
            this.apellidoMaterno = perfil.Apellido2;
            this.telefono = perfil.Telefono;
            this.email = perfil.Email;
          },
          error => {
            console.error("Error al obtener el perfil:", error);
          }
        );
      }
    }
    this.isAutenticated = !!localStorage.getItem('authToken');
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

  goToLogin() {
    this.router.navigate(['login'])
  }

  buscarCPorigen() {
    const body = {
      CP: this.CP.nativeElement.value,
    };

    this.authService.EnocntrarCP(body).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.Mun.nativeElement.value = response.municipio;
          this.CD.nativeElement.value = response.localidad;
          this.Entidad.nativeElement.value = response.entidad;
          
          // Aqui carga los asentamientos relacionados a ese CP de origen
          this.asentamientosOrigen = response.asentamientos || [];
          
          console.log(`${this.asentamientosOrigen.length} asentamientos cargados`);
        } else {
          this.notificationService.error('Error al buscar el código postal');
          this.asentamientosOrigen = []; // Limpiar si hay error
        }
      },
      (error) => {
        console.error('Error en el inicio de sesión:', error);
        this.notificationService.error('Error en el servidor. Intente más tarde.');
        this.asentamientosOrigen = [];
      }
    );
  }

  buscarCPdestino() {
    const body = {
      CP: this.CPD.nativeElement.value,
    };

    this.authService.EnocntrarCP(body).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.MunD.nativeElement.value = response.municipio;
          this.CDD.nativeElement.value = response.localidad;
          this.EntidadD.nativeElement.value = response.entidad;
          
          // Aqui carga los asentamientos relacionados al CP de destino
          this.asentamientosDestino = response.asentamientos || [];
          
          console.log(`${this.asentamientosDestino.length} asentamientos cargados`);
        } else {
          this.notificationService.error('Error al buscar el código postal');
          this.asentamientosDestino = [];
        }
      },
      (error) => {
        console.error('Error en el inicio de sesión:', error);
        this.notificationService.error('Error en el servidor. Intente más tarde.');
        this.asentamientosDestino = [];
      }
    );
  }

  agregarFila() {
    if (this.rows < 10) {
      this.rows++;
      this.rowsData.push({ peso: '', largo: '', ancho: '', alto: '' });
    }
  }

  quitarFila() {
    if (this.rows > 1) {
      this.rows--;
      this.rowsData.pop();
    }
  }

  enviarDatos() {
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

    console.log(this.rowsData);

    this.authService.CotizarPaquete(body).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.contenidoVisible = true;

          this.txtTarifa = "$" + response.tarifa;
          this.txtPeso = body.paquetes.map(p => p.peso).join(", ") + " Kg";
          this.txtPesoVM = response.pesovm.join(", ") + " Kg";

          const tarifa = Number(response.tarifa);
          this.txtIVA = "$" + (tarifa * 0.16).toFixed(2);
          this.txtCosto = "$" + (tarifa + (tarifa * 0.16)).toFixed(2);
          this.txtDistancia = response.distancia + " Km";
          
          // ✨ GUARDAR LA FECHA ESTIMADA
          this.txtFechaEntrega = response.fecha_entrega;
          
          console.log(`Fecha estimada de entrega: ${this.txtFechaEntrega}`);
        } else {
          this.notificationService.error('Error al cotizar el paquete');
        }
      },
      (error) => {
        console.error('Hubo un error:', error);
        this.notificationService.error('Error en el servidor. Intente más tarde.');
      }
    );
  }

  mostrarContenido() {
    this.contenidoVisible = !this.contenidoVisible;
  }


  EnviarPaquete() {
    const paquetes = this.rowsData.map(row => ({
      largo: row.largo,
      ancho: row.ancho,
      alto: row.alto,
      peso: row.peso,
    }));

    // VALIDACIONES
    if (!this.AsentamientoOrigen?.nativeElement?.value) {
      this.notificationService.error('Por favor selecciona un asentamiento de origen');
      return;
    }

    if (!this.AsentamientoDestino?.nativeElement?.value) {
      this.notificationService.error('Por favor selecciona un asentamiento de destino');
      return;
    }

    if (!this.DireccionOrigen?.nativeElement?.value) {
      this.notificationService.error('Por favor ingresa la dirección de origen');
      return;
    }

    if (!this.DireccionDestino?.nativeElement?.value) {
      this.notificationService.error('Por favor ingresa la dirección de destino');
      return;
    }

    if (!this.EmailD?.nativeElement?.value) {
      this.notificationService.error('Por favor ingresa el email del destinatario');
      return;
    }

    if (!this.TelefonoD?.nativeElement?.value) {
      this.notificationService.error('Por favor ingresa el teléfono del destinatario');
      return;
    }

    const body = {
      tarifa: this.txtCosto,
      Origen: `${this.Entidad.nativeElement.value}, ${this.CD.nativeElement.value}, ${this.Mun.nativeElement.value}`,
      DireccionOrigen: `${this.AsentamientoOrigen.nativeElement.value}, ${this.DireccionOrigen.nativeElement.value}`,
      Destino: `${this.EntidadD.nativeElement.value}, ${this.CDD.nativeElement.value}, ${this.MunD.nativeElement.value}`,
      DireccionDestino: `${this.AsentamientoDestino.nativeElement.value}, ${this.DireccionDestino.nativeElement.value}`,
      NombreR: this.NombreR.nativeElement.value,
      ApellidoR: this.Apellido1R.nativeElement.value,
      Apellido2R: this.Apellido2R.nativeElement.value,
      TelefonoR: this.TeledonoR.nativeElement.value,
      EmailR: this.EmailR.nativeElement.value,
      NombreD: this.NombreD.nativeElement.value,
      ApellidoD: this.Apellido1D.nativeElement.value,
      Apellido2D: this.Apellido2D.nativeElement.value,
      TelefonoD: this.TelefonoD.nativeElement.value,
      EmailD: this.EmailD.nativeElement.value,
      FechaEntrega: this.txtFechaEntrega,  // ✨ ENVIAR LA FECHA CALCULADA
      paquetes: paquetes
    };

    console.log('Datos a enviar:', body);

    this.authService.enviarpaquete(body).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.notificationService.success(`Entrega añadida. Código de rastreo: ${response.Rastreo_Code}. Fecha estimada de entrega: ${this.txtFechaEntrega}`);
          this.limpiarFormulario();
        } else {
          this.notificationService.error('Error al registrar la entrega');
        }
      },
      (error) => {
        console.error('Hubo un error:', error);
        this.notificationService.error('Error en el servidor. Intente más tarde.');
      }
    );
  }

  limpiarFormulario() {
    // Limpiar origen
    this.CP.nativeElement.value = '';
    this.Mun.nativeElement.value = '';
    this.CD.nativeElement.value = '';
    this.Entidad.nativeElement.value = '';
    this.DireccionOrigen.nativeElement.value = '';
    this.asentamientosOrigen = [];

    // Limpiar destino
    this.CPD.nativeElement.value = '';
    this.MunD.nativeElement.value = '';
    this.CDD.nativeElement.value = '';
    this.EntidadD.nativeElement.value = '';
    this.DireccionDestino.nativeElement.value = '';
    this.asentamientosDestino = [];

    // Limpiar destinatario
    this.NombreD.nativeElement.value = '';
    this.Apellido1D.nativeElement.value = '';
    this.Apellido2D.nativeElement.value = '';
    this.EmailD.nativeElement.value = '';
    this.TelefonoD.nativeElement.value = '';

    // Limpiar paquetes
    this.rows = 1;
    this.rowsData = [{ peso: '', largo: '', ancho: '', alto: '' }];

    // Limpiar fecha
    this.txtFechaEntrega = '';

    // Ocultar detalle del servicio
    this.contenidoVisible = false;
  }
}
