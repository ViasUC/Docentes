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
  styleUrls: ['./login.css']
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
    this.errorMessage = ''; // Limpiar mensajes de error previos

    // Validación básica
    if (!this.email.trim() || !this.password.trim()) {
      this.errorMessage = 'Complete ambos campos.';
      return;
    }

    this.loading = true; // Indicador de carga mientras se procesa el login

    // Llamada al servicio de login
    this.loginService.login(this.email, this.password).subscribe({
      next: (res: any) => {
        console.log("RESPUESTA LOGIN:", res);
        this.loading = false;

        // Verifica si la respuesta contiene un usuario válido
        const usuario = res?.data?.login;

        if (!usuario) {
          this.errorMessage = 'Usuario o contraseña incorrectos.';
          return;
        }

        // Guardar la sesión en localStorage
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('usuario', JSON.stringify(usuario)); // Guarda toda la información del usuario

        // Redirigir al menú o dashboard
        this.router.navigate(['/menu']);
      },
      error: (err) => {
        console.error('Error en login:', err);
        this.loading = false; // Detener indicador de carga
        this.errorMessage = 'Error al conectar con el servidor. Intenta de nuevo más tarde.';
      }
    });
  }
}
