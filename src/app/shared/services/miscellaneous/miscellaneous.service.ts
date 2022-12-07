import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MiscellaneousService {

  constructor() { }

  BooleanCustomConverter(value: Boolean) {
    switch (value) {
      case true:
        return 'Yes';
      case false:
        return 'No';
      default:
        return '';
    }
  }
}
