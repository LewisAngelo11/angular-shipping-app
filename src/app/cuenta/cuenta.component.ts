import { Component, ElementRef, ViewChild } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { response } from 'express';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Aquí se importa FormsModule

@Component({
  selector: 'app-cuenta',
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.css'
})
export class CuentaComponent {
  title = "Mi Cuenta."
  isDisabled: boolean = true;   // Variable para controlar el estado de los inputs (inicialmente deshabilitados)
  // Función para habilitar los inputs al presionar el botón
  // Propiedades para los datos del usuario
  nombre: string = '';
  apellidoPaterno: string = '';
  apellidoMaterno: string = '';
  email: string = '';
  username: string = '';
  password: string = '';

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

  editarInformacion(): void {
    this.isDisabled = false;  // Cambia el estado de isDisabled para habilitar los inputs
  }

}
