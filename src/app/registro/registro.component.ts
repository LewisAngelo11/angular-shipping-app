import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { response } from 'express';
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.[A-Za-z])(?=.\d)[A-Za-z\d@$!%*?&]{8,}$/;
    const nombreRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
    const dominiosValidos = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'icloud.com', 'protonmail.com'];
    const usuarioRegex = /^[a-zA-Z0-9_]{4,20}$/;

    // Extraer valores antes de usarlos
    const nombre = this.nombreInput.nativeElement.value.trim();
    const apellido1 = this.apellido1Input.nativeElement.value.trim();
    const apellido2 = this.apellido2Input.nativeElement.value.trim();
    const fechaNacimientoStr = this.fechaInput.nativeElement.value;
    const fechaNacimiento = new Date(fechaNacimientoStr);
    const hoy = new Date();
    const email = this.correoInput.nativeElement.value.trim();
    const usuario = this.usuarioInput.nativeElement.value.trim();
    const contrasena = this.contrasenaInput.nativeElement.value;

    // Calcular la fecha máxima permitida, tener minimo 18 años
    const fechaMinima = new Date(
      hoy.getFullYear() - 18,
      hoy.getMonth(),
      hoy.getDate()
    );

    // Validar campos vacíos
    if (!nombre || !apellido1 || !apellido2 || !fechaNacimiento || !email || !usuario || !contrasena) {
      this.notificationService.warning('Por favor llene todos los campos del formulario.');
      return;
    }

    // Validar nombre y apellidos
    if (!nombreRegex.test(nombre) || !nombreRegex.test(apellido1) || !nombreRegex.test(apellido2)) {
      this.notificationService.warning('Nombre y apellidos solo deben contener letras y espacios.');
      return;
    }

    // Validacion sobre el dominio de correo
    const dominioCorreo = email.split('@')[1];
    if (!dominiosValidos.includes(dominioCorreo)) {
      this.notificationService.warning('El correo debe pertenecer a un dominio válido.');
      return;
    }

    // Validaciones de correo
    if (!emailRegex.test(email)) {
      this.notificationService.warning('Ingrese un correo electrónico válido.');
      return;
    }

    if (!emailRegex.test(email)) {
      this.notificationService.warning('Ingrese un correo electrónico válido.');
      return;
    }
    // validar nombre de usuario
    if (!usuarioRegex.test(usuario)) {
      this.notificationService.warning('El nombre de usuario debe tener entre 4 y 20 caracteres y solo puede contener letras, números o guiones bajos.');
      return;
    }

    // Validaciones de contraseña
    if (contrasena.length < 8) {
      this.notificationService.warning('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (/\s/.test(contrasena)) {
      this.notificationService.warning('La contraseña no debe contener espacios.');
      return;
    }

    //if (!passwordRegex.test(contrasena)) {
    //alert('La contraseña debe contener al menos una letra y un número para mayor seguridad.');
    //return;
    //}

    // Validacion de fecha (que no sea futura)
    const fecha = new Date(fechaNacimiento);
    if (fecha > hoy) {
      this.notificationService.warning('La fecha de nacimiento no puede ser futura.');
      return;
    }

    // Crear el objeto body
    const body = {
      Nombre: nombre,
      Apellido1: apellido1,
      Apellido2: apellido2,
      Fecha_Nacimiento: this.fechaInput.nativeElement.value,
      Email: email,
      Usuario: usuario,
      Contrasena: contrasena
    };

    if (fechaNacimiento > fechaMinima) {
      this.notificationService.warning('Debes tener al menos 18 años para registrarte.');
      return;
    }

    // Llamar al servicio
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