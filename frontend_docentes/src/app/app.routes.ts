/*
//export const routes: Routes = [];

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  // ruta simple de ejemplo para dashboard:
  { path: 'dashboard', component: DashboardComponent },
  { path: 'menu', component: MenuDocentesComponent },
  { path: 'publicar-proyectos', component: PublicarProyectosComponent },
];*/

import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MenuDocentesComponent } from './pages/menu-docentes/menu-docentes';
import { PublicarProyectosComponent } from './pages/publicar-proyectos/publicar-proyectos';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'menu', component: MenuDocentesComponent },
  { path: 'publicar-proyectos', component: PublicarProyectosComponent },
];
