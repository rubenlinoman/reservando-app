// src/modules/web/pages/details-page/details-page.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alojamiento, Habitacion } from 'src/modules/shared/interfaces';
import { WebService } from '../../services/web.service';
import { environment } from 'src/environments/environment';
import { MatDialog } from '@angular/material/dialog';
import { ImageDetailsComponent } from './image-details/image-details.component';

@Component({
  selector: 'web-details-page',
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css'
})
export class DetailsPageComponent {
  private webService = inject(WebService);
  private route = inject(ActivatedRoute);
  public readonly apiUrl = environment.apiUrl;

  public accommodation: Alojamiento;
  public rooms: Habitacion[] = [];

  constructor(public dialog: MatDialog) {
    // Obtener el alojamiento por ID
    const id = this.route.snapshot.params['id'];
    this.webService.getAccommodationById(id).subscribe((accommodation) => {
      this.accommodation = accommodation;
    });

    // Obtener las habitaciones del alojamiento
    this.webService.getRoomsByAccommodationId(id).subscribe((rooms) => {
      this.rooms = rooms;
    });
  }

  /**
   * Método para mostrar la imagen en un dialog
   * @param archivo - Archivo
   */
  showImage(imagen: string) {
    const dialogRef = this.dialog.open(ImageDetailsComponent, {
      data: { imagen: imagen }
    });
  }
}
