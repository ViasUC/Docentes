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
  oportunidadFiltro: string = '';  // Filtro por oportunidad
  hayPendientes: boolean = true;   // ← NUEVO: controla columna

  oportunidades: any[] = []; // Oportunidades disponibles
  oportunidadesOriginal: any[] = [];

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

    this.cargarOportunidadesDocente();
    this.cargarPostulacionesDocente();
  }

  // Función para cargar las oportunidades del docente
  cargarOportunidadesDocente() {
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
        console.log("Oportunidades cargadas:", res.data?.oportunidadesPorCreador);  // Depuración de oportunidades cargadas
        this.oportunidades = res.data?.oportunidadesPorCreador ?? [];
        this.oportunidadesOriginal = [...this.oportunidades];  // Guarda la lista original de oportunidades
      },
      error: (err) => {
        console.error(err);
        this.error = err;
        this.loading = false;
      }
    });
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
        console.log("Oportunidades recibidas para postulaciones:", oportunidades);  // Verifica que las oportunidades estén correctamente recibidas

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
                  oportunidad { titulo idOportunidad }
                }
              }
            }
          `;

          this.http.post('/graphql', { query: queryPosts }).subscribe((resp: any) => {
            console.log("Postulaciones para oportunidad " + op.titulo, resp.data?.postulacionesPage?.items);  // Verifica las postulaciones recibidas para cada oportunidad
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
    console.log("Filtro por estado activado:", estado);  // Depuración
    this.estadoFiltro = estado;
    this.aplicarFiltro();
  }

  filtrarPorOportunidad(oportunidadId: string) {
    console.log("Filtro por oportunidad activado con ID:", oportunidadId);  // Depuración
    this.oportunidadFiltro = oportunidadId;
    this.aplicarFiltro();
  }

  aplicarFiltro() {
    console.log("Aplicando filtro: Estado:", this.estadoFiltro, "Oportunidad:", this.oportunidadFiltro);

    let postulacionesFiltradas = [...this.postulacionesOriginal];

    // Filtro por estado (si está definido)
    if (this.estadoFiltro) {
      postulacionesFiltradas = postulacionesFiltradas.filter(p => p.estado === this.estadoFiltro);
    }

    // Filtro por oportunidad (si está definido)
    if (this.oportunidadFiltro) {
      console.log("Filtrando por oportunidad ID:", this.oportunidadFiltro);  // Verificar ID de oportunidad
      postulacionesFiltradas = postulacionesFiltradas.filter(p => {
        // Asegúrate de que `oportunidad` esté presente en la postulación
        if (!p.oportunidad) {
          console.error("Oportunidad no definida para la postulación:", p);  // Esto debería ser raro
        }

        // Verificar y comparar correctamente el `idOportunidad`
        const oportunidadId = p.oportunidad ? p.oportunidad.idOportunidad : null;  // Acceder correctamente a idOportunidad
        console.log("Comparando con idOportunidad:", oportunidadId);  // Verificar el valor antes de la comparación

        // Comparar idOportunidad
        return oportunidadId === this.oportunidadFiltro;
      });

      console.log("Postulaciones filtradas por oportunidad:", postulacionesFiltradas);  // Verifica las postulaciones filtradas
    }

    // Asignar las postulaciones filtradas
    this.postulaciones = postulacionesFiltradas;
    console.log("Postulaciones después del filtro:", this.postulaciones);  // Verifica las postulaciones finales

    // Mostrar columna de acciones solo si el estado filtrado es PENDIENTE
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
