import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CanalesService } from '../../../services/canales.service';

@Component({
  selector: 'app-canal-publicacion-crear',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './canal-publicacion-crear.component.html',
  styleUrls: ['./canal-publicacion-crear.component.css']
})
export class CanalPublicacionCrearComponent {

  @Input() idCanal!: number;
  @Output() cerrar = new EventEmitter<void>();

  usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

  form = {
    titulo: "",
    contenido: ""
  };

  constructor(private canalesService: CanalesService) {}

  crear() {
    const input = {
      idCanal: this.idCanal,
      idProyectoF7: 1,
      idAutor: this.usuario.idUsuario,
      titulo: this.form.titulo,
      contenido: this.form.contenido
    };

    this.canalesService.crearPublicacionEnCanal(input).subscribe({
      next: () => {
        alert("Publicación creada");
        this.cerrar.emit();
      },
      error: () => alert("Error al crear publicación")
    });
  }
}
