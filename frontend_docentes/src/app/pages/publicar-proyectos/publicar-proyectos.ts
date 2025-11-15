import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-publicar-proyectos',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './publicar-proyectos.html',
  styleUrls: ['./publicar-proyectos.css']
})
export class PublicarProyectosComponent {
   form;
    usuario: any = null;
    nombreCompleto = '';

  constructor(private fb: FormBuilder, private router: Router) {
    this.form = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(120)]],
      objetivos: ['', [Validators.required, Validators.maxLength(400)]],
      requisitos: [''],
      dd: [''],
      mm: [''],
      yy: ['']
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
    this.form.reset();          // limpia todos los campos
    this.router.navigate(['/menu']); // redirige al menú docente
  }

  publicar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    // TODO: enviar datos al backend
  }
}
