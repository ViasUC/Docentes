// src/app/pages/login/login.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';


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

  constructor(
  private router: Router,
  private loginService: LoginService
) {}

  // Simula un login local sin backend
  onLogin() {
    this.errorMessage = '';

    // Validación básica
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Complete ambos campos.';
      return;
    }

    this.loading = true;

    this.loginService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log("RESPUESTA LOGIN:", res);
        this.loading = false;

        const usuario = res?.data?.login;

        if (!usuario) {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
          return;
        }

        // Guardar sesión real
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('usuario', JSON.stringify(usuario));

        // Redirigir al menú (o dashboard, lo que uses)
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.loading = false;
        this.errorMessage = 'Error al conectar con el servidor.';
      }
    });
  }
}
