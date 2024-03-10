import { Pipe, type PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

@Pipe({
  name: 'imageUser',
})
export class ImageUserPipe implements PipeTransform {
  private readonly apiUrl = environment.apiUrl;

  transform(imagenUsuario: string | undefined): string {

    if (imagenUsuario !== undefined && imagenUsuario !== '') {
      // Se realiza una petición HEAD para verificar la existencia del archivo de imagen en el servidor.
      const http = new XMLHttpRequest();
      http.open('HEAD', `${this.apiUrl}/profile/${imagenUsuario}`, false);
      http.send();

      if (http.status === 200) {
        // Verificar si la respuesta contiene un Content-Length, lo que indica que el archivo existe
        const contentLength = http.getResponseHeader('Content-Length');
        if (contentLength && parseInt(contentLength) > 0) {
          return `${this.apiUrl}/profile/${imagenUsuario}`;
        }
      }
    }

    // Si no hay imagen de perfil, se devuelve la imagen predeterminada.
    return `${this.apiUrl}/profile/no-image.png`;
  }

}
