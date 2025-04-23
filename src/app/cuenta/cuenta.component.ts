import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Aquí se importa FormsModule
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cuenta',
  imports: [CommonModule, FormsModule],
  templateUrl: './cuenta.component.html',
  styleUrl: './cuenta.component.css'
})
export class CuentaComponent {
  title = "Mi Cuenta."
  // Estrucutra para manejar el control de edicion dependiendo que boton se haya accionado
  edicion = {
    name: false,
    mail: false,
    user: false
  };

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
  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.ConsultarUser().subscribe(
      perfil => {
        this.nombre = perfil.Nombre;
        this.apellidoPaterno = perfil.Apellido1;
        this.apellidoMaterno = perfil.Apellido2;
        this.email = perfil.Email;
        this.username = perfil.User;
      },
      error => {
        console.error("Error al obtener el perfil:",error);
      }
    );
  }

  // Funcion para habilitar los inputs
  habilitarEdicion(id: string){
    this.edicion.name = false;
    this.edicion.mail = false;
    this.edicion.user = false;

    if (id === 'edit-name'){
      this.edicion.name = true;
    } else if (id === 'edit-mail'){
      this.edicion.mail = true;
    } else if (id === 'edit-user'){
      this.edicion.user = true;
    }
  }

  // Funcion para desabilitar los inputs (Proximamente se implementará el metodo PUT)
  confirmarEdicion(id: string){
    if (id === 'edit-name'){
      this.edicion.name = false;
    } else if (id === 'edit-mail'){
      this.edicion.mail = false;
    } else if (id === 'edit-user'){
      this.edicion.user = false;
    }
  }

  // Cerrar sesión: eliminar el token y redirigir al login
  cerrarSesion(): void {
    this.authService.logout();  // Eliminar el token del localStorage
    this.router.navigate(['/menu']);  // Redirigir a la página del menu
  }

  
  EliminarInfo(): void {
    this.ContenidoVisibleInfo = false;
    this.ContenidoVisibleDelete = true;
    // Cambia el estado de isDisabled para habilitar los inputs
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
