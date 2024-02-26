import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CarouselService {

  private startIndex = 0;
  private lastIndex = 2;
  private items = [
    {
      stock: 'AAPL',
      img: 'https://placeimg.com/350/150/any',
    },
    // Agrega el resto de tus ítems aquí
  ];
  public mediator = [this.items[0], this.items[1], this.items[2]];

  leftClick() {
    const items = this.items;
    const mediator = this.mediator;

    // Obtener el índice del primer elemento actual en el array de items
    const currentIndex = items.indexOf(mediator[0]);

    // Si currentIndex es mayor que 0, hay elementos anteriores en el array
    if (currentIndex > 0) {
      // Mover el índice de inicio y fin del carousel
      this.startIndex = currentIndex - 1;
      this.lastIndex = currentIndex + 1;

      // Actualizar el array mediator con los nuevos elementos
      this.mediator = items.slice(this.startIndex, this.lastIndex + 1);
    } else {
      // Si currentIndex es 0, estamos en el primer elemento, así que mostramos los últimos elementos del array
      this.startIndex = items.length - 2;
      this.lastIndex = items.length - 1;

      // Actualizar el array mediator con los nuevos elementos
      this.mediator = items.slice(this.startIndex).concat(items.slice(0, 1));
    }
  }

  rightClick() {
    const items = this.items;
    const mediator = this.mediator;

    // Obtener el índice del último elemento actual en el array de items
    const currentIndex = items.indexOf(mediator[mediator.length - 1]);

    // Si currentIndex es menor que el último índice del array, hay elementos siguientes en el array
    if (currentIndex < items.length - 1) {
      // Mover el índice de inicio y fin del carousel
      this.startIndex = currentIndex;
      this.lastIndex = currentIndex + 2;

      // Actualizar el array mediator con los nuevos elementos
      this.mediator = items.slice(this.startIndex, this.lastIndex + 1);
    } else {
      // Si currentIndex es el último índice del array, estamos en el último elemento, así que mostramos los primeros elementos del array
      this.startIndex = 0;
      this.lastIndex = 2;

      // Actualizar el array mediator con los nuevos elementos
      this.mediator = items.slice(0, 3);
    }
  }


}
