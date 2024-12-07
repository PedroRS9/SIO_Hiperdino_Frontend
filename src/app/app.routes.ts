import { Routes } from '@angular/router';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { View1Component } from './shared/components/dashboard/view1/view1.component';
import { View2Component } from './shared/components/dashboard/view2/view2.component';
import { View3Component } from './shared/components/dashboard/view3/view3.component';
import { LoginComponent } from './shared/components/login/login.component';
import { authGuard, authChildGuard } from './core/guards/auth/auth.guard';
import { MapsComponent } from './shared/components/maps/maps.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent }, // Página de login
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard], // Protege el acceso al componente padre
    canActivateChild: [authChildGuard], // Protege las rutas hijas
    children: [
      { path: '', redirectTo: 'view1', pathMatch: 'full' },
      { path: 'view1', component: View1Component },
      { path: 'view2', component: View2Component },
      { path: 'view3', component: View3Component },
      { path: 'maps', component: MapsComponent },
    ],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // Redirección por defecto
  { path: '**', redirectTo: '/login' }, // Ruta comodín
];
