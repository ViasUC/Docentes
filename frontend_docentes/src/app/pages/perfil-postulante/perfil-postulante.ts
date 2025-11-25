import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-perfil-postulante',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil-postulante.html',
  styleUrls: ['./perfil-postulante.css']
})
export class PerfilPostulanteComponent {

  @Input() visible: boolean = false;
  @Input() idUsuario: number | null = null;
  @Output() cerrar = new EventEmitter<void>();

  perfil: any = null;
  loading = false;

  constructor(private http: HttpClient) {}

  ngOnChanges() {
    if (this.visible && this.idUsuario) {
      this.cargarPerfil();
    }
  }

  cargarPerfil() {
    this.loading = true;

    const query = `
      query {
        consultarPerfil(idUsuario: "${this.idUsuario}") {
          nombre
          apellido
          email
          carrera
          semestre
        }
      }
    `;

    this.http.post('/graphql', { query }).subscribe({
      next: (res: any) => {
        this.perfil = res.data?.consultarPerfil ?? null;
        this.loading = false;
      },
      error: () => {
        alert("Error cargando perfil");
        this.loading = false;
      }
    });
  }
}
