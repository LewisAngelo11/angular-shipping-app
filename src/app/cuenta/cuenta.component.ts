import { Component, ElementRef, ViewChild } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { response } from 'express';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Aquí se importa FormsModule
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-cuenta',
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.css'
})
export class CuentaComponent {
  title = "Mi Cuenta."
  isDisabled: boolean = true;   // Variable para controlar el estado de los inputs (inicialmente deshabilitados)
  ContenidoVisibleInfo = false;
  ContenidoVisibleDelete = false;
  // Función para habilitar los inputs al presionar el botón
  // Propiedades para los datos del usuario
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  email: string = '';
  username: string = '';
  password: string = '';
  @ViewChild('Contraseña') Contraseña!: ElementRef;
  @ViewChild('ContraseñaC') ContraseñaC!: ElementRef;
  @ViewChild('Nombre') Nombre!: ElementRef;
  @ViewChild('Apellido1') Apellido1!: ElementRef;
  @ViewChild('User') User!: ElementRef;
  @ViewChild('Apellido2') Apellido2!: ElementRef;
  @ViewChild('Correo') Correo!: ElementRef;
  @ViewChild('NombreB') NombreB!: ElementRef;
  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Obtener el token del localStorage (suponiendo que ya se ha guardado al iniciar sesión)
    const token = localStorage.getItem('authToken'); // O donde tengas el token almacenado
    
    if (token) {
      // Decodificar el token
      const decodedToken: any = jwtDecode(token);
      
      // Asignar los valores del token a las variables
      this.nombre = decodedToken.nombre;
      this.apellidoPaterno = decodedToken.apellidoPaterno;
      this.apellidoMaterno = decodedToken.apellidoMaterno;
      this.email = decodedToken.email;
      this.username = decodedToken.username;
      this.password = decodedToken.password;  // Si el token tiene la contraseña (aunque no es recomendado)
    }
  }

  ConsultarInfo(){
    this.ContenidoVisibleDelete = false;
    this.ContenidoVisibleInfo = true;

    console.log(this.NombreB.nativeElement.value);

    const body = {
      username: this.NombreB.nativeElement.value,

    }

    this.authService.ConsultarUser(body).subscribe(
      (response) => {
        if (response.status === 'success'){
          this.Nombre.nativeElement.value = response.username;
          this.Apellido1.nativeElement.value = response.Apellido1;
          this.Apellido2.nativeElement.value = response.Apellido2;
          this.Correo.nativeElement.value = response.Email;
          this.User.nativeElement.value = response.User;
          this.ContraseñaC.nativeElement = response.Contraseña;


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

  EliminarInfo(): void {
    this.ContenidoVisibleInfo = false;
    this.ContenidoVisibleDelete = true;
    this.isDisabled = false;  // Cambia el estado de isDisabled para habilitar los inputs
    //this.Nombre2.nativeElement.value = String(45);
    console.log(this.nombre);

    const body = {
      contraseña: this.Contraseña.nativeElement.value
    }

    this.authService.EliminarUser(body).subscribe(
      (response) => {
        if (response.status === 'success'){
          alert('hecho')
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

}
