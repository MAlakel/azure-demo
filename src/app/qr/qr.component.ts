import { Component, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-qr',
  templateUrl: './qr.component.html',
  styleUrls: ['./qr.component.css']
})
export class QrComponent {
  currentURL!: string;
  /**
   *
   */
  constructor(@Inject(DOCUMENT) private document: any) {
  }

  ngOnInit() {
    this.currentURL = document.location.href
    console.log(this.currentURL); // FULL URL
  }
}
