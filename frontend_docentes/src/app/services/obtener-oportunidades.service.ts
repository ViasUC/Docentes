import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ObtenerOportunidadesService {

  private readonly API_URL = '/graphql';

  constructor(private http: HttpClient) {}

  listarActivasPorCreador(idUsuario: number): Observable<any> {
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
          fechaCierre
        }
      }
    `;

    return this.http.post(this.API_URL, { query }).pipe(
      map((res: any) =>
        (res.data?.oportunidadesPorCreador ?? [])//.filter((o: any) => o.estado === 'activo')
      )
    );
  }

  listarTodasPorCreador(id: number) {
    const query = `
      query {
        oportunidadesPorCreador(creadorId: ${id}) {
          idOportunidad
          titulo
          descripcion
          requisitos
          ubicacion
          modalidad
          tipo
          estado
          fechaPublicacion
          fechaCierre
        }
      }
    `;

    return this.http.post(this.API_URL, { query }).pipe(
      map((res: any) => res.data?.oportunidadesPorCreador ?? [])
    );
  }

}
