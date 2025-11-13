import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
    constructor(private router: Router, private authService: AuthService){}
  
    // Método para verificar si el usuario está autenticado (si el token existe)
    isAuthenticated(): boolean {
      return this.authService.isAuthenticated();
    }
    
    irLogin(){
      this.router.navigate(['/login']); // Navega a la ruta '/login'
    }
  
    miCuenta(){
      this.router.navigate(['/miCuenta']);
    }
}
