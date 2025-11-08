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
