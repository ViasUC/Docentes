import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';  // Importa CommonModule
import { FormsModule } from '@angular/forms';  // Importa FormsModule para usar ngModel
import { LoginService } from '../../services/login.service';  // Importa el servicio de Login

@Component({
  selector: 'app-editar-perfil',
  templateUrl: './editar-perfil.component.html',
  styleUrls: ['./editar-perfil.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]  // Asegúrate de importar FormsModule aquí
})
export class EditarPerfilComponent implements OnChanges {
  @Input() modalVisible: boolean = false;
  @Input() perfilData: any = {};  

  // 1. Declarar los Outputs para comunicar eventos al componente padre
  @Output() closeModal = new EventEmitter<void>(); // Se usará para cerrar el modal (Cancelar y Guardar)
  @Output() updateData = new EventEmitter<any>(); // Usado para notificar la actualización exitosa

  constructor(private loginService: LoginService) {}

  ngOnChanges(changes: SimpleChanges) {
    // ...
  }

  // 2. Función para manejar el cierre (Cancelación). Emite el evento.
  onCancel() {
    this.closeModal.emit(); 
  }
  

  submitChanges() {
    this.updateProfile();
  }

  updateProfile() {
    if (this.perfilData.rolPrincipal === 'profesor') {
      this.updateDocente();
    } else if (this.perfilData.rolPrincipal === 'investigador') {
      this.updateInvestigador();
    }
  }

  // Método para actualizar docente
  updateDocente() {
    // Reconstruir la estructura que espera el servicio (anidando profesorData)
    const dataToSend = {
        ...this.perfilData, 
        profesorData: {
            departamento: this.perfilData.departamento,
            categoriaDocente: this.perfilData.categoriaDocente,
            areasDocentes: this.perfilData.areasDocentes,
        }
    };

    // Usar la sintaxis next/error para un manejo moderno
    this.loginService.actualizarDocente(dataToSend).subscribe({
        next: (response: any) => {
            console.log('Perfil de docente actualizado', response);
            this.onCancel(); // Cerrar el modal
            this.updateData.emit(response); // Notificar al padre la respuesta exitosa
        },
        error: (error: any) => {
            console.error('Error al actualizar perfil de docente:', error);
            // Implementar lógica de manejo de errores aquí (e.g., mostrar mensaje de error)
        }
    });
  }

  // Método para actualizar investigador
  updateInvestigador() {
    // Reconstruir la estructura que espera el servicio (anidando investigadorData)
    const dataToSend = {
        ...this.perfilData,
        investigadorData: {
            areasInvestigacion: this.perfilData.areasInvestigacion,
            afiliaciones: this.perfilData.afiliaciones,
            hindex: this.perfilData.hindex,
        }
    };

    this.loginService.actualizarInvestigador(dataToSend).subscribe({
        next: (response: any) => {
            console.log('Perfil de investigador actualizado', response);
            this.onCancel(); // Cerrar el modal
            this.updateData.emit(response); // Notificar al padre la respuesta exitosa
        },
        error: (error: any) => {
            console.error('Error al actualizar perfil de investigador:', error);
            // Implementar lógica de manejo de errores aquí (e.g., mostrar mensaje de error)
        }
    });
  }
}