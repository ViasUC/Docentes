import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly API_URL = '/graphql'; // Usando el proxy

  constructor(private http: HttpClient) {}

  login(email: string, password: string): Observable<any> {
    const body = {
      query: `
        mutation Login($input: LoginInput!) {
          login(input: $input) {
            idUsuario
            nombre
            apellido
            rolPrincipal
          }
        }
      `,
      variables: {
        input: {
          email,
          password
        }
      }
    };

    return this.http.post(this.API_URL, body);
  }

  // Función para obtener los detalles completos del usuario
  obtenerDetallesUsuario(idUsuario: string): Observable<any> {
    const body = {
      query: `
        query obtenerDetallesUsuario($idUsuario: ID!) {
          usuario(id: $idUsuario) {
            idUsuario
            nombre
            apellido
            email
            telefono
            ubicacion
            rolPrincipal
            completitud
          }
        }
      `,
      variables: { idUsuario }
    };

    return this.http.post(this.API_URL, body);
  }

  // Obtener datos de Profesor si es un Profesor
  obtenerProfesorConUsuario(idUsuario: string): Observable<any> {
    const body = {
      query: `
        query obtenerProfesorConUsuario($idProfesor: ID!) {
          obtenerProfesorConUsuario(idProfesor: $idProfesor) {
            usuario {
              idUsuario
              nombre
              apellido
              email
              telefono
              ubicacion
              rolPrincipal
            }
            profesor {
              departamento
              categoriaDocente
              areasDocentes
            }
          }
        }
      `,
      variables: { idProfesor: idUsuario }
    };

    return this.http.post(this.API_URL, body);
  }

  // Obtener datos de Investigador si es un Investigador
  obtenerInvestigadorConUsuario(idUsuario: string): Observable<any> {
    const body = {
      query: `
        query obtenerInvestigadorConUsuario($idInvestigador: ID!) {
          obtenerInvestigadorConUsuario(idInvestigador: $idInvestigador) {
            usuario {
              idUsuario
              nombre
              apellido
              email
              telefono
              ubicacion
              rolPrincipal
            }
            investigador {
              areasInvestigacion
              afiliaciones
              hindex
            }
          }
        }
      `,
      variables: { idInvestigador: idUsuario }
    };

    return this.http.post(this.API_URL, body);
  }

  // Método para actualizar perfil de Docente
  actualizarDocente(usuario: any): Observable<any> {
    const body = {
      query: `
        mutation actualizarProfesor($id: ID!, $input: ProfesorInput!) {
          actualizarProfesor(id: $id, input: $input) {
            usuario { nombre email }
            departamento
            categoriaDocente
          }
        }
      `,
      variables: {
        id: usuario.idUsuario,
        input: {
          usuario: {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            password: usuario.password // Asegúrate de que la contraseña sea opcional
          },
          departamento: usuario.profesorData.departamento,
          categoriaDocente: usuario.profesorData.categoriaDocente
        }
      }
    };

    return this.http.post(this.API_URL, body);
  }

  // Método para actualizar perfil de Investigador
  actualizarInvestigador(usuario: any): Observable<any> {
    const body = {
      query: `
        mutation actualizarInvestigador($id: ID!, $input: InvestigadorInput!) {
          actualizarInvestigador(id: $id, input: $input) {
            idUsuario
            areasInvestigacion
            afiliaciones
            hindex
            usuario { nombre email }
          }
        }
      `,
      variables: {
        id: usuario.idUsuario,
        input: {
          usuario: {
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            password: usuario.password,  // Asegúrate de que la contraseña sea opcional
            ubicacion: usuario.ubicacion
          },
          areasInvestigacion: usuario.investigadorData.areasInvestigacion,
          afiliaciones: usuario.investigadorData.afiliaciones,
          hindex: usuario.investigadorData.hindex
        }
      }
    };

    return this.http.post(this.API_URL, body);
  }
}
