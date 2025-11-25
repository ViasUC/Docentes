
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { MenuDocentesComponent } from './pages/menu-docentes/menu-docentes';
import { PublicarProyectosComponent } from './pages/publicar-proyectos/publicar-proyectos';
import { EndorsementComponent } from './pages/endorsement/endorsement.component';
import { authGuard } from './guards/auth.guard';
import { MiPerfilComponent } from './pages/mi-perfil/mi-perfil.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },

  { path: 'menu', component: MenuDocentesComponent, canActivate: [authGuard] },
  { path: 'publicar-proyectos', component: PublicarProyectosComponent, canActivate: [authGuard] },
  { path: 'endorsement', component: EndorsementComponent, canActivate: [authGuard] },
  {
    path: 'postulaciones',
    loadComponent: () =>
      import('./pages/postulacion-docentes/postulacion-docentes')
        .then(m => m.PostulacionesDocenteComponent),
    canActivate: [authGuard]
  },
  {
    path: 'canales',
    loadComponent: () =>
      import('./pages/canales/canales-list/canales-list.component')

        .then(m => m.CanalesListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'canales/crear',
    loadComponent: () =>
      import('./pages/canales/canal-crear/canal-crear.component')
        .then(m => m.CanalCrearComponent)
  },
  {
    path: 'canales/:slug',
    loadComponent: () =>
      import('./pages/canales/canal-detalles/canal-detalles.component')
        .then(m => m.CanalDetallesComponent)
  },
   {
    path: 'mi-perfil',  // Ruta para el perfil del usuario
    component: MiPerfilComponent,  // Componente que mostrará el perfil
    canActivate: [authGuard]  // Si es necesario, puedes agregar un guard para asegurarte de que el usuario esté autenticado
  },
  {
  path: 'historial/:id',
  loadComponent: () =>
    import('./pages/historial-postulaciones/historial-postulaciones')
      .then(m => m.HistorialPostulacionesComponent)
},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
