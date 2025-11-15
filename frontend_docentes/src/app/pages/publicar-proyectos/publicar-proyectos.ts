import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { OportunidadService } from '../../services/oportunidad.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-publicar-proyectos',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, HttpClientModule],
  templateUrl: './publicar-proyectos.html',
  styleUrls: ['./publicar-proyectos.css']
})
export class PublicarProyectosComponent {

  form;
  usuario: any = null;
  nombreCompleto = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private oportunidadService: OportunidadService
  ) {

    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(120)]],
      descripcion: ['', Validators.required],
      requisitos: ['', Validators.required],
      ubicacion: ['', Validators.required],
      modalidad: ['', Validators.required],
      tipo: ['', Validators.required],
      fechaCierre: ['', Validators.required]
    });
  }

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
  }

  cancelar() {
    this.form.reset();
    this.router.navigate(['/menu']);
  }

  publicar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const input = {
      idCreador: this.usuario.idUsuario,
      titulo: this.form.value.titulo,
      descripcion: this.form.value.descripcion,
      requisitos: this.form.value.requisitos,
      ubicacion: this.form.value.ubicacion,
      modalidad: this.form.value.modalidad,
      tipo: this.form.value.tipo,
      fechaCierre: this.form.value.fechaCierre + ":00",
      estado: "activo"
    };

    this.oportunidadService.crearOportunidadDocente(input)
      .subscribe({
        next: (op) => {
          console.log("CREADO:", op);
          alert("Proyecto publicado exitosamente");
          this.router.navigate(['/menu']);
        },
        error: (err) => {
          console.error(err);
          alert("Error al publicar el proyecto");
        }
      });
  }
}
