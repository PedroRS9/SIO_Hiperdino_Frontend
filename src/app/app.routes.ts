import { Routes } from '@angular/router';
import { DashboardComponent } from './shared/components/dashboard/dashboard.component';
import { View1Component } from './shared/components/dashboard/view1/view1.component';
import { View2Component } from './shared/components/dashboard/view2/view2.component';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      { path: 'view1', component: View1Component },
      { path: 'view2', component: View2Component },
    ],
  },
  { path: '', redirectTo: '/dashboard/view1', pathMatch: 'full' }, // Ruta por defecto
  { path: '**', redirectTo: '/dashboard/view1' }, // Ruta comodín
];
