import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly API_URL = '/graphql'; // usando el proxy

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
}
