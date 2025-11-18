import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';  // Asegúrate de importar FormsModule
import { MiPerfilComponent } from './mi-perfil.component';  // Importa el componente standalone

@NgModule({
  imports: [
    CommonModule,
    FormsModule,   // Asegúrate de agregar FormsModule aquí
    MiPerfilComponent  // Solo importa el componente, no lo declares
  ]
})
export class MiPerfilModule { }
