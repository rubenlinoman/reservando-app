import { Component, OnInit } from '@angular/core';
import { ReservAndoConfig } from 'src/modules/dashboard/reservando-config';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.scss']
})
export class ConfigurationComponent implements OnInit {
  // public method
  styleSelectorToggle!: boolean; // open configuration menu
  fontFamily: string;
  setFontFamily!: string;

  ngOnInit(): void {
    this.setFontFamily = ReservAndoConfig.fontFamily;
    this.setfontFamily(this.setFontFamily);
  }

  setfontFamily(font) {
    this.setFontFamily = font;
    (document.querySelector('body') as HTMLBodyElement).classList.remove('Roboto');
    (document.querySelector('body') as HTMLBodyElement).classList.remove('poppins');
    (document.querySelector('body') as HTMLBodyElement).classList.remove('inter');
    (document.querySelector('body') as HTMLBodyElement).classList.add(font);
  }
}
