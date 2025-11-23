import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CanalesService {

  constructor(private apollo: Apollo) {}

  getCanalesActivos(): Observable<any> {
    return this.apollo.watchQuery({
      query: gql`
        query {
          canalesActivos {
            idCanal
            nombre
            slug
            tipo
            descripcion
            activo
          }
        }
      `
    }).valueChanges;
  }

  // ============================
  //  🔹 CANALES SEGUIDOS
  // ============================
  canalesSeguidos(idUsuario: number) {
  return this.apollo.query({
    query: gql`
      query canalesSeguidos($idUsuario: ID!) {
        canalesSeguidos(idUsuario: $idUsuario) {
          idCanal
          nombre
          slug
          tipo
        }
      }
    `,
    variables: { idUsuario: String(idUsuario) },
    fetchPolicy: 'no-cache'
  });
}


  // ============================
  //  🟢 SEGUIR CANAL
  // ============================
  seguirCanal(idCanal: number, idUsuario: number) {
  return this.apollo.mutate({
    mutation: gql`
      mutation seguir($idCanal: ID!, $idUsuario: ID!) {
        seguirCanal(idCanal: $idCanal, idUsuario: $idUsuario)
      }
    `,
    variables: { 
      idCanal: String(idCanal),
      idUsuario: String(idUsuario)
    }
  });
}

  // ============================
  //  🔴 DEJAR DE SEGUIR
  // ============================
  dejarSeguir(idCanal: number, idUsuario: number) {
  return this.apollo.mutate({
    mutation: gql`
      mutation dejar($idCanal: ID!, $idUsuario: ID!) {
        dejarDeSeguirCanal(idCanal: $idCanal, idUsuario: $idUsuario)
      }
    `,
    variables: { 
      idCanal: String(idCanal),
      idUsuario: String(idUsuario)
    }
  });
}

  crearCanal(input: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation CrearCanal($input: CrearCanalInput!) {
          crearCanal(input: $input) {
            idCanal
            nombre
            slug
          }
        }
      `,
      variables: { input }
    });
  }

  publicacionesDeCanal(idCanal: number) {
    return this.apollo.query({
        query: gql`
        query publicacionesDeCanal($idCanal: ID!) {
            publicacionesDeCanal(idCanal: $idCanal) {
            idPublicacion
            titulo
            observacion
            estado
            fechaPublicacion
            destacado
            autor {
                idUsuario
                nombre
                apellido
                rolPrincipal
            }
            }
        }
        `,
        variables: { idCanal: String(idCanal) }, // 🔥 convertir a string
        fetchPolicy: 'no-cache'
    });
    }

    // Mutación para destacar/desmarcar publicación
  destacarPublicacion(idCanal: number, idPublicacion: number, destacado: boolean) {
    return this.apollo.mutate({
      mutation: gql`
        mutation destacarPublicacion($idCanal: ID!, $idPublicacion: ID!, $destacado: Boolean!) {
          destacarPublicacion(idCanal: $idCanal, idPublicacion: $idPublicacion, destacado: $destacado)
        }
      `,
      variables: { 
        idCanal: String(idCanal),
        idPublicacion: String(idPublicacion),
        destacado: destacado
      }
    });
  }


  crearPublicacionEnCanal(input: any) {
    return this.apollo.mutate({
      mutation: gql`
        mutation crearPublicacionEnCanal($input: CrearPublicacionEnCanalInput!) {
          crearPublicacionEnCanal(input: $input) {
            idPublicacion
            titulo
            observacion
            estado
            fechaPublicacion
          }
        }
      `,
      variables: { input }
    });
  }

  feedCanalesSeguidos(idUsuario: number) {
  return this.apollo.query({
    query: gql`
      query feedCanalesSeguidos($idUsuario: ID!) {
        feedCanalesSeguidos(idUsuario: $idUsuario) {
          idPublicacion
          titulo
          observacion
          estado
          fechaPublicacion
          destacado
          autor {
            idUsuario
            nombre
            apellido
            rolPrincipal
          }
          canales {
            idCanal
            nombre
            slug
            tipo
            descripcion
            activo
          }
        }
      }
    `,
    variables: { idUsuario: String(idUsuario) },
    fetchPolicy: 'no-cache'
  });
}
}
