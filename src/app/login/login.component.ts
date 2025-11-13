import { Component, ElementRef, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterLink, RouterOutlet, Router} from '@angular/router';
import { CommonModule } from '@angular/common';import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDIjO8LB-EXmB11K4LYydDBDFFplHUbFHI",
  authDomain: "paqueteria-autentificacion.firebaseapp.com",
  projectId: "paqueteria-autentificacion",
  storageBucket: "paqueteria-autentificacion.firebasestorage.app",
  messagingSenderId: "269192440178",
  appId: "1:269192440178:web:c0d0e2a8d60e23336095eb"
};

const provider = new GoogleAuthProvider();
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


@Component({
  selector: 'app-login',
  imports: [RouterLink, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  title = 'Iniciar Sesión'
  @ViewChild('username') usernameInput!: ElementRef;
  @ViewChild('password') passwordInput!: ElementRef;

  constructor(private authService: AuthService, private router: Router) {}
  mensajeError: string = ''; // Nuevo campo para manejar errores

  login_google(){
    signInWithPopup(auth, provider)
      .then((result) => {
        const credential = GoogleAuthProvider.credentialFromResult(result);
        if (credential) {
          const token = credential.accessToken;
          // Puedes usar el token si necesitas mandarlo a tu backend
        }
        const user = result.user;
        alert('Bienvenido ${user.displayName}');
        // Redirigir al menú tras el login exitoso
        this.router.navigate(['/menu']);
    }).catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
    });
  }

  login() {
    const usuario = this.usernameInput.nativeElement.value;
    const contrasena = this.passwordInput.nativeElement.value;

    if (!usuario || !contrasena){ // Validar que los campos de las credenciales no estén vacíos
      this.mensajeError = 'Por favor ingrese sus credenciales en todos los campos.'
      return;
    }

    this.mensajeError = ''; // Borra el mensaje si todo está bien

    this.authService.login(usuario, contrasena).subscribe(
      (response) => {
        if (response.status === 'success') {
          // Redirige al usuario a la página correspondiente
          this.router.navigate(['/menu']);
        }
      },
      (error) => {
        console.error('Error en el inicio de sesión:', error); // Imprime toda la respuesta de error
        // Error de autenticacion
        if (error.status === 401) {
          this.mensajeError = error.error.mensaje// Muestra el mensaje de error al iniciar sesión en la página
        } else{
          alert('Error en el servidor. Intente más tarde.');
        }
      }
    );
  }
}
