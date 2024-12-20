import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { jwtDecode } from "jwt-decode";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlLogin = 'http://localhost:5000/login'; // URL del procedimiento login
  private urlCrear = 'http://localhost:5000/api/usuario'; // URL del procedimiento crear_usuario
  private urlCotizar = 'http://localhost:5000/Cotizar/CP';
  private urlCotizarpqte = 'http://localhost:5000/Cotizar/Paquete';
  private urlCambiarContrasena = 'http://localhost:5000/usuario/cambiar'; // URL para el cambio de contraseña
  private urlRastrearPaquete = 'http://localhost:5000/rastrear/rastreo'; // URL para rastrear un envio
  private urlEnvios = 'http://localhost:5000/Cotizar/Envio';

  constructor(private http: HttpClient) {}

  // Login y almacenar el token
  login(usuario: string, contrasena: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { Usuario: usuario, Contrasena: contrasena };

    return this.http.post<any>(this.urlLogin, body, { headers }).pipe(
      // Procesamos la respuesta y almacenamos el token
      tap(response => {
        if (response.status === 'success') {
          localStorage.setItem('authToken', response.token); // Almacena el token
        }
      })
    );
  }

  // Verifica si el usuario está autenticado
  isAuthenticated(): boolean {
    // Verifica si localStorage está disponible
    if (typeof window !== 'undefined' && window.localStorage) {
      const token = localStorage.getItem('authToken');
      return !!token; // Retorna un True si hay un token de autenticacion
    }
    return false; // Retorna false si no hay un token de autenticacion
  }
  
  // Cerrar sesión eliminando el token
  logout(): void {
    localStorage.removeItem('authToken');
  }

  getDecodedToken(): any {
    const token = localStorage.getItem('authToken');
    if (token) {
      // return jwt_decode(token);  // Decodifica el token y regresa el payload
    }
    return null;
  }

  // Modificar la función register para aceptar un objeto
  register(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.urlCrear, body, { headers });
  }

  EnocntrarCP(body:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.urlCotizar,body,{headers})

  }
  CotizarPaquete(body:any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.urlCotizarpqte,body,{headers})
  }

  cambiarContrasena(body:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.urlCambiarContrasena, body, { headers });
  }

  consultarInfo(body:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<any>(this.urlCambiarContrasena, body, { headers });
  }

  enviarpaquete(body:any): Observable<any>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.urlEnvios, body, { headers });
    
  }

  rastrearPaquete(rastreo: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
  // Usar el cuerpo de la solicitud para enviar el número de rastreo
    const body = { Rastreo: rastreo };
  
    // Llamada GET con los parámetros
    return this.http.post<any>(this.urlRastrearPaquete, body, { headers });
  }
}
