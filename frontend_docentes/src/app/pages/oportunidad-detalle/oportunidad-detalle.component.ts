import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-oportunidad-detalle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './oportunidad-detalle.component.html',
  styleUrls: ['./oportunidad-detalle.component.css']
})
export class OportunidadDetalleComponent {

  @Input() visible: boolean = false;
  @Input() oportunidad: any = null;
  @Input() postulaciones: any[] = [];

  @Output() cerrarModal = new EventEmitter<void>();
  cerrar() {
    this.cerrarModal.emit();
  }

}
