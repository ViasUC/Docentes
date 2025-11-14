import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ObtenerOportunidadesService } from '../../services/services/obtener-oportunidades';

@Component({
  selector: 'app-menu-docentes',
  templateUrl: './menu-docentes.html',
  styleUrls: ['./menu-docentes.css']
})
export class MenuDocentesComponent implements OnInit {

  oportunidades: any[] = [];
  loading = true;
  error: any = null;

  constructor(
    private router: Router,
    private obtener: ObtenerOportunidadesService
  ) {}

  ngOnInit(): void {
    this.obtenerOportunidades();
  }

  obtenerOportunidades(): void {
    this.loading = true;
    this.error = null;

    this.obtener.listarOportunidades().subscribe({
      next: (res: any) => {
        this.oportunidades = res?.data?.oportunidades ?? [];
        this.loading = false;
      },
      error: (err) => {
        console.error('Error obteniendo oportunidades', err);
        this.error = err;
        this.loading = false;
      }
    });
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    this.router.navigate(['/login']);
  }
}

