import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class BuscarUsuariosService {

  constructor(private http: HttpClient) {}

  cargarTodos() {
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
    return this.http.post('/graphql', { query });
  }
}
