import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QrComponent } from './qr/qr.component';

const routes: Routes = [
  { path: ':id', component: QrComponent },
  { path: '', redirectTo: '/memberId', pathMatch: 'prefix' },
  { path: '**', redirectTo: '', pathMatch: 'prefix' },
  // { path: 'client', redirectTo: 'client/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
