import { CanActivateFn, CanActivateChildFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../../services/authservice/authservice.service';


// Protege el acceso al componente principal (dashboard)
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService); // Inyecta el servicio de autenticación
  const router = inject(Router); // Inyecta el Router para redirecciones

  if (authService.isLoggedIn()) {
    return true; // Permite acceso si está autenticado
  } else {
    router.navigate(['/login']); // Redirige al login si no está autenticado
    return false; // Bloquea el acceso
  }
};

// Protege las rutas hijas del dashboard
export const authChildGuard: CanActivateChildFn = (childRoute, state) => {
  return authGuard(childRoute, state); // Reutiliza la lógica de CanActivate
};

