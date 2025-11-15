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
              // cuando termina todo → asignar
              this.postulaciones = acumulado;
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


  logout(): void {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('usuario');
    this.router.navigate(['/login']);
  }
}
