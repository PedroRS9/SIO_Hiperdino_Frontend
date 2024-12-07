import { Injectable } from '@angular/core';
import { delay, Observable, of, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private mockUser = {
    email: 'test@test.com',
    password: 'test',
  };

  constructor() {}

  /**
   * Simula el login verificando un usuario y contraseña "mock".
   * @param email Correo del usuario.
   * @param password Contraseña del usuario.
   * @returns Observable simulado del login.
   */
  login(email: string, password: string): Observable<any> {
    if (email === this.mockUser.email && password === this.mockUser.password) {
      if (this.isLocalStorageAvailable()) {
        localStorage.setItem('authToken', 'mock-token'); // Guarda el token en localStorage
      }
      return of({ message: 'Login exitoso', token: 'mock-token' }).pipe(
        delay(1000)
      ); // Simula un delay de 1 segundo
    } else {
      return throwError(() => new Error('Usuario o contraseña incorrectos')).pipe(
        delay(1000)
      );
    }
  }

  /**
   * Verifica si el usuario está autenticado.
   */
  isLoggedIn(): boolean {
    if (this.isLocalStorageAvailable()) {
      return !!localStorage.getItem('authToken'); // Verifica si el token existe
    }
    return false; // Por defecto, retorna falso si no está disponible localStorage
  }

  /**
   * Cierra la sesión del usuario.
   */
  logout(): void {
    if (this.isLocalStorageAvailable()) {
      localStorage.removeItem('authToken'); // Elimina el token de localStorage
    }
  }

  /**
   * Verifica si `localStorage` está disponible.
   */
  private isLocalStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }
}
