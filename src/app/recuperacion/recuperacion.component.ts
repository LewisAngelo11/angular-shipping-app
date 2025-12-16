import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-recuperacion',
  imports: [RouterOutlet, CommonModule],
  templateUrl: './recuperacion.component.html',
  styleUrl: './recuperacion.component.css'
})
export class RecuperacionComponent {
  @ViewChild('emailInput') emailInput!: ElementRef;
  @ViewChild('codigoInput') codigoInput!: ElementRef;
  @ViewChild('password1') pass1!: ElementRef;
  @ViewChild('password2') pass2!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  // Estados del flujo - 3 PASOS VISUALES
  currentStep: number = 1; // 1 = email, 2 = código (solo vista), 3 = contraseña
  emailUsuario: string = '';
  codigoIngresado: string = ''; // Guardar el código para el paso 3
  enviandoCodigo: boolean = false;
  verificandoCodigo: boolean = false; // Estado para verificar código
  cambiandoContrasena: boolean = false;

  // Control de reenvío
  puedeReenviar: boolean = false;
  tiempoRestante: number = 60;
  intervaloReenvio: any;

  // Mensajes dinámicos
  get stepMessage(): string {
    if (this.currentStep === 1) {
      return 'Ingresa tu correo electrónico para recibir un código de verificación';
    } else if (this.currentStep === 2) {
      return 'Revisa tu correo e ingresa el código de 6 dígitos';
    } else {
      return 'Crea una nueva contraseña segura para tu cuenta';
    }
  }

  // Método cuando cambia el email
  onEmailChange() {
    // Resetear estados si el usuario modifica el email
  }

  // Método para solo permitir números en el código
  onCodigoInput(event: any) {
    const input = event.target;
    input.value = input.value.replace(/[^0-9]/g, '');
  }

  // PASO 1: Enviar código de verificación por email
  enviarCodigo() {
    const email = this.emailInput.nativeElement.value.trim();

    // Validaciones
    if (!email) {
      this.notificationService.warning('Por favor ingrese su correo electrónico');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.notificationService.warning('Por favor ingrese un correo electrónico válido');
      return;
    }

    this.enviandoCodigo = true;

    // Llamar al servicio para solicitar el código
    this.authService.solicitarCodigoRecuperacion(email).subscribe(
      (response) => {
        this.enviandoCodigo = false;
        if (response.status === 'success') {
          this.emailUsuario = email;
          this.currentStep = 2; // Pasar al paso 2 (ingresar código)
          this.iniciarTemporizadorReenvio();
          this.notificationService.success('Código enviado. Revisa tu correo electrónico');
        } else {
          this.notificationService.error(response.mensaje || 'Error al enviar el código');
        }
      },
      (error) => {
        this.enviandoCodigo = false;
        console.error('Error al solicitar código:', error);
        if (error.status === 404) {
          this.notificationService.error('No existe una cuenta con este correo electrónico');
        } else {
          this.notificationService.error('Error al enviar el código. Intente más tarde');
        }
      }
    );
  }

  // PASO 2: Verificar código (SIN consumirlo) antes de pasar al paso 3
  verificarCodigo() {
    const codigo = this.codigoInput.nativeElement.value.trim();

    // Validaciones
    if (!codigo) {
      this.notificationService.warning('Por favor ingrese el código de verificación');
      return;
    }

    if (codigo.length !== 6) {
      this.notificationService.warning('El código debe tener 6 dígitos');
      return;
    }

    this.verificandoCodigo = true;

    // Validar código SIN consumirlo usando el nuevo endpoint
    this.authService.validarCodigoSolo(this.emailUsuario, codigo).subscribe(
      (response) => {
        this.verificandoCodigo = false;
        if (response.status === 'success') {
          // Código válido! Guardarlo y pasar al paso 3
          this.codigoIngresado = codigo;
          this.currentStep = 3;
          this.detenerTemporizadorReenvio();
          this.notificationService.success('Código verificado correctamente');
        } else {
          this.notificationService.error(response.mensaje || 'Código inválido');
        }
      },
      (error) => {
        this.verificandoCodigo = false;
        console.error('Error al verificar código:', error);
        if (error.status === 400) {
          this.notificationService.error('Código inválido o expirado');
        } else {
          this.notificationService.error('Error al verificar el código');
        }
      }
    );
  }

  // PASO 3: Verificar código y cambiar contraseña (TODO JUNTO)
  cambiarContrasena() {
    const password1 = this.pass1.nativeElement.value;
    const password2 = this.pass2.nativeElement.value;

    // Validaciones
    if (!password1 || !password2) {
      this.notificationService.warning('Por favor ingrese ambas contraseñas');
      return;
    }

    if (password1.length < 8) {
      this.notificationService.warning('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    if (password1 !== password2) {
      this.notificationService.error('Las contraseñas no coinciden');
      return;
    }

    this.cambiandoContrasena = true;

    // Ahora sí verificar código y cambiar contraseña
    this.authService.verificarCodigoRecuperacion(this.emailUsuario, this.codigoIngresado, password1).subscribe(
      (response) => {
        this.cambiandoContrasena = false;
        if (response.status === 'success') {
          this.notificationService.success('Contraseña cambiada correctamente');
          this.limpiarFormulario();
          // Redirigir al login después de 2 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          this.notificationService.error(response.mensaje || 'Error al cambiar la contraseña');
        }
      },
      (error) => {
        this.cambiandoContrasena = false;
        console.error('Error al cambiar contraseña:', error);
        if (error.status === 400) {
          this.notificationService.error('Código inválido o expirado');
        } else {
          this.notificationService.error('Error al cambiar la contraseña. Intente más tarde');
        }
      }
    );
  }

  // Volver al paso 1
  volverPaso1() {
    this.currentStep = 1;
    this.emailUsuario = '';
    this.codigoIngresado = '';
    this.detenerTemporizadorReenvio();
    this.limpiarCampos();
  }

  // Volver al paso 2 (para editar código)
  volverPaso2() {
    this.currentStep = 2;
    this.codigoIngresado = '';
    this.limpiarCamposContrasena();
  }

  // Reenviar código
  reenviarCodigo() {
    if (!this.puedeReenviar) {
      return;
    }

    this.enviandoCodigo = true;

    this.authService.solicitarCodigoRecuperacion(this.emailUsuario).subscribe(
      (response) => {
        this.enviandoCodigo = false;
        if (response.status === 'success') {
          this.iniciarTemporizadorReenvio();
          this.notificationService.success('Código reenviado correctamente');
          this.limpiarCampoCodigo();
        } else {
          this.notificationService.error('Error al reenviar el código');
        }
      },
      (error) => {
        this.enviandoCodigo = false;
        console.error('Error al reenviar código:', error);
        this.notificationService.error('Error al reenviar el código');
      }
    );
  }

  // Iniciar temporizador de reenvío (60 segundos)
  iniciarTemporizadorReenvio() {
    this.puedeReenviar = false;
    this.tiempoRestante = 60;

    this.intervaloReenvio = setInterval(() => {
      this.tiempoRestante--;
      if (this.tiempoRestante <= 0) {
        this.puedeReenviar = true;
        this.detenerTemporizadorReenvio();
      }
    }, 1000);
  }

  // Detener temporizador
  detenerTemporizadorReenvio() {
    if (this.intervaloReenvio) {
      clearInterval(this.intervaloReenvio);
      this.intervaloReenvio = null;
    }
  }

  // Limpiar formulario completo
  limpiarFormulario() {
    if (this.emailInput) this.emailInput.nativeElement.value = '';
    this.limpiarCampos();
    this.currentStep = 1;
    this.emailUsuario = '';
    this.codigoIngresado = '';
    this.detenerTemporizadorReenvio();
  }

  // Limpiar campos de código y contraseñas
  limpiarCampos() {
    this.limpiarCampoCodigo();
    this.limpiarCamposContrasena();
  }

  // Limpiar solo campo de código
  limpiarCampoCodigo() {
    if (this.codigoInput) {
      this.codigoInput.nativeElement.value = '';
    }
  }

  // Limpiar solo campos de contraseñas
  limpiarCamposContrasena() {
    if (this.pass1) {
      this.pass1.nativeElement.value = '';
    }
    if (this.pass2) {
      this.pass2.nativeElement.value = '';
    }
  }

  // Limpiar intervalo al destruir componente
  ngOnDestroy() {
    this.detenerTemporizadorReenvio();
  }
}
