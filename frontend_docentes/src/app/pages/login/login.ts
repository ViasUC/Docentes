// src/app/pages/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(private router: Router) {}

  // Simula un login local sin backend
  onLogin() {
    this.errorMessage = '';

    // Validación básica
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Complete ambos campos.';
      return;
    }

    this.loading = true;

    // Simular retraso de red (opcional)
    setTimeout(() => {
      this.loading = false;

      // Reglas de ejemplo para "aceptar" login (cambiá a lo que quieras)
      if (this.email === 'admin@correo.com' && this.password === '1234') {
        // Simulamos sesión guardando un flag
        localStorage.setItem('isLoggedIn', 'true');
        // Redirigir a un dashboard (asegurate de tener la ruta)
        this.router.navigate(['/dashboard']);
      } else {
        this.errorMessage = 'Usuario o contraseña incorrectos.';
      }
    }, 800);
  }
}
