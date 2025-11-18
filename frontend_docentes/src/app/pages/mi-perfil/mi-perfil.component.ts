import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';  
import { LoginService } from '../../services/login.service';  
import { RouterLink } from '@angular/router';
import { EditarPerfilComponent } from '../editar-perfil/editar-perfil.component';  


@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, EditarPerfilComponent, RouterLink],  
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  usuario: any;
  nombreCompleto: string = '';
  rol: string = '';  
  modalVisible: boolean = false;  
  perfilData: any = {};  
  perfilDataCopy: any = {};  
  isLoading: boolean = true; // Indicador de carga para la UI

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    const usuarioStorage = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    if (usuarioStorage && usuarioStorage.idUsuario) {
      this.loadUserData(usuarioStorage.idUsuario);
    } else {
      this.isLoading = false;
    }
  }

  /**
   * Carga los datos completos del usuario (generales + específicos del rol).
   * @param idUsuario ID del usuario a cargar.
   */
  loadUserData(idUsuario: string): void {
    this.isLoading = true;
    
    // Obtener los detalles generales del usuario
    this.loginService.obtenerDetallesUsuario(idUsuario).subscribe({
      next: (data: any) => {
        const userDetails = data.data.usuario;
        this.usuario = userDetails;

        const rol = this.usuario.rolPrincipal === 'profesor' ? 'Prof.' :
                    this.usuario.rolPrincipal === 'investigador' ? 'Inv.' : '';
        
        this.nombreCompleto = `${rol} ${this.usuario.nombre} ${this.usuario.apellido}`;
        this.rol = this.usuario.rolPrincipal;

        // Si el usuario es profesor, obtener datos adicionales
        if (this.usuario.rolPrincipal === 'profesor') {
          this.loginService.obtenerProfesorConUsuario(this.usuario.idUsuario).subscribe((profData: any) => {
            this.usuario.profesorData = profData.data.obtenerProfesorConUsuario.profesor;
            this.isLoading = false;
          });
        } else if (this.usuario.rolPrincipal === 'investigador') {
          this.loginService.obtenerInvestigadorConUsuario(this.usuario.idUsuario).subscribe((invData: any) => {
            this.usuario.investigadorData = invData.data.obtenerInvestigadorConUsuario.investigador;
            this.isLoading = false;
          });
        } else {
            this.isLoading = false;
        }
      },
      error: (error: any) => {
        console.error('Error al cargar datos del usuario:', error);
        this.isLoading = false;
      }
    });
  }

  openModal() {
    // 1. Crear copia aplanada de los datos para el formulario
    this.perfilDataCopy = { 
        ...this.usuario, 
        password: '', // Aseguramos que la contraseña siempre esté vacía por defecto
    };
    
    // 2. Fusionar datos específicos del rol
    if (this.usuario.rolPrincipal === 'profesor' && this.usuario.profesorData) {
      this.perfilDataCopy = { 
        ...this.perfilDataCopy, 
        ...this.usuario.profesorData,
      };
    } else if (this.usuario.rolPrincipal === 'investigador' && this.usuario.investigadorData) {
      this.perfilDataCopy = { 
        ...this.perfilDataCopy, 
        ...this.usuario.investigadorData,
      };
    }
    
    this.modalVisible = true;
  }

  closeModal() {
    this.modalVisible = false;  // Cierra el modal, permitiendo que se vuelva a abrir
  }

  /**
   * Maneja el evento de actualización exitosa del componente hijo.
   * Recarga todos los datos del usuario para refrescar la UI.
   */
  updateProfileData(updatedResponse: any) {
    console.log('Datos actualizados recibidos. Recargando perfil...');
    
    if (this.usuario && this.usuario.idUsuario) {
        // Recargar los datos desde la API para asegurar la consistencia total
        this.loadUserData(this.usuario.idUsuario);
    }
  }

  logout() {
      localStorage.clear();
      location.href = '/login';
    }
}