import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CanalCrearComponent } from '../canal-crear/canal-crear.component';
import { CanalesService } from '../../../services/canales.service';

@Component({
  selector: 'app-canales-list',
  standalone: true,
  imports: [CommonModule, CanalCrearComponent, RouterModule],
  templateUrl: './canales-list.component.html',
  styleUrls: ['./canales-list.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CanalesListComponent implements OnInit {

  canales: any[] = [];
  loading = true;
  error = false;

  usuario: any;
  nombreCompleto: string = "";

  // ⚠️ Ahora NO lo inicializamos desde localStorage directo
  idUsuario: number | null = null;

  // === MODAL CREAR CANAL ===
  modalCrearVisible = false;

    feed: any[] = [];
    feedVisibles: any[] = [];
    feedBatch = 6;
    feedLoading = true;
    feedCargandoMas = false;

selectedTipo: string = 'OFERTAS';  // Tipo por defecto

  constructor(
    private canalesService: CanalesService,
    private router: Router
  ) {}

  ngOnInit(): void {

    // Traer usuario desde localStorage
    this.usuario = JSON.parse(localStorage.getItem('usuario') || 'null');

    if (this.usuario) {
      const rol =
        this.usuario.rolPrincipal === 'profesor'
          ? 'Prof.'
          : this.usuario.rolPrincipal === 'investigador'
            ? 'Inv.'
            : '';

      this.nombreCompleto = `${rol} ${this.usuario.nombre} ${this.usuario.apellido}`;

      // ✅ Tomamos SIEMPRE el idUsuario desde el objeto usuario
      this.idUsuario = this.usuario.idUsuario;
    }

    this.cargarCanales();
    this.cargarFeed();
  }

  cargarCanales() {
  this.loading = true;

  this.canalesService.getCanalesActivos().subscribe({
    next: (res: any) => {
      const activos = res.data.canalesActivos;

      this.canales = activos.map((c: any) => ({
        ...c,
        siguiendo: false
      }));

      console.log("Canales cargados:", this.canales);  // Verifica los canales cargados

      this.loading = false;

      // Marcar canales seguidos si el idUsuario es válido
      if (this.idUsuario) {
        this.canalesService.canalesSeguidos(this.idUsuario).subscribe({
          next: (resSeg: any) => {
            const idsSeguidos = resSeg.data.canalesSeguidos.map((x: any) => x.idCanal);

            this.canales = this.canales.map(c => ({
              ...c,
              siguiendo: idsSeguidos.includes(c.idCanal)
            }));
          },
          error: (err) => {
            console.error('Error al cargar canalesSeguidos:', err);
            this.loading = false;
          }
        });
      }
    },
    error: (err) => {
      console.error('ERROR getCanalesActivos:', err);
      this.error = true;
      this.loading = false;
    }
  });
}

cargarFeed() {
  if (!this.idUsuario) return;

  this.feedLoading = true;

  this.canalesService.feedCanalesSeguidos(this.idUsuario).subscribe({
    next: (res: any) => {
      this.feed = res.data.feedCanalesSeguidos;

      console.log("Feed recibido:", this.feed);

      // Ya NO buscamos canal por id. Usamos lo que ya viene.
      this.feedVisibles = this.feed.slice(0, this.feedBatch);

      this.feedLoading = false;
    },
    error: (err) => {
      console.error('Error cargando feed:', err);
      this.feedLoading = false;
    }
  });
}


onScrollFeed(event: any) {
  const div = event.target;

  if (this.feedCargandoMas) return;
  if (this.feedVisibles.length >= this.feed.length) return;

  // ¿Llegó al final?
  if (div.scrollTop + div.clientHeight >= div.scrollHeight - 50) {
    
    this.feedCargandoMas = true;

    setTimeout(() => {
      const next = this.feedVisibles.length + this.feedBatch;
      this.feedVisibles = this.feed.slice(0, next);

      this.feedCargandoMas = false;
    }, 400);
  }
}




  verDetalle(slug: string) {
    // Usa tu ruta actual, la dejo como la tenías
    this.router.navigate([`/canales/${slug}`]);
  }

  toggleFollow(canal: any) {

  if (!this.idUsuario) return;

  if (canal.siguiendo) {
    // 🔴 DEJAR DE SEGUIR
    this.canalesService.dejarSeguir(canal.idCanal, this.idUsuario).subscribe({
      next: () => {
        canal.siguiendo = false;

        // 🔥 actualizar feed en tiempo real
        this.cargarFeed();
      }
    });

  } else {
    // 🟢 SEGUIR
    this.canalesService.seguirCanal(canal.idCanal, this.idUsuario).subscribe({
      next: () => {
        canal.siguiendo = true;

        // 🔥 actualizar feed en tiempo real
        this.cargarFeed();
      }
    });
  }
}
    


  abrirModalCrear() {
    this.modalCrearVisible = true;
  }

  cerrarModalCrear() {
    this.modalCrearVisible = false;
    this.cargarCanales(); // Refrescar canales luego de crear
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
