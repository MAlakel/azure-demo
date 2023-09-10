import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrComponent } from './qr/qr.component';

const routes: Routes = [
  { path: '', redirectTo: 'client/', pathMatch: 'full' },
  { path: '**', redirectTo: 'client/', pathMatch: 'full' },
  // { path: 'client', redirectTo: 'client/' },
  { path: 'client/:id', component: QrComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
