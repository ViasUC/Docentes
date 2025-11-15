import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class OportunidadService {

  private url = 'http://localhost:8080/graphql';

  constructor(private http: HttpClient) {}

  crearOportunidadDocente(input: any) {
    const query = `
      mutation CrearOportunidadDocente($input: CrearOportunidadInput!) {
        crearOportunidadDocente(input: $input) {
          idOportunidad
          titulo
          estado
          fechaPublicacion
          creador { idUsuario nombre email }
        }
      }
    `;

    return this.http.post<any>(this.url, {
      query,
      variables: { input }
    }).pipe(map(res => res.data.crearOportunidadDocente));
  }

}
