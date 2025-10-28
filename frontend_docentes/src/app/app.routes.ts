import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { DashboardComponent } from './pages/dashboard/dashboard';
import { MenuDocentesComponent } from './pages/menu-docentes/menu-docentes';
//export const routes: Routes = [];

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // ruta simple de ejemplo para dashboard:
  { path: 'dashboard', component: DashboardComponent },
  { path: 'menu', component: MenuDocentesComponent },
];