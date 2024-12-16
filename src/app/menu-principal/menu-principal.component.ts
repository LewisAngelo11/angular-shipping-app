import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-principal',
  imports: [],
  templateUrl: './menu-principal.component.html',
  styleUrl: './menu-principal.component.css'
})
export class MenuPrincipalComponent {
  constructor(private router: Router) {}

  irLogin(){
    this.router.navigate(['/login']); // Navega a la ruta '/login'
  }
}
