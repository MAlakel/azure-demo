import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

// Third Party
import { QRCodeModule } from 'angularx-qrcode';
import { QrComponent } from './qr/qr.component';

@NgModule({
  declarations: [
    AppComponent,
    QrComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    QRCodeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
