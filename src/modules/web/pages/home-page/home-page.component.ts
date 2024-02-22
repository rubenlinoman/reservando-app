import { Component, inject } from '@angular/core';
import { environment } from 'src/environments/environment';
import { WebService } from '../../services/web.service';
import { Alojamiento } from 'src/modules/shared/interfaces';

@Component({
  selector: 'web-home-page',
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.css'
})
export class HomePageComponent {
  public readonly apiUrl = environment.apiUrl;

  private weService = inject(WebService);

  public accommodations: Alojamiento[] = [];

  constructor() {
    this.weService.getAllAccommodationsNoTokenCheck().subscribe((accommodations) => {
      this.accommodations = accommodations;
      console.log('accommodations', this.accommodations);
    });
  }
}
