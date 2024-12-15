import { Component } from '@angular/core';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css'
})
export class RegistroComponent {
  title = "Crear Cuenta";

  registrar(){
    alert('¡Bienvenido!');
  }
}
