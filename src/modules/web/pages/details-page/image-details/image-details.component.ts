import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'web-image-details',
  templateUrl: './image-details.component.html',
  styleUrl: './image-details.component.css',
})
export class ImageDetailsComponent {
  private _img: string = '';
  public readonly apiUrl = environment.apiUrl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imagen: string }) {
    this._img = data.imagen;
  }

  getImg() {
    return this._img;
  }
}
