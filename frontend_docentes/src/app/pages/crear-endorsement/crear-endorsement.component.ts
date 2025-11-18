import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-crear-endorsement',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-endorsement.html',
  styleUrls: ['./crear-endorsement.css']
})
export class CrearEndorsementComponent implements OnChanges {

  @Input() visible: boolean = false;
  @Input() fromUserId: number | null = null;

  @Output() cerrar = new EventEmitter<void>();

  todosUsuarios: any[] = [];
  resultados: any[] = [];
  textoBuscador: string = "";

  endorsement = {
    toUserId: null,
    skill: '',
    message: ''
  };

  constructor(private http: HttpClient) {}

  ngOnChanges() {
    if (this.visible && this.todosUsuarios.length === 0) {
      this.cargarTodosLosUsuarios();
    }
  }

  cargarTodosLosUsuarios() {
    const query = `
      query {
        usuarios {
          idUsuario
          nombre
          apellido
          email
          rolPrincipal
        }
      }
    `;

    this.http.post('/graphql', { query }).subscribe((res: any) => {
      this.todosUsuarios = res.data?.usuarios ?? [];
    });
  }

  /** 🔥 RESETEA TODO EL FORMULARIO */
  resetFormulario() {
    this.textoBuscador = "";
    this.endorsement = {
      toUserId: null,
      skill: '',
      message: ''
    };
    this.resultados = [];
  }

  cerrarModal() {
    this.resetFormulario();  // 👈 limpia el form
    this.visible = false;
    this.cerrar.emit();
  }

  buscarUsuarios(event: any) {
    const texto = event.target.value.toLowerCase().trim();

    if (texto.length < 2) {
      this.resultados = [];
      return;
    }

    this.resultados = this.todosUsuarios.filter(u =>
      (u.nombre + ' ' + u.apellido).toLowerCase().includes(texto)
    );
  }

  seleccionarUsuario(u: any) {
    this.endorsement.toUserId = u.idUsuario;
    this.textoBuscador = `${u.nombre} ${u.apellido}`;
    this.resultados = [];
  }

  enviar() {
    if (!this.endorsement.toUserId || !this.endorsement.skill || !this.endorsement.message) {
      alert("Debe completar todos los campos");
      return;
    }

    const query = `
      mutation CreateEndorsement($input: CreateEndorsementInput!) {
        createEndorsement(input: $input) {
          idEndorsement
          status
          createdAt
        }
      }
    `;

    const variables = {
      input: {
        fromUserId: Number(this.fromUserId),
        toUserId: Number(this.endorsement.toUserId),
        skill: this.endorsement.skill,
        message: this.endorsement.message
      }
    };

    this.http.post('/graphql', { query, variables }).subscribe({
      next: (res: any) => {
        if (res.errors) {
          console.error(res.errors);
          alert("Error al crear endorsement");
          return;
        }

        alert("Endorsement creado con éxito");

        this.resetFormulario();   // 👈 limpia después de enviar
        this.cerrarModal();
      },
      error: (err) => {
        console.error(err);
        alert("Error al crear endorsement");
      }
    });
  }
}
