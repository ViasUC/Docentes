import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObtenerOportunidadesService {

  private readonly API_URL = '/graphql';

  constructor(private http: HttpClient) {}

  // 👉 SOLO oportunidades del creador (sin tocar el backend)
  listarOportunidadesPorCreador(idUsuario: number): Observable<any> {

    const query = `
      query {
        oportunidadesPorCreador(creadorId: ${idUsuario}) {
          idOportunidad
          titulo
          descripcion
          requisitos
          ubicacion
          modalidad
          tipo
          estado
          fechaPublicacion
        }
      }
    `;

    const body = { query };

    return this.http.post(this.API_URL, body);
  }
}
