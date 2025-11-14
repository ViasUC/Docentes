import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObtenerOportunidadesService {

  private readonly API_URL = '/graphql';  // Usando el proxy

  constructor(private http: HttpClient) {}

  listarOportunidades(): Observable<any> {
    const query = {
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
    };

    return this.http.post(this.API_URL, query);
  }
}
