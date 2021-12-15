import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'popup',
    loadChildren: () => import('./modules/popup/popup.module').then(m => m.PopupModule)
  },
  {
    path: 'options',
    loadChildren: () => import('./modules/options/options.module').then(m => m.OptionsModule)
  },
  {
    path: 'options',
    loadChildren: () => import('./modules/options/options.module').then(m => m.OptionsModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
