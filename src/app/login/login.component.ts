import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterLink, RouterOutlet, Router} from '@angular/router';


@Component({
  selector: 'app-login',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'Iniciar Sesión'
  @ViewChild('username') usernameInput!: ElementRef;
  @ViewChild('password') passwordInput!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}

  login() {
    const usuario = this.usernameInput.nativeElement.value;
    const contrasena = this.passwordInput.nativeElement.value;

    this.authService.login(usuario, contrasena).subscribe(
      (response) => {
        if (response.status === 'success') {
          alert('Inicio de sesión exitoso: ' + response.rol);
          // Redirige al usuario a la página correspondiente
          this.router.navigate(['/menu']);
        } else {
          alert('Credenciales incorrectas');
        }
      },
      (error) => {
        console.error('Error en el inicio de sesión:', error);
        alert('Error en el servidor. Intente más tarde.');
      }
    );
  }
}
