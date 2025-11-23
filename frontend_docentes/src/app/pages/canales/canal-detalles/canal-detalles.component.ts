import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CanalesService } from '../../../services/canales.service';
import { CanalPublicacionCrearComponent } from '../canal-publicacion-crear/canal-publicacion-crear.component';

@Component({
  selector: 'app-canal-detalles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,                 // 👈 AGREGAR ESTO
    CanalPublicacionCrearComponent
  ],
  templateUrl: './canal-detalles.component.html',
  styleUrls: ['./canal-detalles.component.css']
})

export class CanalDetallesComponent implements OnInit {

  slug: string = '';
  canal: any = null;
    publicaciones: any[] = [];
publicacionesVisibles: any[] = [];
batchSize = 4;   // cantidad de publicaciones por carga
cargandoMas = false;

  loading = true;

  usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  nombreCompleto: string = "";

  crearPublicacionVisible = false; // modal interno si querés

  constructor(
    private route: ActivatedRoute,
    private canalesService: CanalesService,
    private router: Router     // 👈 AGREGAR ESTO
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug') || '';
    this.usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    if (this.usuario) {
      const rol =
        this.usuario.rolPrincipal === 'profesor'
          ? 'Prof.'
          : this.usuario.rolPrincipal === 'investigador'
            ? 'Inv.'
            : '';

      this.nombreCompleto = `${rol} ${this.usuario.nombre} ${this.usuario.apellido}`;
    }

    this.cargarCanal();
  }

  cargarCanal() {
    this.canalesService.getCanalesActivos().subscribe((res: any) => {
      const lista = res.data.canalesActivos;
      this.canal = lista.find((c: any) => c.slug === this.slug);

      if (!this.canal) {
        this.loading = false;
        return;
      }

      this.cargarPublicaciones();
    });
  }

  cargarPublicaciones() {
  this.loading = true;

  this.canalesService.publicacionesDeCanal(this.canal.idCanal).subscribe({
    next: (res: any) => {
      this.publicaciones = res.data.publicacionesDeCanal;

      // Asegúrate de que cada publicación tenga el estado 'destacado'
      this.publicacionesVisibles = this.publicaciones.slice(0, this.batchSize);

      // No es necesario hacer nada más porque el estado de 'destacado' se trae correctamente desde la base de datos
      this.publicacionesVisibles.forEach(pub => {
        pub.destacado = pub.destacado || false;  // Asegúrate de que el campo 'destacado' esté definido
      });

      this.loading = false;
    },
    error: err => {
      console.error("Error cargando publicaciones:", err);
      this.loading = false;
    }
  });
}

// Función para destacar o desmarcar la publicación
  destacarPublicacion(publicacion: any) {
  const destacado = !publicacion.destacado;

  this.canalesService.destacarPublicacion(
      this.canal.idCanal,
      publicacion.idPublicacion,
      destacado
  ).subscribe({
    next: () => {
      publicacion.destacado = destacado;
    },
    error: (err) => {
      console.error('Error al destacar/desmarcar publicación:', err);
    }
  });
}


// ===============================
// Scroll infinito → cargar más
// ===============================
onScroll(event: any) {
  const elem = event.target;

  // Si ya cargamos todo, no hacemos nada
  if (this.publicacionesVisibles.length >= this.publicaciones.length) return;

  // Detectar si estamos abajo del todo
  if (!this.cargandoMas && elem.scrollTop + elem.clientHeight >= elem.scrollHeight - 50) {
    this.cargandoMas = true;

    setTimeout(() => {
      const next = this.publicacionesVisibles.length + this.batchSize;
      this.publicacionesVisibles = this.publicaciones.slice(0, next);
      this.cargandoMas = false;
    }, 400);
  }
}


  abrirCrearPublicacion() {
    this.crearPublicacionVisible = true;
  }

  cerrarCrearPublicacion() {
    this.crearPublicacionVisible = false;
    this.cargarPublicaciones();
  }

   logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }

}
