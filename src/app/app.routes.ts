import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { AppComponent } from './app.component';
import { MenuPrincipalComponent } from './menu-principal/menu-principal.component';
import { RecuperacionComponent } from './recuperacion/recuperacion.component';

export const routes: Routes = [
    {path: '', component: MenuPrincipalComponent}, // Ruta predeterminada para la pantalla de menu principal
    {path: 'menu', component: MenuPrincipalComponent}, // Ruta para la pantalla de menu principal
    {path: 'login', component: LoginComponent}, // Ruta para la pantalla de login
    {path: 'registro', component: RegistroComponent}, // Ruta para la pantalla de registrarse
    {path: 'recuperacion', component: RecuperacionComponent} // Ruta para la pantalla de recuperar contraseña
];
