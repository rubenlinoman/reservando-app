import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-room-images',
  templateUrl: './room-images.component.html',
  styleUrl: './room-images.component.css',
})
export class RoomImagesComponent {
  private _img: string = '';
  public readonly apiUrl = environment.apiUrl;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { imagen: string }) {
    this._img = data.imagen;
  }

  getImg() {
    return this._img;
  }
}
