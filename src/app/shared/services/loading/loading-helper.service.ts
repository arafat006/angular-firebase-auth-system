import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LoadingHelperService {

  loadingOverlay: any;

  constructor() { 
    this.loadingOverlay = document.body.getElementsByClassName('loading-overlay').item(0);
  }

  addLoadingOverlay(): void {
    this.loadingOverlay.style.display = 'block' ;
  }

  removeLoadingOverlay(): void {
    this.loadingOverlay.style.display = 'none' ;
  }
}
