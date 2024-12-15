import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
   title = 'Iniciar Sesion'; // Título dinámico
   usuario: string = ''; // Variable vinculada al input de Usuario
   contraseña: string = ''; // Variable vinculada al input de Contraseña
   mensaje: string = ''; // Mensaje dinámico para mostrar resultados

   login() {
    if (this.usuario.trim() === '' || this.contraseña.trim() === '') { // Verificar que se llenen los campos
      this.mensaje = 'Por favor, completa todos los campos.';
      return;
    }

    alert('¡Bienvenido!');
  }
}
