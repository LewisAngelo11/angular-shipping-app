import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { AppComponent } from './app.component';

export const routes: Routes = [
    {path: '', component: AppComponent},
    {path: 'login', component: LoginComponent}, // Ruta para la pantalla de login
    {path: 'registro', component: RegistroComponent}, // Rita para la pantalla de registrarse
];
