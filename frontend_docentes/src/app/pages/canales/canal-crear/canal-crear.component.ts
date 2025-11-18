import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanalesService } from '../../../services/canales.service';

@Component({
  selector: 'app-canal-crear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canal-crear.component.html',
  styleUrls: ['./canal-crear.component.css']
})
export class CanalCrearComponent {

  @Input() visible: boolean = false;
  @Output() cerrarModal = new EventEmitter<void>();

  usuario: any = JSON.parse(localStorage.getItem('usuario') || 'null');

  form = {
    nombre: "",
    slug: "",
    tipo: "",
    descripcion: ""
  };

  constructor(private canalesService: CanalesService) {}

  crear() {
    if (!this.form.nombre || !this.form.slug || !this.form.tipo) {
      alert("Complete todos los campos obligatorios.");
      return;
    }

    const input = {
      nombre: this.form.nombre,
      slug: this.form.slug,
      tipo: this.form.tipo,
      descripcion: this.form.descripcion,
      actorId: this.usuario?.idUsuario ?? 0
    };

    this.canalesService.crearCanal(input).subscribe({
      next: () => {
        alert("Canal creado correctamente");
        this.form = { nombre: "", slug: "", tipo: "", descripcion: "" };  // reset
        this.cerrarModal.emit();
        },
      error: () => {
        alert("Error al crear canal");
      }
    });
  }

  cerrar() {
    this.form = { nombre: "", slug: "", tipo: "", descripcion: "" };
    this.cerrarModal.emit();
    }

}
