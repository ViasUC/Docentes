import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-historial-postulacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historial-postulaciones.html',
  styleUrls: ['./historial-postulaciones.css']
})
export class HistorialPostulacionesComponent implements OnInit {

  // === Inputs recibidos del componente padre ===
  @Input() visible: boolean = false;
  @Input() postulacion: any = null;

  // === Output para cerrar modal ===
  @Output() cerrar = new EventEmitter<void>();

  historial: any[] = [];
  loading = true;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    // El modal carga cuando ya tiene la postulación seleccionada
  }

  ngOnChanges(): void {
    if (this.postulacion) {
      this.cargarHistorial();
    }
  }

  cargarHistorial() {
    if (!this.postulacion) return;

    const query = `
      query {
        historialPostulacion(idPostulacion: ${this.postulacion.idPostulacion}) {
          fechaCambio
          estadoAnterior
          estadoNuevo
          motivo
        }
      }
    `;

    this.http.post('/graphql', { query }).subscribe({
      next: (res: any) => {
        this.historial = res.data?.historialPostulacion ?? [];
        this.loading = false;
      },
      error: () => {
        alert("Error cargando historial");
        this.loading = false;
      }
    });
  }

  cerrarModal() {
    this.cerrar.emit();
  }
}
