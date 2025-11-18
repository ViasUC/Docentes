import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-postulaciones-docente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './postulacion-docentes.html',
  styleUrls: ['./postulacion-docentes.css']
})
export class PostulacionesDocenteComponent implements OnInit {

  usuario: any = null;
  nombreCompleto = '';
  loading = true;
  error: any = null;

  postulaciones: any[] = [];
  postulacionesOriginal: any[] = [];

  estadoFiltro: string = 'PENDIENTE';
  hayPendientes: boolean = true;   // ← NUEVO: controla columna

  constructor(private router: Router, private http: HttpClient) {}

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

    this.cargarPostulacionesDocente();
  }

  cargarPostulacionesDocente() {
    const queryOps = `
      query {
        oportunidadesPorCreador(creadorId: ${this.usuario.idUsuario}) {
          idOportunidad
          titulo
        }
      }
    `;

    this.http.post('/graphql', { query: queryOps }).subscribe({
      next: (res: any) => {
        const oportunidades = res.data?.oportunidadesPorCreador ?? [];

        if (oportunidades.length === 0) {
          this.postulaciones = [];
          this.loading = false;
          return;
        }

        let acumulado: any[] = [];
        let pendientes = oportunidades.length;

        oportunidades.forEach((op: any) => {

          const queryPosts = `
            query {
              postulacionesPage(
                filtro: { idOportunidad: ${op.idOportunidad} }
                page: 0
                size: 200
              ) {
                items {
                  idPostulacion
                  estado
                  fechaPostulacion
                  postulante { nombre apellido }
                  oportunidad { titulo }
                }
              }
            }
          `;

          this.http.post('/graphql', { query: queryPosts }).subscribe((resp: any) => {
            acumulado.push(...(resp.data?.postulacionesPage?.items ?? []));
            pendientes--;

            if (pendientes === 0) {
              this.postulacionesOriginal = acumulado;
              this.aplicarFiltro();
              this.loading = false;
            }
          });

        });
      },
      error: (err) => {
        console.error(err);
        this.error = err;
        this.loading = false;
      }
    });

  }

  // FILTRO
  filtrarPorEstado(estado: string) {
    this.estadoFiltro = estado;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    // Filtra exacto por el estado seleccionado
    this.postulaciones = this.postulacionesOriginal.filter(
      p => p.estado === this.estadoFiltro
    );

    // Mostrar columna de acciones SOLO si el estado filtrado es PENDIENTE
    this.hayPendientes = (this.estadoFiltro === 'PENDIENTE');
  }

  // RECHAZAR CON MOTIVO
  rechazarConMotivo(p: any) {
    const motivo = prompt("Motivo del rechazo:");

    if (!motivo || motivo.trim() === "") {
      alert("Debe ingresar un motivo.");
      return;
    }

    this.cambiarEstado(p, 'RECHAZADA', motivo);
  }

  // MUTACIÓN
  cambiarEstado(p: any, nuevoEstado: string, motivo?: string) {

    const motivoFinal =
      motivo ?? (nuevoEstado === 'RECHAZADA'
        ? 'Rechazado por el docente'
        : 'Aceptado por el docente');

    const mutation = `
      mutation {
        actualizarEstadoPostulacion(
          idPostulacion: ${p.idPostulacion},
          estado: ${nuevoEstado},
          motivo: "${motivoFinal}",
          idActor: ${this.usuario.idUsuario}
        ) {
          idPostulacion
          estado
        }
      }
    `;

    this.http.post('/graphql', { query: mutation }).subscribe({
      next: () => {
        p.estado = nuevoEstado;
        this.aplicarFiltro();
        alert("Estado actualizado correctamente");
      },
      error: (err) => {
        console.error(err);
        alert("Error al actualizar el estado");
      }
    });
  }

  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('usuario');

    this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
