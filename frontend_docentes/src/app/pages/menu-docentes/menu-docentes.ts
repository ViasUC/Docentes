import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu-docentes',
  imports: [CommonModule],
  templateUrl: './menu-docentes.html',
  styleUrl: './menu-docentes.css'
})
export class MenuDocentesComponent {
  userEmail: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    // Podés recuperar datos del usuario guardados en localStorage
    this.userEmail = localStorage.getItem('userEmail');
  }

  irA(pagina: string) {
    alert(`Ir a ${pagina} (pendiente de implementar)`);
  }

  logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    this.router.navigate(['/login']);
  }
}

