import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { response } from 'express';

@Component({
  selector: 'app-registro',
  imports: [RouterOutlet, RouterLink],
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
  @ViewChild('contraseña') contraenaInput!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  register(){
      // Extraer los valores del formulario y crear el objeto body
    const body = {
      Nombre: this.nombreInput.nativeElement.value,
      Apellido1: this.apellido1Input.nativeElement.value,
      Apellido2: this.apellido2Input.nativeElement.value,
      Fecha_Nacimiento: this.fechaInput.nativeElement.value,
      Email: this.correoInput.nativeElement.value,
      Usuario: this.usuarioInput.nativeElement.value,
      Contrasena: this.contraenaInput.nativeElement.value
    };

  // Llamada al servicio de registro con el objeto body
    this.authService.register(body).subscribe(
      (response) => {
        if (response.status === 'success'){
          alert('Usuario creado exitosamente: ' + response.rol);
          this.router.navigate(['/login']); // Navega a la ruta '/login'
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
}
