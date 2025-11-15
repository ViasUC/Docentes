import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ObtenerOportunidadesService } from '../../services/obtener-oportunidades.service';
import { OportunidadDetalleComponent } from '../oportunidad-detalle/oportunidad-detalle.component';

@Component({
  selector: 'app-menu-docentes',
  standalone: true,
  imports: [CommonModule, RouterLink, OportunidadDetalleComponent],
  templateUrl: './menu-docentes.html',
  styleUrls: ['./menu-docentes.css']
})
export class MenuDocentesComponent implements OnInit {

  usuario: any = null;
  oportunidades: any[] = [];
  oportunidadesOriginal: any[] = [];     // 👈 SE AGREGA
  nombreCompleto = '';

  estadoFiltro: string = 'todos';        // 👈 SE AGREGA

  loading = true;
  error: any = null;

  // 🔥 VARIABLES DEL MODAL
  modalVisible = false;
  detalleOportunidad: any = null;
  detallePostulaciones: any[] = [];

  constructor(
    private router: Router,
    private obtener: ObtenerOportunidadesService,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    if (this.usuario) {
      const rol = this.usuario.rolPrincipal === 'profesor'
        ? 'Prof.'
        : this.usuario.rolPrincipal === 'investigador'
          ? 'Inv.'
          : '';

      this.nombreCompleto = `${rol} ${this.usuario.nombre} ${this.usuario.apellido}`;
    }
    this.obtenerOportunidades();
  }

  obtenerOportunidades(): void {
    this.loading = true;
    this.error = null;

    if (!this.usuario || !this.usuario.idUsuario) {
      this.loading = false;
      this.error = 'No se encontró el usuario en sesión.';
      return;
    }

    const id = Number(this.usuario.idUsuario);
    console.log('ID usuario logueado:', id);

    // 🔥 MÉTODO NUEVO: ahora obtenés TODAS para poder filtrar
    this.obtener.listarTodasPorCreador(id)
      .subscribe({
        next: (lista: any[]) => {
          this.oportunidadesOriginal = lista;  // 👈 Guardamos copia
          this.aplicarFiltroEstado();          // 👈 Mostramos según filtro
          this.loading = false;
        },
        error: (err) => {
          console.error(err);
          this.error = err;
          this.loading = false;
        }
      });
  }

  // 🔥 MÉTODO DE FILTRO POR ESTADO
  aplicarFiltroEstado() {
    if (this.estadoFiltro === 'todos') {
      this.oportunidades = this.oportunidadesOriginal;
    } else {
      this.oportunidades = this.oportunidadesOriginal.filter(
        o => o.estado?.toLowerCase() === this.estadoFiltro.toLowerCase()
      );
    }
  }

  // 🔥 EVENTO DEL SELECT EN EL HTML
  onEstadoChange(valor: string) {
    this.estadoFiltro = valor;
    this.aplicarFiltroEstado();
  }

  // 🔥 NUEVO MÉTODO PARA MOSTRAR MODAL
  verDetalles(o: any) {
    this.detalleOportunidad = o;
    this.cargarPostulaciones(o.idOportunidad);
  }

  // 🔥 QUERY POSTULACIONES
  cargarPostulaciones(id: number) {
    const query = `
      query {
        postulacionesPage(
          filtro: { idOportunidad: ${id}, estados: [PENDIENTE, ACEPTADA, CANCELADA] }
          page: 0
          size: 50
        ) {
          items {
            idPostulacion
            estado
            fechaPostulacion
            postulante { nombre apellido }
          }
        }
      }
    `;

    this.http.post('/graphql', { query }).subscribe((res: any) => {
      this.detallePostulaciones = res.data?.postulacionesPage?.items ?? [];
      this.modalVisible = true;
    });
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
