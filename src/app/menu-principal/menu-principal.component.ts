import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';  // Importar CommonModule

@Component({
  selector: 'app-menu-principal',
  imports: [CommonModule], // Se importa CommonModule para usar ngIF en el HTML
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})
export class MenuPrincipalComponent {
  constructor(private router: Router, private authService: AuthService) {}

  // Método para verificar si el usuario está autenticado (si el token existe)
  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  irLogin(){
    this.router.navigate(['/login']); // Navega a la ruta '/login'
  }

  IrCotizarEnvio(){
    this.router.navigate(['/CotizarEnvio']);
  }

  // Cerrar sesión: eliminar el token y redirigir al login
  cerrarSesion(): void {
    this.authService.logout();  // Eliminar el token del localStorage
    this.router.navigate(['/login']);  // Redirigir a la página de login
  }

  miCuenta(){
    this.router.navigate(['/miCuenta']);
  }

  irRastreo(){
    this.router.navigate(['/rastreo']); // Navega a la ruta '/rastreo'
  }

  irPreguntas(){
    this.router.navigate(['/preguntas']); // Navega a la ruta '/preguntas'
  }

}