import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FormErrorNormalizeService {

  constructor() { }

  get(field: string | null, error: string | null): string | null {
    if (!field) {
      field = '';
    }

    switch(error) { 
      case null : {
        return null;
      }
      case '' : {
        return null;
      }
      case 'required': { 
        return this.convertSentenceCase(`${field} is required`); 
      } 
      case 'pattern': 
      case 'email': { 
        return this.convertSentenceCase(`invalid ${field}`); 
      } 
      case 'minlength': { 
        return this.convertSentenceCase(`${field} is too short`); 
      } 
      case 'maxlength': { 
        return this.convertSentenceCase(`${field} is too large`); 
      } 
      default: { 
        return "Something went wrong!";
      } 
   } 
  }

  convertSentenceCase(string: string | null): string {
    return string === null ? '' : string.charAt(0).toUpperCase() + string.slice(1);
  }
}
