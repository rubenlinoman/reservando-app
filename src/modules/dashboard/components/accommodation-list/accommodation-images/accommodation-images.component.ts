import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'dashboard-accommodation-images',
  templateUrl: './accommodation-images.component.html',
  styleUrl: './accommodation-images.component.css',
})
export class AccommodationImagesComponent {
  private _img: string = '';
  public readonly apiUrl = environment.apiUrl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imagen: string }) {
    this._img = data.imagen;
  }

  getImg() {
    return this._img;
  }
}
