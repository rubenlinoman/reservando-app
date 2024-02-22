// src/modules/web/pages/details-page/details-page.component.ts
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Alojamiento } from 'src/modules/shared/interfaces';
import { WebService } from '../../services/web.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'web-details-page',
  templateUrl: './details-page.component.html',
  styleUrl: './details-page.component.css',
})
export class DetailsPageComponent {

  private webService = inject(WebService);
  private route = inject(ActivatedRoute);
  public readonly apiUrl = environment.apiUrl;

  public accommodation: Alojamiento;

  constructor() {
    const id = this.route.snapshot.params['id'];
    console.log('id', id);

    this.webService.getAccommodationById(id).subscribe((accommodation) => {
      console.log('accommodation', accommodation);
      this.accommodation = accommodation;
    });
  }

}
