import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { CrearEndorsementComponent } from '../crear-endorsement/crear-endorsement.component';

@Component({
  selector: 'app-endorsement',
  standalone: true,
  imports: [CommonModule, RouterLink, CrearEndorsementComponent],
  templateUrl: './endorsement.component.html',
  styleUrls: ['./endorsement.component.css']
})
export class EndorsementComponent implements OnInit {

  usuario = JSON.parse(localStorage.getItem('usuario') || '{}');
  nombreCompleto = '';
  userId = this.usuario?.idUsuario;

  crearVisible = false;

  pendientes: any[] = [];
  enviados: any[] = [];

  loadingPendientes = false;
  loadingEnviados = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const rol = this.usuario.rolPrincipal === 'profesor'
      ? 'Prof.'
      : this.usuario.rolPrincipal === 'investigador'
      ? 'Inv.'
      : '';

    this.nombreCompleto = `${rol} ${this.usuario.nombre} ${this.usuario.apellido}`;

    this.cargarPendientes();
    this.cargarEnviados();
  }

  // ------------------------------------------------
  // Función que asigna la clase CSS según el estado
  // ------------------------------------------------
  private mapEstadoCss(status: string): string {
    const s = status.toUpperCase();
    if (s === 'PENDING') return 'pendiente';
    if (s === 'ACCEPTED') return 'aceptada';
    if (s === 'REJECTED') return 'rechazada';
    return 'cancelada'; // fallback
  }

  // ------------------------------------------------
  // Función para traducir estado a texto más amigable
  // ------------------------------------------------
  private traducirEstado(status: string): string {
    const s = status.toUpperCase();
    if (s === 'PENDING') return 'Pendiente';
    if (s === 'ACCEPTED') return 'Aceptado';
    if (s === 'REJECTED') return 'Rechazado';
    return status;
  }

  // --------------------------
  // 📌 Cargar pendientes
  // --------------------------
  cargarPendientes() {
    this.loadingPendientes = true;

    const query = `
      query {
        endorsementsReceived(toUserId: ${this.userId}, status: PENDING) {
          idEndorsement
          fromUserId
          skill
          message
          status
        }
        usuarios {
          idUsuario
          nombre
          apellido
        }
      }
    `;

    this.http.post('/graphql', { query }).subscribe((res: any) => {
      const lista = res.data?.endorsementsReceived ?? [];
      const usuarios = res.data?.usuarios ?? [];

      this.pendientes = lista.map((e: any) => {
        const u = usuarios.find(
          (x: any) => Number(x.idUsuario) === Number(e.fromUserId)
        );

        return {
          ...e,
          fromNombre: u ? `${u.nombre} ${u.apellido}` : 'Desconocido',
          estadoCss: this.mapEstadoCss(e.status),
          estadoTexto: this.traducirEstado(e.status)
        };
      });

      this.loadingPendientes = false;
    });
  }

  // --------------------------
  // 📌 Cargar enviados
  // --------------------------
  cargarEnviados() {
    this.loadingEnviados = true;

    const query = `
      query {
        endorsementsGiven(fromUserId: ${this.userId}) {
          idEndorsement
          toUserId
          skill
          message
          status
        }
        usuarios {
          idUsuario
          nombre
          apellido
        }
      }
    `;

    this.http.post('/graphql', { query }).subscribe((res: any) => {
      const lista = res.data?.endorsementsGiven ?? [];
      const usuarios = res.data?.usuarios ?? [];

      this.enviados = lista.map((e: any) => {
        const u = usuarios.find(
          (x: any) => Number(x.idUsuario) === Number(e.toUserId)
        );

        return {
          ...e,
          toNombre: u ? `${u.nombre} ${u.apellido}` : 'Desconocido',
          estadoCss: this.mapEstadoCss(e.status),
          estadoTexto: this.traducirEstado(e.status)
        };
      });

      this.loadingEnviados = false;
    });
  }

  // --------------------------
  // 📌 MUTACIÓN Aceptar/Rechazar
  // --------------------------
  decidir(idEndorsement: number, aceptar: boolean) {
    const mutation = `
        mutation {
        decideEndorsement(
            input: {
            id: ${idEndorsement},
            actorId: ${this.userId},
            accept: ${aceptar}
            }
        ) {
            idEndorsement
            status
        }
        }
    `;

    this.http.post('/graphql', { query: mutation }).subscribe((res: any) => {

        // Después de decidir, recargar ambas listas
        this.cargarPendientes();
        this.cargarEnviados();

    });
    }


  // --------------------------
  // 📌 MODAL
  // --------------------------
  abrirModal() {
    this.crearVisible = true;
  }

  cerrarModal() {
    this.crearVisible = false;
    this.cargarPendientes();
    this.cargarEnviados();
  }

  logout() {
    localStorage.clear();
    location.href = '/login';
  }
}
