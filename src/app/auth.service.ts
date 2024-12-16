import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private urlLogin = 'http://localhost:5000/login'; // URL del procedimiento login
  private urlCrear = 'http://localhost:5000/api/usuario'; // URL del procedimiento crear_usuario

  constructor(private http: HttpClient) {}

  login(usuario: string, contrasena: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = { Usuario: usuario, Contrasena: contrasena };

    return this.http.post<any>(this.urlLogin, body, { headers });
  }

  // Modificar la función register para aceptar un objeto
  register(body: any): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<any>(this.urlCrear, body, { headers });
  }
}
