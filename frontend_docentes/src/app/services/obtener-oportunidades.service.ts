import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ObtenerOportunidadesService {

  private readonly API_URL = '/graphql';

  constructor(private http: HttpClient) {}

  listarOportunidades() {
    return this.http.post(this.API_URL, {
      query: `
        query listarOportunidades {
          oportunidades {
            idOportunidad
            titulo
            estado
            fechaPublicacion
          }
        }
      `
    });
  }
}
