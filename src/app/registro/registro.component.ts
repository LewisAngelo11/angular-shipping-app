import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-registro',
  imports: [RouterLink],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  title = "Crear Cuenta";
  
  @ViewChild('nombre') nombreInput!: ElementRef;
  @ViewChild('apellido1') apellido1Input!: ElementRef;
  @ViewChild('apellido2') apellido2Input!: ElementRef;
  @ViewChild('fecha') fechaInput!: ElementRef;
  @ViewChild('correo') correoInput!: ElementRef;
  @ViewChild('usuario') usuarioInput!: ElementRef;
  @ViewChild('contraseña') contrasenaInput!: ElementRef;

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) { }

  register() {
    // Expresiones regulares
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const usuarioRegex = /^[a-zA-Z0-9_]{4,20}$/;
    const dominiosValidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'protonmail.com'];

    // Extraer valores
    const nombre = this.nombreInput.nativeElement.value.trim();
    const apellido1 = this.apellido1Input.nativeElement.value.trim();
    const apellido2 = this.apellido2Input.nativeElement.value.trim();
    const fechaNacimientoStr = this.fechaInput.nativeElement.value;
    const email = this.correoInput.nativeElement.value.trim();
    const usuario = this.usuarioInput.nativeElement.value.trim();
    const contrasena = this.contrasenaInput.nativeElement.value;

    // Validar campos vacíos
    if (!nombre || !apellido1 || !apellido2 || !fechaNacimientoStr || !email || !usuario || !contrasena) {
      this.notificationService.warning('Por favor llene todos los campos del formulario.');
      return;
    }

    // Validar nombre y apellidos
    if (!nombreRegex.test(nombre)) {
      this.notificationService.warning('El nombre solo debe contener letras y espacios.');
      return;
    }

    if (!nombreRegex.test(apellido1)) {
      this.notificationService.warning('El apellido paterno solo debe contener letras y espacios.');
      return;
    }

    if (!nombreRegex.test(apellido2)) {
      this.notificationService.warning('El apellido materno solo debe contener letras y espacios.');
      return;
    }

    // Validar fecha de nacimiento
    const fechaNacimiento = new Date(fechaNacimientoStr);
    const hoy = new Date();

    if (fechaNacimiento > hoy) {
      this.notificationService.warning('La fecha de nacimiento no puede ser futura.');
      return;
    }

    // Calcular edad mínima (18 años)
    const fechaMinima = new Date(
      hoy.getFullYear() - 18,
      hoy.getMonth(),
      hoy.getDate()
    );

    if (fechaNacimiento > fechaMinima) {
      this.notificationService.warning('Debes tener al menos 18 años para registrarte.');
      return;
    }

    // Validar correo electrónico
    if (!emailRegex.test(email)) {
      this.notificationService.warning('Ingrese un correo electrónico válido.');
      return;
    }

    // Validar dominio del correo
    const dominioCorreo = email.split('@')[1];
    if (!dominiosValidos.includes(dominioCorreo)) {
      this.notificationService.warning('El correo debe pertenecer a un dominio válido (gmail, hotmail, outlook, yahoo, icloud, protonmail).');
      return;
    }

    // Validar nombre de usuario
    if (!usuarioRegex.test(usuario)) {
      this.notificationService.warning('El nombre de usuario debe tener entre 4 y 20 caracteres y solo puede contener letras, números o guiones bajos.');
      return;
    }

    // Validar contraseña
    if (contrasena.length < 8) {
      this.notificationService.warning('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (/\s/.test(contrasena)) {
      this.notificationService.warning('La contraseña no debe contener espacios.');
      return;
    }

    // Crear el objeto body
    const body = {
      Nombre: nombre,
      Apellido1: apellido1,
      Apellido2: apellido2,
      Fecha_Nacimiento: fechaNacimientoStr,
      Email: email,
      Usuario: usuario,
      Contrasena: contrasena
    };

    // Llamar al servicio de registro
    this.authService.register(body).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.notificationService.success('Usuario creado exitosamente');
          this.router.navigate(['/login']);
        } else {
          this.notificationService.error('Error al registrar el usuario');
        }
      },
      (error) => {
        console.error('Error en el registro:', error);
        this.notificationService.error('Error en el servidor. Intente más tarde.');
      }
    );
  }
}