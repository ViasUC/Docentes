import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule aquí
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],  // Aquí es donde añades FormsModule
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {
  usuario: any;
  nombreCompleto: string = '';
  rol: string = '';
  modalVisible: boolean = false;  // Propiedad para controlar la visibilidad del modal

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    // Obtener el usuario desde el localStorage
    this.usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    
    if (this.usuario) {
      // Obtener los datos completos del usuario
      this.loginService.obtenerDetallesUsuario(this.usuario.idUsuario).subscribe((data: any) => {
        this.usuario = data.data.usuario;

        const rol = this.usuario.rolPrincipal === 'profesor' ? 'Docente' :
                    this.usuario.rolPrincipal === 'investigador' ? 'Investigador' : '';
        
        this.nombreCompleto = `${rol} ${this.usuario.nombre} ${this.usuario.apellido}`;
        this.rol = this.usuario.rolPrincipal;

        if (this.usuario.rolPrincipal === 'profesor') {
          this.loginService.obtenerProfesorConUsuario(this.usuario.idUsuario).subscribe((data: any) => {
            this.usuario.profesorData = data.data.obtenerProfesorConUsuario.profesor;
          });
        } else if (this.usuario.rolPrincipal === 'investigador') {
          this.loginService.obtenerInvestigadorConUsuario(this.usuario.idUsuario).subscribe((data: any) => {
            this.usuario.investigadorData = data.data.obtenerInvestigadorConUsuario.investigador;
          });
        }
      });
    }
  }

  // Abre el modal
  openModal() {
    this.modalVisible = true;
  }

  // Cierra el modal
  closeModal() {
    this.modalVisible = false;
  }

  // Guarda los cambios en el perfil
  saveChanges() {
  // Llamar al servicio para actualizar los datos del perfil
  if (this.usuario.rolPrincipal === 'profesor') {
    this.loginService.actualizarDocente(this.usuario).subscribe(
      response => {
        console.log('Perfil de docente actualizado:', response);
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        this.closeModal();
      },
      error => {
        console.error('Error al actualizar el perfil de docente:', error);
      }
    );
  } else if (this.usuario.rolPrincipal === 'investigador') {
    this.loginService.actualizarInvestigador(this.usuario).subscribe(
      response => {
        console.log('Perfil de investigador actualizado:', response);
        localStorage.setItem('usuario', JSON.stringify(this.usuario));
        this.closeModal();
      },
      error => {
        console.error('Error al actualizar el perfil de investigador:', error);
      }
    );
  }
}

}
