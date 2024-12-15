import { CommonModule } from '@angular/common';
import { Component, inject} from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root', // Vincula el componente a una etiqueta HTML <app-root>
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './app.component.html', // Ruta del archivo HTML asociado
  styleUrls: ['./app.component.css'] // Ruta(s) del archivo CSS asociado
})
export class AppComponent {

}

