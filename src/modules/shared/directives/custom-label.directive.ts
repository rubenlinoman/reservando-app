import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[customLabel]'
})
export class CustomLabelDirective implements OnInit {

  private htmlElement?: ElementRef<HTMLElement>;
  private _errors?: ValidationErrors | null;


  @Input() set errors( value: ValidationErrors | null | undefined) {
    this._errors = value;
    this.setErrorMessage();
  }

  constructor( private el: ElementRef<HTMLElement> ) {
    this.htmlElement = el;
  }


  ngOnInit(): void {
    console.log('Directiva onInit');

    this.setStyle();
  }

  setStyle(): void {
    if ( !this.htmlElement ) return;

    this.htmlElement!.nativeElement.style.fontSize = '12px';
  }

  setErrorMessage(): void {

    if ( !this.htmlElement ) return;

    if ( !this._errors ) {
      this.htmlElement.nativeElement.innerText = "No hay errores";
      return;
    }

    const errors = Object.keys(this._errors);

    if( errors.includes('required') ) {
      this.htmlElement.nativeElement.innerText = "Este campo es requerido";
      return;
    }

    if( errors.includes('minlength') ) {
      //console.log(this._errors["minlength"]["requiredLength"]);
      this.htmlElement.nativeElement.innerText = `Este campo debe tener al menos ${ this._errors["minlength"]["requiredLength"] } caracteres`;
      return;
    }

    if( errors.includes('email') ) {
      this.htmlElement.nativeElement.innerText = "Este campo debe contener un email";
      return;
    }

    if( errors.includes('notEqual') ) {
      this.htmlElement.nativeElement.innerText = "Los campos deben coincidir";
      return;
    }

    if( errors.includes('not18') ) {
      this.htmlElement.nativeElement.innerText = "Debe ser mayor de edad";
      return;
    }

  }

}
