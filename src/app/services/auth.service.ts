import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = 'http://localhost:3000/usuarios';

  constructor(private http: HttpClient) {}

  // Método para registrar un nuevo usuario
  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(this.url, usuario).pipe(
      catchError(this.handleError) 
    );
  }

  // Método para iniciar sesión
  login(email: string, password: string): Observable<any> {
    return this.http.get<any[]>(this.url).pipe(
      map(users => {
        const user = users.find(user => user.email === email && user.password === password);
        if (user) {
          localStorage.setItem('currentUser', JSON.stringify(user));
          return user;
        } else {
          throw new Error('Usuario o contraseña incorrectos');
        }
      }),
      catchError((error) => {
        console.error('Error en login:', error);
        return throwError(error); 
      }) 
    );
  }

  // Obtener el usuario actualmente logueado
  getUsuarioLogueado(): any {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  }

  // Cerrar sesión
  logout(): void {
    localStorage.removeItem('currentUser'); // Elimina al usuario de localStorage
  }

  // Obtener todos los usuarios (para cargar en el perfil)
  getUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.url).pipe(
      catchError(this.handleError) 
    );
  }

  // Actualizar usuario
  actualizarUsuario(usuario: any): Observable<any> {
    return this.http.put(`${this.url}/${usuario.id}`, usuario).pipe(
      catchError(this.handleError) 
    );
  }

  // Manejo de errores
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Error del lado del servidor
      errorMessage = `Código de error: ${error.status}\nMensaje: ${error.message}`;
    }
    return throwError(errorMessage); // Retorna un observable con el mensaje de error
  }
}

