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
  @ViewChild('user') user!: ElementRef;
  @ViewChild('password1') pass1!: ElementRef;
  @ViewChild('password2') pass2!: ElementRef;
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  contraseñaIncorrecta: boolean = false; // Variable para validar la coincidencia de las nuevas contraseñas
  emailVerificado: boolean | null = null; // null = no verificado, true = existe, false = no existe
  verificandoEmail: boolean = false; // Indica si está en proceso de verificación

  // Método para resetear el estado de verificación cuando el usuario modifica el email
  onEmailChange() {
    this.emailVerificado = null;
  }

  // Método para verificar si el email existe en la base de datos
  verificarCorreo() {
    const email = this.user.nativeElement.value.trim();

    if (!email) {
      this.notificationService.warning('Por favor ingrese un correo electrónico');
      return;
    }

    // Validación básica de formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.notificationService.warning('Por favor ingrese un correo electrónico válido');
      return;
    }

    this.verificandoEmail = true;

    this.authService.verificarEmail(email).subscribe(
      (response) => {
        this.verificandoEmail = false;
        if (response.existe) {
          this.emailVerificado = true;
          this.notificationService.success('Correo electrónico encontrado');
        } else {
          this.emailVerificado = false;
          this.notificationService.error('No existe una cuenta con este correo electrónico');
        }
      },
      (error) => {
        this.verificandoEmail = false;
        this.emailVerificado = false;
        console.error('Error al verificar email:', error);
        this.notificationService.error('Error al verificar el correo electrónico');
      }
    );
  }

  // Método para cambiar la contraseña
  actualizarContrasena() {
    // Verificar que el email haya sido verificado
    if (!this.emailVerificado) {
      this.notificationService.warning('Por favor verifique su correo electrónico primero');
      return;
    }

    const password1Value = this.pass1.nativeElement.value;
    const password2Value = this.pass2.nativeElement.value;

    // Validar que las contraseñas no estén vacías
    if (!password1Value || !password2Value) {
      this.notificationService.warning('Por favor ingrese ambas contraseñas');
      return;
    }

    // Validar longitud mínima
    if (password1Value.length < 8) {
      this.notificationService.warning('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    // Crea el objeto que se enviará al backend para cambiar la contraseña
    const body = {
      Email: this.user.nativeElement.value,
      NuevaContrasena: password1Value,
    };

    // Compara si las dos contraseñas introducidas son iguales
    if (password1Value === password2Value) {
      this.contraseñaIncorrecta = false;

      // Realiza la llamada al servicio para cambiar la contraseña en el backend
      this.authService.cambiarContrasena(body).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.notificationService.success('Contraseña cambiada correctamente');
            // Limpiar los campos
            this.user.nativeElement.value = '';
            this.pass1.nativeElement.value = '';
            this.pass2.nativeElement.value = '';
            this.emailVerificado = null;
            // Redirigir al login después de 2 segundos
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 2000);
          }
        },
        (error) => {
          console.error('Error al cambiar la contraseña:', error);
          this.notificationService.error('Ocurrió un error al intentar cambiar la contraseña.');
        }
      )
    } else {
      this.contraseñaIncorrecta = true;
      this.notificationService.error('Las contraseñas no coinciden.');
    }
  }

}
